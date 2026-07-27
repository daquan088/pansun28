import "dotenv/config";
import express from "express";

const app = express();
const port = Number(process.env.PORT || 8787);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.listen(port, "127.0.0.1", () => {
  console.log(`Suhua API listening on http://127.0.0.1:${port}`);
});
