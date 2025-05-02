import StudentComplaint from "../model/StudentComplaint.js";
import StudentReservation from "../model/StudentReservation.js";
import messages from "../constants/message.js";
import mongoose from "mongoose";

const add = async (req, res) => {
  console.log("In Student Complaint Controller");
  console.log("Req Id=>", req.params.id);
  console.log("Req Data=>", req.body);

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

    console.log("Data Store =>", newComplaint);
    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error Found While add rooms", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
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

const view = async (req, res) => {
  console.log("In View");
  console.log("id =>", req.params.id);

  let result = await StudentComplaint.findOne({ studentHosId: req.params.id });
  if (!result) {
    return res.status(404).json({ message: "No Details is Found.." });
  }
  console.log("result=>", result);
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
    console.log("edit complaint : ", result);

    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    console.log("Found Error While Update", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  console.log(" deleteData  Id:", req.params.id);
  try {
    const result = await StudentComplaint.findOne({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await StudentComplaint.findOneAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );
      console.log("Student Complain Details deleted successfully !!");
      res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

const allComplaints = async (req, res) => {
  try {
    console.log("in allComplaints... Id", req.params.id);

    // Fetch all expenditures created by the specified user
    const adminData = await StudentComplaint.find({ createdBy: req.params.id });
    console.log("adminData =>", adminData);

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
