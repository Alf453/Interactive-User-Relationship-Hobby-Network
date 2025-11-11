import path from "path";
import dotenv from "dotenv";

dotenv.config({
  path: path.resolve(__dirname, "../.env"),
});

console.log("DB_URL loaded from .env:", process.env.DB_URL);

import "dotenv/config";
import app from "./app";
import { connectDB } from "./config/db";
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const DB_URL = process.env.DB_URL as string;

async function main() {
  await connectDB(DB_URL);
  app.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
}
main().catch((e) => {
  console.error(e);
  process.exit(1);
});
