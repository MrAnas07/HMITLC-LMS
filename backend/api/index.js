import app from "../src/app.js";

const handler = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "https://hmitlc-lms.vercel.app");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  return app(req, res);
};

export default handler;
