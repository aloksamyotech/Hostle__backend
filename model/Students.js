import mongoose from "mongoose";

const StudentDataSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: true,
    },
    studentContact: {
      type: String,
      unique: true,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    fatherContact: {
      type: String,
      required: true,
    },
    guardianName: {
      type: String,
      required: true,
    },
    guardianContactNo: {
      type: Number,
      required: true,
    },
    guardiansAddress: {
      type: String,
      required: true,
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"],
    },
    mailId: {
      type: String,
      required: true,
      lowercase: true,
    },
    courseOccupation: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    studentPhoto: {
      type: String,
      trim: true,
      default: "",
    },
    aadharPhoto: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      required: true,
      default: "active",
      enum: ["active", "inactive"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Student", StudentDataSchema);
