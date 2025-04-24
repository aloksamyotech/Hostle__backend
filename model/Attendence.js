import mongoose from 'mongoose';

const AttendenceSchema = new mongoose.Schema({
    studentHosId : { type: String, required: true },
    studentName : { type: String, required: true },
    hostelId: { type: String, required: true },
    hostelName : { type: String, required: true },
    date : { type: Date, required: true},
    outTime : { type: String},
    inTime : { type: String},
}); 

export default mongoose.model('Attendence',AttendenceSchema);



