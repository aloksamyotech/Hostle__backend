import mongoose from "mongoose";
import student from "../controllers/student.js";

const StudentPaymentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
    totalRent: {
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
    remainingAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    paymentAmount: {
      type: Number,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hostel",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("StudentPayment", StudentPaymentSchema);
