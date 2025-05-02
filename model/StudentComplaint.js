import mongoose from "mongoose";
import Hostel from "../model/Hostel.js";
import ReserveStudent from "../model/StudentReservation.js";
import User from "./User.js";

const StudentComplaintSchema = mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },
    datetime: { type: Date, required: true },
    problemDescription: { type: String, required: true },
    status: {
      type: String,
      required: true,
      default: "register",
      enum: ["register", "in progress", "complete"],
    },
    deleted: { type: Boolean, default: false },
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

export default mongoose.model("StudentComplaint", StudentComplaintSchema);
