import mongoose from "mongoose";

const RoomTypeSchema = new mongoose.Schema({
  roomType: { type: String, require: true },
  roomCategory: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'Hostel',
  },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("RoomType", RoomTypeSchema);


