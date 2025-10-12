"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const dns_1 = __importDefault(require("dns"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
dns_1.default.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv_1.default.config();
const db = process.env.DATABASE_URL;
main().catch((err) => console.log(err));
async function main() {
    await mongoose_1.default.connect(db, {
        autoIndex: true,
        autoCreate: true,
        sanitizeFilter: true,
    });
}
const port = process.env.PORT;
app_1.default.listen(port, () => {
    console.log(`App running on port ${port}`);
});
