import makeWASocket, {
  DisconnectReason,
  fetchLatestBaileysVersion,
  useMultiFileAuthState
} from "@whiskeysockets/baileys";
import { Boom } from "@hapi/boom";
import path from "path";
import pino from "pino";
import QRCode from "qrcode";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AUTH_FOLDER = path.join(__dirname, "../../whatsapp-auth");

let sock = null;
let isConnected = false;
let connectionState = "disconnected";
let lastError = "";
let hasStarted = false;
let currentQR = null;
const messageQueue = [];

const connectToWhatsApp = async () => {
  const { state, saveCreds } = await useMultiFileAuthState(AUTH_FOLDER);
  const { version } = await fetchLatestBaileysVersion();

  connectionState = "connecting";
  lastError = "";
  console.log("Starting HMITLC WhatsApp Bot...");

  sock = makeWASocket({
    version,
    logger: pino({ level: "silent" }),
    auth: state,
    browser: ["HMITLC Bot", "Chrome", "1.0.0"],
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr, isNewLogin } = update;

    if (qr) {
      connectionState = "qr";
      console.log("WhatsApp QR Code generated - check Admin Panel");
      try {
        currentQR = await QRCode.toDataURL(qr);
      } catch (error) {
        console.error("QR generation error:", error);
      }
    }

    if (isNewLogin) {
      console.log("WhatsApp QR scanned. Saving session...");
    }

    if (connection === "connecting") {
      connectionState = "connecting";
      console.log("WhatsApp connecting...");
    }

    if (connection === "close") {
      isConnected = false;
      connectionState = "closed";
      const statusCode = new Boom(lastDisconnect?.error)?.output?.statusCode;
      const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
      lastError = lastDisconnect?.error?.message || `Disconnected with status ${statusCode || "unknown"}`;
      console.log("WhatsApp disconnected:", lastError);
      console.log("WhatsApp reconnecting:", shouldReconnect);
      if (shouldReconnect) {
        setTimeout(connectToWhatsApp, 5000);
      } else {
        connectionState = "logged_out";
        console.log("WhatsApp logged out. Delete backend/whatsapp-auth and restart server to scan again.");
      }
    }

    if (connection === "open") {
      isConnected = true;
      connectionState = "open";
      lastError = "";
      currentQR = null;
      console.log("HMITLC WhatsApp Bot connected successfully!");
      while (messageQueue.length > 0) {
        const { phone, message, sendVCard } = messageQueue.shift();
        await sendWhatsAppMessage(phone, message, sendVCard);
      }
    }
  });

  sock.ev.on("creds.update", async () => {
    await saveCreds();
    console.log("WhatsApp credentials saved.");
  });
};

const BOT_CONTACT = {
  name: "HMITLC Automated Bot",
  org: "Hasrat Mohani IT Literacy Centre",
  phone: "+92 300 1234567",
  waid: "923001234567"
};

export const sendWhatsAppMessage = async (phoneNumber, message, sendVCard = false) => {
  try {
    if (!phoneNumber) return;

    let formatted = phoneNumber.toString().replace(/\D/g, "");
    if (formatted.startsWith("0")) {
      formatted = `92${formatted.slice(1)}`;
    }
    if (!formatted.startsWith("92")) {
      formatted = `92${formatted}`;
    }

    const jid = `${formatted}@s.whatsapp.net`;

    if (!isConnected || !sock) {
      console.log("WhatsApp not connected. Queuing message for:", phoneNumber);
      messageQueue.push({ phone: phoneNumber, message, sendVCard });
      return;
    }

    await sock.sendMessage(jid, { text: message });

    if (sendVCard) {
      const vcard =
        "BEGIN:VCARD\n" +
        "VERSION:3.0\n" +
        `FN:${BOT_CONTACT.name}\n` +
        `ORG:${BOT_CONTACT.org};\n` +
        `TEL;type=CELL;type=VOICE;waid=${BOT_CONTACT.waid}:${BOT_CONTACT.phone}\n` +
        "END:VCARD";

      await sock.sendMessage(jid, {
        contacts: {
          displayName: BOT_CONTACT.name,
          contacts: [{ vcard }]
        }
      });
    }

    console.log(`WhatsApp sent to ${phoneNumber}`);
  } catch (error) {
    console.error("WhatsApp send error:", error.message);
  }
};

export const getWhatsAppStatus = () => ({
  isConnected,
  connectionState,
  queueLength: messageQueue.length,
  lastError,
  qrCode: currentQR
});

export const startWhatsAppService = () => {
  if (hasStarted) return;
  if (process.env.NODE_ENV === "production") {
    console.log("WhatsApp bot disabled in production (Vercel serverless).");
    return;
  }
  hasStarted = true;
  connectToWhatsApp().catch((error) => {
    lastError = error.message;
    connectionState = "error";
    console.error("WhatsApp connection error:", error.message);
  });
};
