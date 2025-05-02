import mongoose from "mongoose";

const VisitorSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.ObjectId,
      ref: "Student",
    },
    visitorName: { type: String, required: true },
    phoneNumber: { type: Number, required: true },
    dateTime: { type: Date, required: true },
    deleted: { type: Boolean, default: false },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: "Hostel",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Visitor", VisitorSchema);
