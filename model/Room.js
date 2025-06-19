import mongoose from "mongoose";

const BedSchema = new mongoose.Schema(
  {
    bedNumber: { type: Number, required: true },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      default: null,
    },
    reservationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AssignBed",
      default: null,
    },
    status: {
      type: String,
      enum: ["available", "occupied"],
      default: "available",
    },
  },
  { _id: false }
); // no extra _id for subdocuments unless needed

const RoomSchema = new mongoose.Schema(
  {
    roomTypeId: { type: String, required: true },
    roomCategory: { type: String, required: true },
    roomType: { type: String, required: true },
    roomNumber: { type: String, required: true },
    roomPrice: { type: Number, required: true },
    noOfBeds: { type: Number, required: true },
    availableBeds: { type: Number, required: true },
    occupiedBeds: { type: Number, required: true, default: 0 },
    roomphoto: { type: [String] },
    beds: { type: [BedSchema], default: [] },
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

export default mongoose.model("Room", RoomSchema);
