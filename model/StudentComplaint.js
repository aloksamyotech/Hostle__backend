import mongoose from "mongoose";
import Hostel from '../model/Hostel.js'
import ReserveStudent from '../model/StudentReservation.js' 
import User from "./User.js";

const StudentComplaintSchema = mongoose.Schema({
    
    studentName :        { type: String, required: true, ref: ReserveStudent },
    studentPhoneNo :     { type: Number, required: true, ref: ReserveStudent },
    roomNumber  :        { type: Number, required: true,  ref: ReserveStudent},
    datetime :           { type: Date, required: true},
    problemDescription : { type: String, required: true},
    status: { 
        type: String, 
        required: true, 
        default: 'register', 
        enum: ['register', 'in progress', 'complete'] 
    },
    deleted:             { type: Boolean, default: false },
    createdBy     : {
        type: mongoose.Schema.ObjectId,
        ref: User
    }
});

export default mongoose.model('StudentComplaint',StudentComplaintSchema);

