import mongoose from "mongoose";


const RoomSchema = new mongoose.Schema({
    roomNumber: { type: Number, require: true },
    roomType: { type: String, required: true },
    numOfBeds: { type: Number, required: true },
    occupiedBeds: { type: Number, required: true, default : 0 },
    availableBeds: { type: Number, required: true,},
    roomphoto: { type: [String], require: true },
    deleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hostel'
    }
});

export default mongoose.model('Room', RoomSchema);


