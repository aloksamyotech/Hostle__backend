import messages from "../constants/message.js";
import Room from "../model/Room.js";
import User from "../model/User.js";
import Hostel from "../model/Hostel.js";
import RoomType from "../model/RoomType.js";
import mongoose from "mongoose";

const add = async (req, res) => {
  try {
    const createdBy = req.params.id;
    const { roomTypeId, roomType, roomNumber, noOfBeds, roomPrice } = req.body;

    const existingRoom = await Room.findOne({
      roomNumber: roomNumber,
      createdBy: createdBy,
    });
    if (existingRoom) {
      return res.status(400).json({
        message: "Room number already exists for this user!",
      });
    }

    const roomCategoryData = await RoomType.findById(roomTypeId);

    let roomPhoto = [];
    if (req.files && req.files.roomPhotos) {
      roomPhoto = req.files.roomPhotos.map(
        (file) => `/images/${file.filename}`
      );
    }

    const generateBeds = (noOfBeds) => {
      const beds = [];
      for (let i = 1; i <= noOfBeds; i++) {
        beds.push({
          bedNumber: i,
          studentId: null,
          status: "available",
        });
      }
      return beds;
    };

    const newRoom = new Room({
      roomTypeId,
      roomCategory: roomCategoryData.roomCategory,
      roomType,
      roomNumber,
      noOfBeds,
      roomPrice,
      availableBeds: noOfBeds,
      occupiedBeds: 0,
      roomphoto: roomPhoto,
      createdBy,
      beds: generateBeds(noOfBeds),
    });

    const savedRoom = await newRoom.save();

    res.status(201).json({
      message: "Room added successfully!",
      savedRoom,
    });
  } catch (error) {
    console.error("Error adding room:", error);
    res.status(500).json({
      message: "Failed to add room.",
      error: error.message,
    });
  }
};

