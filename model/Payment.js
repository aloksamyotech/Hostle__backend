// import mongoose from 'mongoose';
// import Hostel from './Hostel.js';

// const StudentPaymentSchema = new mongoose.Schema({
//     studentId: { 
//         type: mongoose.Schema.Types.ObjectId, 
//         ref: 'StudentReservation',   
//     },
//     studentName: { type: String, required: true },
//     month: { type: String, required: true },
//     paymentDate: { type: Date, required: true },
//     paymentAmount: { type: Number, required: true },
//     paymentType: { type: String, required: true },
//     paymentAttachment: { type: String },
    
//     totalAmmount : {type: Number },
//     monthlyAmmount : {type: Number},
//     monthlyPending : {type: Number},
//     totalPending : {type: Number},
//     deleted     : {type : Boolean, default : false },
//     createdBy: {
//         type: mongoose.Schema.ObjectId,
//         ref: Hostel,
//     }
// });

// export default mongoose.model('StudentPayment', StudentPaymentSchema);



import mongoose from 'mongoose';
import Hostel from './Hostel.js';

const StudentPaymentSchema = new mongoose.Schema({
    studentId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'StudentReservation', 
        required: true
    },
    studentName: { type: String, required: true },
    studentPhoneNo: {type: Number, required: true},
    month: { type: String, required: true },
    paymentDate: { type: Date, required: true },
    paidAmount: { type: Number, required: true },
    paymentType: { type: String, required: true },
    paymentAttachment: { type: String },

    libraryAmount : {type: Number},
    foodAmount : {type: Number},
    hostelRent : {type: Number},

    monthlyTotalAmount: { type: Number },
    monthlyPending: { type: Number },

    totalAmmount: { type: Number },
    totalPending: { type: Number },

    deleted: { type: Boolean, default: false },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hostel',
        required: true
    },
    updatedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hostel' 
    },
    deletedBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'Hostel'
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    deletedAt: { type: Date }
}, {
    timestamps: true 
});

// Middleware to update `updatedAt` and manage `deletedAt`
StudentPaymentSchema.pre('save', function (next) {
    if (this.isModified()) {
        this.updatedAt = Date.now();
    }
    next();
});

export default mongoose.model('StudentPayment', StudentPaymentSchema);
