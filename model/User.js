import mongoose from "mongoose";
import Hostel from "../model/Hostel.js";
import hostel from "../controllers/hostel.js";

const UserSchema = new mongoose.Schema({
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
  role: { type: String, required: true, enum: ['SuperAdmin', 'SubAdmin'] },
  deleted: { type: Boolean, default: false },
  studentHosId: { type: String, unique: true, sparse: true }, 
});

UserSchema.index({ studentHosId: 1 }, { unique: true, sparse: true });

export default mongoose.model("User", UserSchema);







