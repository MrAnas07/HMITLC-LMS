import functions from "firebase-functions";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { default: app } = await import(path.join(__dirname, "..", "src", "app.js"));

export const api = functions.https.onRequest(app);
