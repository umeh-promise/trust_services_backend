import dotenv from "dotenv";
import dns from "dns";
import mongoose from "mongoose";
import app from "./app";

dns.setServers(["1.1.1.1", "8.8.8.8"]);
dotenv.config();

const db = process.env.DATABASE_URL;

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(db as string, {
    autoIndex: true,
    autoCreate: true,
    sanitizeFilter: true,
  });
}

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
