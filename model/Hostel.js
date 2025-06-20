import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema(
  {
    hostelName: { type: String },
    hostelPhoneNumber: { type: Number, unique: true },
    ownerName: { type: String },
    ownerPhoneNumber: { type: Number, unique: true },
    email: { type: String },
    password: { type: String },
    address: { type: String },
    hostelphoto: { type: String },
    // aadharphoto: { type: String },
    role: { type: String, required: true },
    deleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Hostel", HostelSchema);
