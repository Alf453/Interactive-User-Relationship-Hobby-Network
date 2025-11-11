"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({
    path: path_1.default.resolve(__dirname, "../.env"),
});
console.log("DB_URL loaded from .env:", process.env.DB_URL);
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const db_1 = require("./config/db");
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const DB_URL = process.env.DB_URL;
async function main() {
    await (0, db_1.connectDB)(DB_URL);
    app_1.default.listen(PORT, () => console.log(`API http://localhost:${PORT}`));
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
