const functions = require("firebase-functions");

let app;

const getApp = async () => {
  if (!app) {
    const mod = await import("../src/app.js");
    app = mod.default;
  }
  return app;
};

exports.api = functions.https.onRequest(async (req, res) => {
  const expressApp = await getApp();
  return expressApp(req, res);
});
