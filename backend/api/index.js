import app from "../src/app.js";
import { connectDatabase } from "../src/config/database.js";

const handler = async (req, res) => {
  await connectDatabase();
  return app(req, res);
};

export default handler;
