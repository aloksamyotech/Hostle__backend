import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema({
  hostelName: { type: String, required: true },
  hostelPhoneNumber: { type: Number, required: true, unique: true },
  ownerName: { type: String, required: true },
  ownerPhoneNumber: { type: Number, required: true, unique: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  hostelphoto: { type: String },
  aadharphoto: { type: String },
  role: { type: String, required: true },
  deleted: { type: Boolean, default: false },
});

export default mongoose.model("Hostel", HostelSchema);
