import Payment from "../model/Payment.js";
import messages from "../constants/message.js";
import mongoose from "mongoose";
import Students from "../model/Students.js";
import AssignBeds from "../model/AssignBeds.js";
import Hostel from "../model/Hostel.js";
import Room from "../model/Room.js";

const add = async (req, res) => {
  const createdBy = req.params.id;

  try {
    const {
      studentId,
      reservationId,
      totalRent,
      finalTotalRent,
      advanceAmount,
      discount,
      remainingAmount,
      paymentMethod,
      date,
      paymentAmount,
    } = req.body;

    const paymentStatus = remainingAmount === 0 ? "paid" : "pending";

    const newPayment = new Payment({
      studentId,
      reservationId,
      totalRent,
      finalTotalRent,
      advanceAmount,
      discount,
      remainingAmount,
      paymentMethod,
      date,
      paymentAmount,
      paymentStatus,
      createdBy,
    });

    const savedPayment = await newPayment.save();

    // if (paymentStatus === "paid") {
    //   await AssignBeds.findByIdAndUpdate(
    //     reservationId,
    //     { paymentStatus: "paid" },
    //     { new: true }
    //   );
    // }

    if (paymentStatus === "paid") {
      const updatedReservation = await AssignBeds.findByIdAndUpdate(
        reservationId,
        { paymentStatus: "paid" },
        { new: true }
      );

      if (updatedReservation) {
        const room = await Room.findById(updatedReservation.roomId);

        if (room) {
          const bedIndex = room.beds.findIndex(
            (bed) => bed.bedNumber === Number(updatedReservation.bedNumber)
          );

          if (bedIndex !== -1) {
            // Update specific bed fields
            room.beds[bedIndex].status = "available";
            room.beds[bedIndex].studentId = null;
            room.beds[bedIndex].reservationId = null;

            // Update bed counters
            room.availableBeds += 1;
            room.occupiedBeds = room.noOfBeds - room.availableBeds;

            await room.save();
          }
        }
      }
    }

    res.status(201).json({
      message: "Payment added successfully",
      data: savedPayment,
    });
  } catch (error) {
    console.log("Error Found While adding Data", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const index = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Payment.aggregate([
      { $match: { createdBy: new mongoose.Types.ObjectId(id) } },
      {
        $lookup: {
          from: "students",
          localField: "studentId",
          foreignField: "_id",
          as: "studentData",
        },
      },
      {
        $lookup: {
          from: "assignbeds",
          localField: "reservationId",
          foreignField: "_id",
          as: "bedData",
        },
      },
      {
        $unwind: "$studentData",
      },
      {
        $unwind: {
          path: "$bedData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          paymentAmount: 1,
          remainingAmount: 1,
          paymentStatus: 1,
          date: 1,
          totalRent: 1,
          finalTotalRent: 1,
          advanceAmount: 1,
          paymentMethod: 1,
          createdAt: 1,
          studentData: {
            studentName: 1,
            studentContact: 1,
            status: 1,
          },
          bedData: {
            roomType: 1,
            roomNumber: 1,
            bedNumber: 1,
            foodFee: 1,
            libraryFee: 1,
          },
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

const getStudentData = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Payment.findOne({ studentId: id }).sort({
      createdAt: -1,
    });

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
  try {
    const reservationId = req.params.id;

    const result = await Payment.find({ reservationId }).populate("studentId");

    res.status(200).json({
      result,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.error("Error =>", error);
    res.status(400).json({ message: messages.DATA_NOT_FOUND_ERROR });
  }
};

const paymentDataById = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await Payment.findById(id).populate("studentId");

    if (!result) {
      return res.status(404).json({ message: "Payment not found" });
    }

    const assignBedData = await AssignBeds.findOne({
      studentId: result.studentId._id,
    });

    const hostelData = await Hostel.findById(result.createdBy);

    res.status(200).send({
      payment: result,
      assignBed: assignBedData,
      hostelData: hostelData,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.error("Error =>", error);
    res.status(400).json({ message: messages.DATA_NOT_FOUND_ERROR });
  }
};

const getLatestPaymentByReservationId = async (req, res) => {
  try {
    const reservationId = req.params.id;

    const latestPayment = await Payment.findOne({ reservationId }).sort({
      createdAt: -1,
    });

    if (!latestPayment) {
      return res
        .status(404)
        .json({ message: "No payment found for this reservation." });
    }

    res.status(200).json(latestPayment);
  } catch (error) {
    console.error("Error fetching latest payment:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export default {
  add,
  index,
  view,
  getStudentData,
  paymentDataById,
  getLatestPaymentByReservationId,
};
