import dotenv from "dotenv";
import { connectDB } from "./config/db";
import app from "./app";

dotenv.config();

const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_URI || "";

if (!MONGODB_URI) {
  console.error("MONGO_URI is not defined in env");
  process.exit(1);
}

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Express Server running!`));
  })
  .catch((error) => {
    console.error("Failed establish connection to MongoDB: ", error);
    process.exit(1);
  });
