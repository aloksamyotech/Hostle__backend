import StudentReservation from "../model/StudentReservation.js";
import Visitor from "../model/Visitor.js";
import messages from "../constants/message.js";
import mongoose from "mongoose";
import { statusCodes } from "../core/constant.js";
import { commonMessage, visitorMessages } from "../core/messages.js";
import { createResponse, sendResponse } from "../helper/ResponseHelper.js";

const add = async (req, res) => {
  try {
    const { studentId, visitorName, phoneNumber, dateTime, visitorduration } =
      req.body;

    const newVisitor = new Visitor({
      studentId,
      visitorName,
      phoneNumber,
      dateTime,
      visitorduration,
      createdBy: req.params.id,
    });
    await newVisitor.save();

    return sendResponse(
      res,
      createResponse(statusCodes.CREATED, visitorMessages.ADD)
    );
  } catch (error) {
    console.log("Error Found While add Data", error);
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
    const result = await Visitor.aggregate([
      {
        $match: {
          createdBy: new mongoose.Types.ObjectId(req.params.id),
          deleted: false,
        },
      },
      {
        $lookup: {
          from: "assignbeds",
          localField: "studentId",
          foreignField: "studentId",
          as: "roomData",
        },
      },
      {
        $unwind: {
          path: "$roomData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentInfo",
        },
      },
      {
        $unwind: {
          path: "$studentInfo",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          visitorName: 1,
          phoneNumber: 1,
          dateTime: 1,
          visitorduration: 1,
          "roomData.roomNumber": 1,
          "studentInfo.studentName": 1,
          "studentInfo.studentContact": 1,
        },
      },
    ]);

    // res.status(200).send({
    //   result,
    //   message: messages.DATA_FOUND_SUCCESS,
    // });

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

const list = async (req, res) => {
  const studentId = req.params.id;
  try {
    const result = await Visitor.find({ studentId, deleted: false }).populate(
      "studentId"
    );

    // res.status(200).json({
    //   result,
    //   message: messages.DATA_FOUND_SUCCESS,
    // });

    return sendResponse(
      res,
      createResponse(statusCodes.OK, commonMessage.SUCCESS, result)
    );
  } catch (error) {
    console.error("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export default { add, index, list };
