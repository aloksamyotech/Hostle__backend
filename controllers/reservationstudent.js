import StudentReservation from "../model/StudentReservation.js";
import Hostel from "../model/Hostel.js";
import User from "../model/User.js";
import studentcomplaint from "./studentcomplaint.js";
import StudentReg from "../model/StudentReg.js";
import messages from "../constants/message.js";
import Room from "../model/Room.js";
import AssignBeds from "../model/AssignBeds.js";
import Students from "../model/Students.js";
import student from "./student.js";
import roomTypes from "./roomTypes.js";
import room from "./room.js";
import Payment from "../model/Payment.js";

const add = async (req, res) => {
  try {
    const {
      studentName,
      studentPhoneNo,
      fathersName,
      fathersPhoneNo,
      dateOfBirth,
      gender,
      email,
      state,
      city,
      address,
      roomNumber,
      startDate,
      endDate,
      isLibrary,
      isFood,
      libraryAmount,
      foodAmount,
      hostelRent,
      advancePayment,
    } = req.body;

    // Extract file names
    const studentphoto = req.files.studentphoto
      ? req.files.studentphoto[0].filename
      : null;
    const aadharcardphoto = req.files.aadharcardphoto
      ? req.files.aadharcardphoto[0].filename
      : null;

    // Calculate the number of months between startDate and endDate
    const start = new Date(startDate);
    const end = new Date(endDate);

    const totalMonths =
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth()) +
      1;

    const MonthlyTotalAmmount =
      Number(libraryAmount) + Number(foodAmount) + Number(hostelRent);

    const totalAmount = MonthlyTotalAmmount * totalMonths;

    const room = await Room.findOne({
      roomNumber: roomNumber,
      createdBy: req.params.id,
    });

    if (!room) {
      return res.status(404).json({ message: "Room not found." });
    }

    if (room.availableBeds <= 0) {
      return res
        .status(400)
        .json({ message: "No available beds in this room." });
    }

    room.occupiedBeds += 1;
    room.availableBeds -= 1;

    await room.save();

    const newStudentReserve = new StudentReservation({
      studentName,
      studentPhoneNo,
      fathersName,
      fathersPhoneNo,
      dateOfBirth,
      gender,
      email,
      studentphoto,
      state,
      city,
      address,
      aadharcardphoto,
      roomNumber,
      startDate,
      endDate,
      isLibrary,
      isFood,
      libraryAmount,
      foodAmount,
      hostelRent,
      advancePayment,
      MonthlyTotalAmmount,
      totalAmount,
      createdBy: req.params.id,
    });

    await newStudentReserve.save();
    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error Found =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const index = async (req, res) => {
  try {
    let result = await Students.find({
      deleted: false,
      createdBy: req.params.id,
    });
    let total_recodes = await Students.countDocuments({
      createdBy: req.params.id,
      deleted: false,
    });

    res.status(200).send({
      result,
      total_recodes,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const view = async (req, res) => {
  try {
    const result = await AssignBeds.findOne({
      _id: req.params.id,
    }).populate("studentId");
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
    const studentId = req.params.id;
    const {
      studentName,
      studentContact,
      fatherName,
      fatherContact,
      guardianName,
      guardianContactNo,
      guardiansAddress,
      dob,
      gender,
      mailId,
      courseOccupation,
      address,
    } = req.body;

    const student = await Students.findById({ _id: req.params.id });
    if (!student) {
      return res.status(404).json({
        message: "student not found!",
      });
    }

    let studentPhoto = student.studentPhoto;
    let aadharPhoto = student.aadharPhoto;

    if (req.files && req.files.studentPhoto) {
      studentPhoto = `/images/${req.files.studentPhoto[0].filename}`;
    }

    if (req.files && req.files.aadharPhoto) {
      aadharPhoto = `/images/${req.files.aadharPhoto[0].filename}`;
    }

    const updatedStudent = await Students.updateOne(
      { _id: req.params.id },
      {
        $set: {
          studentName: req.body.studentName,
          studentContact: req.body.studentContact,
          fatherName: req.body.fatherName,
          fatherContact: req.body.fatherContact,
          guardianName: req.body.guardianName,
          guardianContactNo: req.body.guardianContactNo,
          guardiansAddress: req.body.guardiansAddress,
          dob: req.body.dob,
          gender: req.body.gender,
          mailId: req.body.mailId,
          courseOccupation: req.body.courseOccupation,
          address: req.body.address,
          studentPhoto,
          aadharPhoto,
        },
      }
    );

    res.status(200).json({
      message: "Student data updated successfully.",
      student: updatedStudent,
    });
  } catch (error) {
    console.log("Found Error While Updating Student", error);
    res
      .status(400)
      .json({ message: "Failed to update data.", error: error.message });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await StudentReservation.findById({ _id: req.params.id });

    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await StudentReservation.findOneAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );

      const currentRoom = await Room.findOne({ roomNumber: result.roomNumber });

      if (currentRoom) {
        currentRoom.occupiedBeds -= 1;
        currentRoom.availableBeds += 1;
        await currentRoom.save();
      }

      res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

const updateStatus = async (req, res) => {
  const id = req.params.id;
  const status = req.body.status;

  try {
    let result = await StudentReservation.updateOne(
      { _id: id },
      {
        $set: {
          status: status,
        },
      }
    );

    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error });
  }
};

const assignBed = async (req, res) => {
  try {
    const createdBy = req.params.id;

    const {
      roomType,
      roomNumber,
      bedNumber,
      roomRent,
      startDate,
      endDate,
      stayMonths,
      totalRent,
      finalTotalRent,
      advanceAmount,
      discount,

      foodFee,
      libraryFee,
      studentName,
      studentContact,
      fatherName,
      fatherContact,
      guardianName,
      guardianContactNo,
      guardiansAddress,
      dob,
      gender,
      mailId,
      courseOccupation,
      address,
      studentId,
    } = req.body;

    let studentPhoto = null;
    let aadharPhoto = null;

    if (req.files && req.files.studentPhoto) {
      studentPhoto = `/images/${req.files.studentPhoto[0].filename}`;
    }

    if (req.files && req.files.aadharPhoto) {
      aadharPhoto = `/images/${req.files.aadharPhoto[0].filename}`;
    }

    let studentIdFromDB = studentId;

    if (!studentIdFromDB) {
      const existingStudent = await Students.findOne({ studentContact });

      if (existingStudent) {
        studentIdFromDB = existingStudent._id;
      } else {
        const newStudent = new Students({
          studentName,
          studentContact,
          fatherName,
          fatherContact,
          guardianName,
          guardianContactNo,
          guardiansAddress,
          dob,
          gender,
          mailId,
          courseOccupation,
          address,
          studentPhoto,
          aadharPhoto,
          createdBy,
        });

        await newStudent.save();
        studentIdFromDB = newStudent._id;
      }
    }

    // ✅ Step 3: Find room and check for availability
    const roomUpdate = await Room.findOne({
      createdBy: createdBy,
      roomNumber: roomNumber,
    });

    if (!roomUpdate) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (roomUpdate.availableBeds <= 0) {
      return res
        .status(400)
        .json({ message: "No available beds in this room" });
    }

    // ✅ Step 4: Assign bed with reference to studentId
    const assignedBedData = new AssignBeds({
      roomType,
      roomNumber,
      bedNumber,
      roomRent,
      startDate,
      endDate,
      stayMonths,
      foodFee,
      libraryFee,
      totalRent,
      finalTotalRent,
      advanceAmount,
      discount,
      createdBy,
      studentId: studentIdFromDB,
      roomId: roomUpdate._id,
    });

    await assignedBedData.save();

    // ✅ Step 5: Update room bed details
    const bedIndex = roomUpdate.beds.findIndex(
      (bed) => bed.bedNumber === Number(bedNumber)
    );

    roomUpdate.beds[bedIndex].status = "occupied";
    roomUpdate.beds[bedIndex].studentId = studentIdFromDB;
    roomUpdate.beds[bedIndex].reservationId = assignedBedData._id;

    roomUpdate.availableBeds = roomUpdate.availableBeds - 1;
    roomUpdate.occupiedBeds = roomUpdate.noOfBeds - roomUpdate.availableBeds;

    await roomUpdate.save();

    res.status(201).json({
      message: "Bed assigned successfully!",
      data: assignedBedData,
    });
  } catch (error) {
    console.error("Error Found =>", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const editAssignBed = async (req, res) => {
  try {
    const { id, hostelId } = req.params;
    const {
      roomCategory,
      roomType,
      roomNumber,
      bedNumber,
      roomRent,
      startDate,
      endDate,
      stayMonths,
      foodFee,
      libraryFee,
      totalRent,
      finalTotalRent,
      advanceAmount,
    } = req.body;

    const existingAssignment = await AssignBeds.findById(id);

    if (!existingAssignment) {
      return res.status(404).json({ message: "Assigned bed record not found" });
    }

    const previousRoom = await Room.findById(existingAssignment.roomId);

    if (previousRoom) {
      const prevBedIndex = previousRoom.beds.findIndex(
        (bed) => bed.bedNumber === Number(existingAssignment.bedNumber)
      );
      if (prevBedIndex !== -1) {
        previousRoom.beds[prevBedIndex].status = "available";
        previousRoom.beds[prevBedIndex].studentId = null;
        previousRoom.availableBeds = previousRoom.beds.filter(
          (b) => b.status !== "occupied"
        ).length;
        previousRoom.occupiedBeds =
          previousRoom.beds.length - previousRoom.availableBeds;
        await previousRoom.save();
      }
    }

    // 3. Find the new room
    const newRoom = await Room.findOne({
      roomNumber: roomNumber,
      createdBy: hostelId,
    });

    if (!newRoom) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (newRoom.availableBeds <= 0) {
      return res
        .status(404)
        .json({ message: "No Beds available in this room" });
    }

    // 4. Update the assignment
    const updatedAssign = await AssignBeds.findByIdAndUpdate(
      id,
      {
        roomId: newRoom._id,
        roomCategory,
        roomType,
        roomNumber,
        bedNumber,
        roomRent,
        startDate,
        endDate,
        stayMonths,
        totalRent,
        finalTotalRent,
        advanceAmount,
        foodFee,
        libraryFee,
      },
      { new: true }
    );

    const bedIndex = newRoom.beds.findIndex(
      (bed) => bed.bedNumber === Number(bedNumber)
    );

    // 5. Mark new bed as occupied
    newRoom.beds[bedIndex].status = "occupied";
    newRoom.beds[bedIndex].studentId = existingAssignment.studentId;
    newRoom.availableBeds = newRoom.beds.filter(
      (b) => b.status !== "occupied"
    ).length;
    newRoom.occupiedBeds = newRoom.beds.length - newRoom.availableBeds;
    await newRoom.save();

    // 6. Update the student record if needed
    const latestPayment = await Payment.findOne({
      reservationId: existingAssignment._id,
    }).sort({ createdAt: -1 });

    if (latestPayment) {
      const updatedtotalRent = totalRent;
      const paidAmt =
        latestPayment.finalTotalRent - latestPayment.remainingAmount;
      const updatedFinalTotalRent = finalTotalRent - paidAmt;

      // STEP 3: Update the payment record
      latestPayment.totalRent = updatedtotalRent;
      latestPayment.finalTotalRent = finalTotalRent;
      latestPayment.remainingAmount = updatedFinalTotalRent;

      if (updatedFinalTotalRent > 0) {
        latestPayment.paymentStatus = "pending";
      }
      await latestPayment.save();
    }

    return res.status(200).json({
      message: "Assigned bed updated successfully",
      data: updatedAssign,
    });
  } catch (error) {
    console.error("Error Found =>", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const allReservedStudents = async (req, res) => {
  try {
    const createdBy = req.params.id;

    const reservedStudents = await AssignBeds.find({ createdBy })
      .populate("studentId")
      .populate("roomId");

    res.status(200).json({
      success: true,
      data: reservedStudents,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

const getStudent = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await AssignBeds.findOne({ studentId: studentId });

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export const activeDeactiveUser = async (req, res) => {
  const studentId = req.params.id;
  const { status } = req.body;

  try {
    if (studentId) {
      const updatedStudent = await Students.findByIdAndUpdate(studentId, {
        status,
      });

      if (!updatedStudent) {
        return res.status(404).json({ message: "Student not found" });
      }

      return res
        .status(200)
        .json({ message: "Student Status Update Successfully" });
    } else {
      return res.status(400).json({ message: "Student Id is required" });
    }
  } catch (error) {
    console.error("Error Found =>", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getStudentByContact = async (req, res) => {
  try {
    const contact = req.params.contact;

    const student = await Students.findOne({ studentContact: contact });

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};

export default {
  add,
  view,
  index,
  edit,
  deleteData,
  updateStatus,
  assignBed,
  allReservedStudents,
  getStudent,
  editAssignBed,
  activeDeactiveUser,
  getStudentByContact,
};
