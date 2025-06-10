import RoomType from "../model/RoomType.js";
import messages from "../constants/message.js";
import { statusCodes } from "../core/constant.js";
import { commonMessage, RoomTypeMessages } from "../core/messages.js";
import { createResponse, sendResponse } from "../helper/ResponseHelper.js";

const add = async (req, res) => {
  const id = req.params.id;

  const roomType = req.body.roomType.toLowerCase();
  const roomCategory = req.body.roomCategory;

  try {
    const existingRoom = await RoomType.findOne({
      roomType,
      roomCategory,
      createdBy: id,
      deleted: false,
    });

    if (existingRoom) {
      return sendResponse(
        res,
        createResponse(statusCodes.CONFLICT, RoomTypeMessages.EXIST)
      );
    }

    const newRoomType = new RoomType({
      roomType,
      roomCategory,
      createdBy: id,
    });
    await newRoomType.save();

    return sendResponse(
      res,
      createResponse(statusCodes.CREATED, RoomTypeMessages.ADD, newRoomType)
    );
  } catch (error) {
    console.error("Error Found While adding room type", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const getAll = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await RoomType.find({ createdBy: id, deleted: false });
    return sendResponse(
      res,
      createResponse(statusCodes.OK, commonMessage.SUCCESS, result)
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

const update = async (req, res) => {
  const roomType = req.body.roomType.toLowerCase();
  const roomCategory = req.body.roomCategory;

  try {
    const existingRoom = await RoomType.findOne({
      roomType,
      roomCategory,
      deleted: false,
    });

    if (existingRoom) {
      return sendResponse(
        res,
        createResponse(statusCodes.CONFLICT, RoomTypeMessages.EXIST)
      );
    }

    let result = await RoomType.updateOne(
      { _id: req.params.id },
      {
        $set: {
          roomType: req.body.roomType,
          roomCategory: req.body.roomCategory,
        },
      }
    );
    return sendResponse(
      res,
      createResponse(statusCodes.OK, RoomTypeMessages.UPDATE, result)
    );
  } catch (error) {
    console.log("Found Error While Update", error);
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
    const result = await RoomType.findById({ _id: req.params.id });
    if (!result) {
      return sendResponse(
        res,
        createResponse(statusCodes.NOT_FOUND, RoomTypeMessages.NOT_FOUND)
      );
    } else {
      await RoomType.findByIdAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );
      return sendResponse(
        res,
        createResponse(statusCodes.OK, RoomTypeMessages.DELETE)
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
export default { add, getAll, update, deleteData };
