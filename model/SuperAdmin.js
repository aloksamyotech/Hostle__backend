import mongoose from "mongoose";

const SuperAdminSchema = new mongoose.Schema({
    name : { type: String, required: true },
    email : { type: String, required: true },
    password : { type: String, required: true },
    role : { type: String, required: true },
});
export default mongoose.model("SuperAdmin",SuperAdminSchema);