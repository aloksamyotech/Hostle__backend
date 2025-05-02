import mongoose from "mongoose";
import Hostel from "./Hostel.js";
import User from "./User.js";

const StudentSchema = new mongoose.Schema({
  hostelId: { type: String, required: true, ref: Hostel },
  hostelname : { type: String, required: true, ref: Hostel },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, required: true },
  phonenumber: { type: Number, required: true, unique: true },
  aadharcardId: { type: Number, required: true },
  state: { type: String, required: true },
  city: { type: String, required: true },
  address: { type: String, required: true },
  photo: { type: String, required: true },
  role: { type: String, required: true },
  deleted: { type: Boolean, default: false },
  studentHosId: { type: String, unique: true},
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: User
  }
});

export default mongoose.model("StudentData",StudentSchema);
