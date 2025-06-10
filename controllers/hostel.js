import Hostel from "../model/Hostel.js";
import messages from "../constants/message.js";
import User from "../model/User.js";
import bcrypt from "bcrypt";

const add = async (req, res) => {
  try {
    const {
      hostelName,
      phoneNumber,
      email,
      noOfRoom,
      uniqueCode,
      state,
      city,
      address,
    } = req.body;

    const existingEmail = await Hostel.findOne({ email });

    if (existingEmail) {
      res.status(401).json({ message: messages.EMAIL_ALREADY_EXISTS });
      return;
    }

    const fileNames = req.files.map((file) => file.filename);

    const newHostel = new Hostel({
      hostelName,
      phoneNumber,
      email,
      noOfRoom,
      uniqueCode,
      state,
      city,
      address,
      photo: fileNames,
    });
    await newHostel.save();
    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const index = async (req, res) => {
  try {
    let result = await Hostel.find({ deleted: false });

    let total_recodes = await Hostel.countDocuments({ deleted: false });

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
    const result = await Hostel.findById({ _id: req.params.id });

    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    }
    res.status(200).json({ result, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const edit = async (req, res) => {
  try {
    const hostel = await Hostel.findById({ _id: req.params.id });
    if (!hostel) {
      return res.status(404).json({
        message: "Hostel not found!",
      });
    }

    let hostelphoto = hostel.hostelphoto;
    let aadharphoto = hostel.aadharphoto;

    if (req.files && req.files.hostelphoto) {
      hostelphoto = `/images/${req.files.hostelphoto[0].filename}`;
    }

    if (req.files && req.files.aadharphoto) {
      aadharphoto = `/images/${req.files.aadharphoto[0].filename}`;
    }

    const result = await Hostel.updateOne(
      { _id: req.params.id },
      {
        $set: {
          hostelName: req.body.hostelName,
          hostelPhoneNumber: req.body.hostelPhoneNumber,
          ownerName: req.body.ownerName,
          ownerPhoneNumber: req.body.ownerPhoneNumber,
          address: req.body.address,
          hostelphoto,
          aadharphoto,
        },
      }
    );
    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    console.log("Found Error While Update", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  try {
    const hostel = await Hostel.findById({ _id: req.params.id });
    if (!hostel) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await Hostel.findOneAndUpdate({ _id: req.params.id }, { deleted: true });

      res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

const roomsCount = async (req, res) => {
  try {
    let data = await User.findByIdAndUpdate({ _id: req.params.id });

    let hostel = data.hostelId;

    let hostelData = await Hostel.findOne({ uniqueCode: hostel });

    let noOfRooms = hostelData.noOfRoom;

    res.status(200).send({ noOfRooms, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const bedsCount = async (req, res) => {
  try {
    let data = await User.findById({ _id: req.params.id });

    let hostelId = data.hostelId;

    let hostelData = await Hostel.findOne({ uniqueCode: hostelId });

    let avabeds = hostelData.availableBeds;

    res.status(200).send({ avabeds, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const addNew = async (req, res) => {
  try {
    const {
      hostelName,
      hostelPhoneNumber,
      ownerName,
      ownerPhoneNumber,
      email,
      password,
      address,
    } = req.body;

    const existingEmail = await Hostel.findOne({ email });

    if (existingEmail) {
      res.status(401).json({ message: messages.EMAIL_ALREADY_EXISTS });
      return;
    }

    const existingHostel = await Hostel.findOne({ hostelPhoneNumber });

    if (existingHostel) {
      res.status(401).json({ message: "Hostel ContactNo is Already Exist!!" });
      return;
    }

    const existingOwner = await Hostel.findOne({ ownerPhoneNumber });
    if (existingOwner) {
      return res.status(401).json({
        status: 401,
        message: "Owner ContactNo is Already Exist!!",
      });
    }

    let hostelphoto = null;
    let aadharphoto = null;
    if (req.files && req.files.hostelphoto) {
      hostelphoto = `/images/${req.files.hostelphoto[0].filename}`;
    }
    if (req.files && req.files.aadharphoto) {
      aadharphoto = `/images/${req.files.aadharphoto[0].filename}`;
    }

    const newHostel = new Hostel({
      hostelName,
      hostelPhoneNumber,
      ownerName,
      ownerPhoneNumber,
      email,
      password,
      address,
      hostelphoto,
      aadharphoto,
      role: "Customer",
    });
    await newHostel.save();

    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, currentPassword, newPassword, confirmPassword } = req.body;

    if (email === "sunrisehostel@gmail.com") {
      return res.status(403).json({
        message: "You are not allowed to change the password for this account.",
      });
    }

    const userExists = await Hostel.findOne({ email: email });

    if (!userExists) {
      return res.status(404).json({
        message: "Hostel not found!",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      userExists.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Your Current Password is Incorrect",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(401).json({
        message: "Password do not match. please verify both fields",
      });
    }

    const hashPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await Hostel.findOneAndUpdate(
      { email },
      { $set: { password: hashPassword } },
      { new: true }
    );

    return res.status(200).json({
      message: "Password Change Successfully",
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

export default {
  add,
  index,
  view,
  edit,
  deleteData,
  roomsCount,
  bedsCount,
  addNew,
  changePassword,
};
