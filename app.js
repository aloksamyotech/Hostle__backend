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

// app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(
  "/uploads/hostels",
  express.static(path.join(__dirname, "uploads/hostels"))
);
app.use(
  "/uploads/customers",
  express.static(path.join(__dirname, "uploads/customers"))
);
app.use(
  "/uploads/students",
  express.static(path.join(__dirname, "uploads/students"))
);
app.use(
  "/uploads/bills",
  express.static(path.join(__dirname, "uploads/bills"))
);
app.use(
  "/uploads/payment",
  express.static(path.join(__dirname, "uploads/payment"))
);

app.use(
  "/uploads/RoomImages",
  express.static(path.join(__dirname, "uploads/RoomImages"))
);

const port = process.env.PORT || "4000";
app.listen(port, () => {
  console.log(`Server listining at http://localhost:${port}`);
});
