import mongoose from "mongoose";

const studentReservationSchema = new mongoose.Schema({
    studentName : { type: String, required: true },
    studentPhoneNo : { type: Number, required: true },
    fathersName : { type: String, required: true },
    fathersPhoneNo : { type: Number, required: true },
    dateOfBirth : { type: Date, required: true },
    gender : { type: String, required: true },
    email : { type: String, required: true, unique: true },
    studentphoto : { type: String, required: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    aadharcardphoto : { type: String, required: true },
    roomNumber : { type: Number, required: true },
    startDate : { type: Date, required: true },
    endDate : { type: Date, required: true },
    isLibrary : { type: String, required: true },
    isFood : { type: String, required: true },
    libraryAmount : { type: Number, required: true },
    foodAmount : { type: Number, required: true },
    hostelRent : { type: Number, required: true },
    advancePayment : { type: Number, required: true },
    MonthlyTotalAmmount : { type: Number }, 
    totalAmount : { type: Number, required: true },
    status: {
        type: String,
        required: true,
        default: 'active',
        enum: ['active', 'inactive']
    },
    deleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hostel'
    }
});
export default mongoose.model("StudentReservation",studentReservationSchema);
