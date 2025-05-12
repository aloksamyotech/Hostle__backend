import mongoose from "mongoose";
import SuperAdmin from "../model/SuperAdmin.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import Hostel from "../model/Hostel.js";

dotenv.config();

const url = process.env.DB_URL;

const connect = async () => {
  try {
    await mongoose.connect(url);
    console.log("Database Connected Successfully!!");

    // const existingAdmin = await SuperAdmin.findOne({
    //   email: process.env.ADMIN_EMAIL,
    // });

    // if (!existingAdmin) {
    //   const name = process.env.ADMIN_NAME;
    //   const email = process.env.ADMIN_EMAIL;
    //   const password = process.env.ADMIN_PASSWORD;
    //   const role = process.env.ROLE;

    //   const hashedPassword = await bcrypt.hash(password, 10);

    //   const newSuperAdmin = new SuperAdmin({
    //     name,
    //     email,
    //     password: hashedPassword,
    //     role,
    //   });
    //   await newSuperAdmin.save();
    //   console.log("Super Admin created successfully!");
    // } else {
    //   console.log("Super Admin Already Exist!!");
    // }

   //------- hostel--------//
    const existingHostel = await Hostel.findOne({
      email: process.env.HOSTEL_EMAIL,
    });

    if (!existingHostel) {
      const hashedPassword = await bcrypt.hash(process.env.HOSTEL_PASSWORD, 10);

      const hostel = new Hostel({
        hostelName: process.env.HOSTEL_NAME,
        email: process.env.HOSTEL_EMAIL,
        password: hashedPassword,
        role: process.env.ROLE,
      });

      await hostel.save();
      console.log("Dummy Hostel entry inserted!");
    } else {
      console.log("Hostel entry already exists!");
    }
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err.message);
  }
};

export default connect;
