import mongoose from "mongoose";

const AssignBedSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    roomType: {
      type: String,
      required: true,
    },
    roomNumber: {
      type: String,
      required: true,
    },
    bedNumber: {
      type: String,
      required: true,
    },
    roomRent: {
      type: Number,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    stayMonths: {
      type: Number,
      required: true,
    },
    totalRent: {
      type: Number,
      required: true,
    },
    foodFee: {
      type: Number,
      required: true,
    },
    libraryFee: {
      type: Number,
      required: true,
    },
    advanceAmount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
    finalTotalRent: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("AssignBed", AssignBedSchema);
