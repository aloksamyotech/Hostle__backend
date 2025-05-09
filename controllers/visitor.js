import StudentReservation from "../model/StudentReservation.js";
import Visitor from "../model/Visitor.js";
import messages from "../constants/message.js";
import mongoose from "mongoose";

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

    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error Found While add Data", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
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

    res.status(200).send({
      result,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const list = async (req, res) => {
  const studentId = req.params.id;
  try {
    const result = await Visitor.find({ studentId, deleted: false }).populate(
      "studentId"
    );

    res.status(200).json({
      result,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.error("Error =>", error);
    res.status(400).json({ message: messages.DATA_NOT_FOUND_ERROR });
  }
};

export default { add, index, list };
