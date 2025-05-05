import express from "express";
import cors from "cors";
import serverRoutes from "./routes/serverRoutes.js";
import connect from "./db/connectiondb.js";
import dotenv from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
dotenv.config();
connect();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", serverRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/images", express.static("uploads/images"));

const port = process.env.PORT || "4000";
app.listen(port, () => {
  console.log(`Server listining at http://localhost:${port}`);
});
