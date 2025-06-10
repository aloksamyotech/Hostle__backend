import messages from "../constants/message.js";
import Room from "../model/Room.js";
import User from "../model/User.js";
import Hostel from "../model/Hostel.js";
import RoomType from "../model/RoomType.js";
import mongoose from "mongoose";
import { statusCodes } from "../core/constant.js";
import { commonMessage, RoomDataMessages } from "../core/messages.js";
import { createResponse, sendResponse } from "../helper/ResponseHelper.js";

const add = async (req, res) => {
  try {
    const createdBy = req.params.id;
    const { roomTypeId, roomType, roomNumber, noOfBeds, roomPrice } = req.body;

    const existingRoom = await Room.findOne({
      roomNumber: roomNumber,
      createdBy: createdBy,
      deleted: false,
    });
    if (existingRoom) {
      return sendResponse(
        res,
        createResponse(statusCodes.CONFLICT, RoomDataMessages.EXIST)
      );
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

    return sendResponse(
      res,
      createResponse(statusCodes.CREATED, RoomDataMessages.CREATED, savedRoom)
    );
  } catch (error) {
    console.error("Error:", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const index = async (req, res) => {
  try {
    let result = await Room.find({ deleted: false, createdBy: req.params.id });

    let total_recodes = await Room.countDocuments({
      deleted: false,
      createdBy: req.params.id,
    });

    const totalAvailableBeds = result.reduce(
      (sum, room) => sum + room.availableBeds,
      0
    );

    let availableRoomCount = await Room.countDocuments({
      deleted: false,
      createdBy: req.params.id,
      availableBeds: { $ne: 0 },
    });

    return sendResponse(
      res,
      createResponse(statusCodes.OK, commonMessage.SUCCESS, result)
    );
  } catch (error) {
    console.log("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const view = async (req, res) => {
  try {
    const result = await Room.findById({ _id: req.params.id });
    if (!result) {
      return sendResponse(
        res,
        createResponse(statusCodes.NOT_FOUND, RoomDataMessages.NOT_FOUND)
      );
    }
    return sendResponse(
      res,
      createResponse(statusCodes.OK, commonMessage.SUCCESS)
    );
  } catch (error) {
    console.error("Error:", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const edit = async (req, res) => {
  try {
    const roomId = req.params.id;
    const { roomTypeId, roomType, roomNumber, noOfBeds, roomPrice } = req.body;

    const room = await Room.findById(roomId);
    if (!room) {
      return sendResponse(
        res,
        createResponse(statusCodes.NOT_FOUND, RoomDataMessages.NOT_FOUND)
      );
    }

    const existingRoom = await Room.findOne({
      _id: { $ne: new mongoose.Types.ObjectId(roomId) },
      roomNumber,
      createdBy: room.createdBy,
      deleted: false,
    });

    if (existingRoom) {
      return sendResponse(
        res,
        createResponse(statusCodes.CONFLICT, RoomDataMessages.EXIST)
      );
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
      const updatedNoOfBeds = Number(noOfBeds);
      room.noOfBeds = updatedNoOfBeds;

      const currentBeds = room.beds || [];

      if (updatedNoOfBeds > currentBeds.length) {
        // Add new beds
        for (let i = currentBeds.length + 1; i <= updatedNoOfBeds; i++) {
          currentBeds.push({
            bedNumber: i,
            studentId: null,
            status: "available",
          });
        }
      } else if (updatedNoOfBeds < currentBeds.length) {
        currentBeds.splice(updatedNoOfBeds);
      }

      room.beds = currentBeds;
      room.availableBeds = updatedNoOfBeds - room.occupiedBeds;
    }

    const updatedRoom = await room.save();
    return sendResponse(
      res,
      createResponse(statusCodes.OK, RoomDataMessages.UPDATE, updatedRoom)
    );
  } catch (error) {
    console.error("Error updating room:", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await Room.findById({ _id: req.params.id });
    if (!result) {
      return sendResponse(
        res,
        createResponse(statusCodes.NOT_FOUND, RoomDataMessages.NOT_FOUND)
      );
    } else {
      await Room.findByIdAndUpdate({ _id: req.params.id }, { deleted: true });
      return sendResponse(
        res,
        createResponse(statusCodes.OK, RoomDataMessages.DELETE)
      );
    }
  } catch (error) {
    console.log("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const countRooms = async (req, res) => {
  try {
    const roomRecords = await Room.countDocuments({ deleted: false });

    res.status(200).json({ roomRecords, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.log("Error =>", error);
    res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
  }
};

const calculateBeds = async (req, res) => {
  try {
    const hostels = await Hostel.find({});

    let hostelIds = hostels.map((hostel) => hostel.uniqueCode);

    let hostelNames = hostels.map((hostel) => hostel.hostelName);

    let hostelsData = [];

    for (let hostelId of hostelIds) {
      const rooms = await Room.find({ hostelId: hostelId, deleted: false });

      let totalBeds = 0;
      let totalOccupiedBeds = 0;

      for (let room of rooms) {
        totalBeds += room.numOfBeds;
        totalOccupiedBeds += room.occupiedBeds;
      }

      const totalAvailableBeds = totalBeds - totalOccupiedBeds;

      const hostelData = {
        TotalBeds: totalBeds,
        TotalOccupiedBeds: totalOccupiedBeds,
        TotalAvailableBeds: totalAvailableBeds,
      };

      hostelsData.push(hostelData);
    }

   

    res
      .status(200)
      .json({ hostelsData, hostelNames, message: "Data found successfully." });
  } catch (error) {
    console.error("Error calculating beds:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const roomData = async (req, res) => {

  const { hostelId, roomId } = req.params;

 

  try {
    const room = await Room.findOne({
      _id: roomId,
      createdBy: hostelId,
      deleted: false,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }


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
