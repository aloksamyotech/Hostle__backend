// import mongoose from "mongoose";

// const HostelSchema = new mongoose.Schema({
//     hostelName : { type: String, required: true },
//     phoneNumber : { type: Number, required: true },
//     email : { type: String, required: true },
//     noOfRoom : { type: Number, required: true },
//     uniqueCode : { type: String, required: true, unique: true },
//     state: { type: String, required: true },
//     city: { type: String, required: true },
//     address: { type: String, required: true },
//     photo: { type: [String] },
//     availableBeds : {type: Number, require:true, default: 0 },
//     deleted: { type: Boolean, default: false },
//     isAdmin: { type: String, default: false }
// });

// export default mongoose.model("Hostel",HostelSchema);

import mongoose from "mongoose";

const HostelSchema = new mongoose.Schema({
    hostelName : { type: String, required: true },
    hostelPhoneNumber : { type: Number, required: true },
    ownerName : { type: String, required: true },
    ownerPhoneNumber : { type: Number, required: true },
    email : { type: String, required: true },
    password : { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    hostelphoto: { type: String},
    aadharphoto: { type: String},
    role: { type: String, required: true},
    deleted: { type: Boolean, default: false },
});

export default mongoose.model("Hostel",HostelSchema);