const index = async (req, res) => {
  try {
    let result = await Room.find({ deleted: false, createdBy: req.params.id });
    console.log("result===>", result);

    let total_recodes = await Room.countDocuments({
      deleted: false,
      createdBy: req.params.id,
    });
    console.log("total_recodes==>", total_recodes);

    const totalAvailableBeds = result.reduce(
      (sum, room) => sum + room.availableBeds,
      0
    );
    console.log("Total Available Beds =====>", totalAvailableBeds);

    let availableRoomCount = await Room.countDocuments({
      deleted: false,
      createdBy: req.params.id,
      availableBeds: { $ne: 0 },
    });
    console.log("availableRoomCount ======>", availableRoomCount);

    res.status(200).send({
      result,
      totalRecodes: total_recodes,
      availableRoomCount,
      totalAvailableBeds,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const view = async (req, res) => {
  console.log("In room controller..");
  console.log("Id :", req.params.id);

  try {
    const result = await Room.findById({ _id: req.params.id });
    console.log("result", result);
    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND });
    }
    res.status(200).json({ result, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const edit = async (req, res) => {
  try {
    const roomId = req.params.id;

    const { roomTypeId, roomType, roomNumber, noOfBeds, roomPrice } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found!" });
    }

    const existingRoom = await Room.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(roomId) },
      roomNumber,
      createdBy: room.createdBy,
    });

    if (existingRoom) {
      return res.status(400).json({
        message: "Room number already exists for this user!",
      });
    }

    let roomphoto = room.roomphoto;
    if (req.files && req.files.roomPhotos) {
      roomphoto = req.files.roomPhotos.map(
        (file) => `/images/${file.filename}`
      );
    }

    const generateBeds = (noOfBeds) => {
      const beds = [];
      for (let i = 1; i <= noOfBeds; i++) {
        beds.push({
          bedNumber: i,
          studentId: null,
          status: "available",
        });
      }
      return beds;
    };

    // if (roomTypeId) room.roomTypeId = roomTypeId;

    if (roomTypeId && roomTypeId !== room.roomTypeId) {
      const roomCategoryData = await RoomType.findById(roomTypeId);
      room.roomCategory = roomCategoryData.roomCategory;
    }

    if (roomTypeId) room.roomTypeId = roomTypeId;
    
    if (roomType) room.roomType = roomType;
    if (roomNumber) room.roomNumber = roomNumber;
    if (roomPrice) room.roomPrice = roomPrice;
    if (roomphoto) room.roomphoto = roomphoto;

    if (noOfBeds && Number(noOfBeds) !== room.noOfBeds) {
      room.noOfBeds = Number(noOfBeds);
      room.availableBeds = Number(noOfBeds);
      room.beds = generateBeds(Number(noOfBeds));
    }

    const updatedRoom = await room.save();

    res.status(200).json({
      message: "Room updated successfully!",
      updatedRoom,
    });
  } catch (error) {
    console.error("Error updating room:", error);
    res.status(500).json({
      message: "Failed to update room.",
      error: error.message,
    });
  }
};

const deleteData = async (req, res) => {
  console.log("In room controller deleteData ..");
  console.log("Id:", req.params.id);
  try {
    const result = await Room.findById({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await Room.findByIdAndUpdate({ _id: req.params.id }, { deleted: true });
      console.log("Room Details deleted successfully !!");
      res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

const countRooms = async (req, res) => {
  try {
    const roomRecords = await Room.countDocuments({ deleted: false });
    console.log("roomRecords==>", roomRecords);
    res.status(200).json({ roomRecords, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.log("Error =>", error);
    res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
  }
};

const calculateBeds = async (req, res) => {
  try {
    console.log("In calculateBeds...");

    // Fetch all hostels
    const hostels = await Hostel.find({});
    console.log("hostels =>", hostels);

    // Store hostel unique codes (IDs) in an array
    let hostelIds = hostels.map((hostel) => hostel.uniqueCode);
    console.log("hostelIds =>", hostelIds);

    let hostelNames = hostels.map((hostel) => hostel.hostelName);
    console.log("hostelNames =>", hostelNames);

    // Initialize an array to store data for each hostel
    let hostelsData = [];

    // Iterate through each hostel ID
    for (let hostelId of hostelIds) {
      // Fetch rooms for the current hostel using the uniqueCode (hostelId) that are not deleted
      const rooms = await Room.find({ hostelId: hostelId, deleted: false });
      console.log(`Rooms for Hostel ID ${hostelId} =>`, rooms);

      // Initialize counts for the current hostel
      let totalBeds = 0;
      let totalOccupiedBeds = 0;

      // Calculate totals for the current hostel
      for (let room of rooms) {
        totalBeds += room.numOfBeds;
        totalOccupiedBeds += room.occupiedBeds;
      }

      // Calculate available beds for the current hostel
      const totalAvailableBeds = totalBeds - totalOccupiedBeds;

      // Prepare data for the current hostel
      const hostelData = {
        TotalBeds: totalBeds,
        TotalOccupiedBeds: totalOccupiedBeds,
        TotalAvailableBeds: totalAvailableBeds,
      };

      // Push current hostel data to the array
      hostelsData.push(hostelData);
    }

    console.log("hostelsData ====>", hostelsData);

    // Respond with the array of hostel data and hostel IDs
    res
      .status(200)
      .json({ hostelsData, hostelNames, message: "Data found successfully." });
  } catch (error) {
    console.error("Error calculating beds:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const roomData = async (req, res) => {
  console.log("req.params :", req.params);
  const { hostelId, roomId } = req.params;

  console.log("Hostel ID =>", hostelId);
  console.log("Room ID =>", roomId);

  try {
    const room = await Room.findOne({
      _id: roomId,
      createdBy: hostelId,
      deleted: false,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    console.log("Room Data =>", room);

    res.status(200).json({
      room,
      message: "Room data fetched successfully.",
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

export default {
  add,
  index,
  view,
  edit,
  deleteData,
  countRooms,
  calculateBeds,
  roomData,
};
