import mongoose from "mongoose";
import SuperAdmin from "../model/SuperAdmin.js";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

const url = process.env.DB_URL;

// const connect = mongoose
//   .connect(url)
//   .then(() => {
//     console.log("Database Connected Successfully!!");
//   })
//   .catch((err) => {
//     console.log("error while connection", err);
//   });

const connect = async () => {
  try {
    await mongoose.connect(url);
    console.log("Database Connected Successfully!!");

    const existingAdmin = await SuperAdmin.findOne({
      email: process.env.ADMIN_EMAIL,
    });

    if (!existingAdmin) {
      const name = process.env.ADMIN_NAME;
      const email = process.env.ADMIN_EMAIL;
      const password = process.env.ADMIN_PASSWORD;
      const role = process.env.ROLE;

      const hashedPassword = await bcrypt.hash(password, 10);

      const newSuperAdmin = new SuperAdmin({
        name,
        email,
        password: hashedPassword,
        role,
      });
      await newSuperAdmin.save();
      console.log("Super Admin created successfully!");
    } else {
      console.log("Super Admin Already Exist!!");
    }
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

export default connect;
