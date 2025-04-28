import mongoose from "mongoose";

const RoomSchema = new mongoose.Schema({
  roomCategory: { type: String, require: true },
  roomType: { type: String, required: true },
  roomNumber: { type: Number, require: true },
  roomPrice: { type: Number, require: true },
  noOfBeds: { type: Number, required: true },
  availableBeds: { type: Number, required: true },
  occupiedBeds: { type: Number, required: true, default: 0 },
  roomphoto: { type: [String], require: true },

  deleted: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Hostel",
  },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date },
});

export default mongoose.model("Room", RoomSchema);
