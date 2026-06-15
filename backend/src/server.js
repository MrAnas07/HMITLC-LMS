import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "JWT_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET"
];

const missingVars = requiredEnvVars.filter((variable) => !process.env[variable]);
if (!process.env.MONGO_URI && !process.env.MONGODB_URI) {
  missingVars.push("MONGO_URI or MONGODB_URI");
}

if (missingVars.length > 0) {
  console.error("Missing required environment variables:", missingVars.join(", "));
  process.exit(1);
}

const { default: app } = await import("./app.js");
const { connectDatabase } = await import("./config/database.js");
const { startWhatsAppService } = await import("./utils/whatsappService.js");

await connectDatabase();
startWhatsAppService();

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
