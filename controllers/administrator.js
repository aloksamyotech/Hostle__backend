import User from "../model/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import messages from "../constants/message.js";

import dotenv from "dotenv";
import SuperAdmin from "../model/SuperAdmin.js";
import Hostel from "../model/Hostel.js";
dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY;

const add = async (req, res) => {
  try {
    const {
      hostelId,
      firstName,
      lastName,
      email,
      password,
      dateOfBirth,
      gender,
      phoneNumber,
      aadharCard,
      state,
      city,
      address,
    } = req.body;

    const fileName = req.file ? req.file.filename : null;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(401).json({ message: messages.EMAIL_ALREADY_EXISTS });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await Hostel.findOne({ uniqueCode: hostelId });

    const newUser = new User({
      hostelId,
      hostelname: data.hostelName,
      firstname: firstName,
      lastname: lastName,
      email,
      password: hashedPassword,
      dateOfBirth,
      gender,
      phonenumber: phoneNumber,
      aadharcardId: aadharCard,
      state,
      city,
      address,
      photo: fileName,
      role: "SubAdmin",
    });

    await newUser.save();

    await Hostel.updateOne({ uniqueCode: hostelId }, { isAdmin: true });

    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error Found =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const index = async (req, res) => {
  try {
    let result = await User.find({ deleted: false, role: "SubAdmin" });

    let total_recodes = await User.countDocuments({
      deleted: false,
      role: "SubAdmin",
    });

    res.status(200).send({
      result,
      totalRecodes: total_recodes,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const view = async (req, res) => {
  try {
    let user = await User.findById({ _id: req.params.id });

    if (!user) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND });
    }
    res.status(200).json({ user, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const edit = async (req, res) => {
  try {
    let result = await User.updateOne(
      { _id: req.params.id },
      {
        $set: {
          // hostelId : req.body.hostelId,
          firstname: req.body.firstName,
          lastname: req.body.lastName,
          // email: req.body.email,
          // password: req.body.password,
          dateOfBirth: req.body.dateOfBirth,
          gender: req.body.gender,
          phonenumber: req.body.phoneNumber,
          aadharcardId: req.body.aadharCard,
          state: req.body.state,
          city: req.body.city,
          address: req.body.address,
          photo: req.file.filename,
        },
      }
    );

    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    console.log("Found Error While Update User", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  try {
    const user = await User.findById({ _id: req.params.id });
    if (!user) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      if (user.role !== "SubAdmin") {
        await User.findByIdAndUpdate({ _id: req.params.id }, { deleted: true });
        res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
      } else {
        res.json({ message: "Admin can not delete!!" });
      }
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Hostel.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: `User not found with email ${email}` });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "1d" });

    res.setHeader("Authorization", `Bearer ${token}`);
    res.status(200).json({ token, user, message: "Login successful!" });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "An error occurred while logging in" });
  }
};

export default { add, index, view, edit, deleteData, login };
