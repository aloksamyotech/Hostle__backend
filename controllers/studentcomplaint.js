import StudentComplaint from "../model/StudentComplaint.js";
import StudentReservation from "../model/StudentReservation.js";
import messages from "../constants/message.js";
import mongoose from "mongoose";
import { statusCodes } from "../core/constant.js";
import { commonMessage, complaintMessages } from "../core/messages.js";
import { createResponse, sendResponse } from "../helper/ResponseHelper.js";

const add = async (req, res) => {
  try {
    const { studentId, datetime, problemDescription, status } = req.body;

    const newComplaint = new StudentComplaint({
      studentId,
      datetime,
      problemDescription,
      status,
      createdBy: req.params.id,
    });
    await newComplaint.save();

    return sendResponse(
      res,
      createResponse(statusCodes.CREATED, complaintMessages.ADD)
    );
  } catch (error) {
    console.log("Error Found While add rooms", error);
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
    const result = await StudentComplaint.aggregate([
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
          from: "students", // This should match the actual collection name
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
          datetime: 1,
          problemDescription: 1,
          status: 1,
          "roomData.roomNumber": 1,
          "studentInfo.studentName": 1,
          "studentInfo.studentContact": 1,
          "studentInfo._id": 1,
        },
      },
    ]);

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
  let result = await StudentComplaint.findOne({ studentHosId: req.params.id });
  if (!result) {
    return res.status(404).json({ message: "No Details is Found.." });
  }
  
  res.status(200).json(result);
};

const edit = async (req, res) => {
  const { studentId, datetime, problemDescription, status } = req.body;

  try {
    let result = await StudentComplaint.updateOne(
      { _id: req.params.id },
      {
        $set: {
          studentId: studentId,
          roomNumber: req.body.roomNumber,
          datetime: datetime,
          problemDescription: problemDescription,
          status: status,
        },
      }
    );
  

    
    return sendResponse(
      res,
      createResponse(statusCodes.OK, complaintMessages.UPDATE)
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
    const result = await StudentComplaint.findOne({ _id: req.params.id });
    if (!result) {
      return sendResponse(
        res,
        createResponse(statusCodes.CONFLICT, complaintMessages.EXIST)
      );
    } else {
      await StudentComplaint.findOneAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );

      return sendResponse(
        res,
        createResponse(statusCodes.OK, complaintMessages.DELETE)
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

const allComplaints = async (req, res) => {
  try {
   
    const adminData = await StudentComplaint.find({ createdBy: req.params.id });
  

    let totalComplaints = {
      complete: 0,
      register: 0,
      inprogress: 0,
    };

    for (let complaint of adminData) {
      if (complaint.status === "complete") {
        totalComplaints.complete += 1;
      } else if (complaint.status === "register") {
        totalComplaints.register += 1;
      } else if (complaint.status === "in progress") {
        totalComplaints.inprogress += 1;
      }
    }
    res
      .status(200)
      .json({ totalComplaints, message: messages.DATA_FOUND_SUCCESS });
  } catch (error) {
    console.log("Found Error While Update", error);
    res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
  }
};

export default { add, index, view, edit, deleteData, allComplaints };
