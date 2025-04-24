import mongoose from 'mongoose';
import User from './User.js';
import Hostel from './Hostel.js';

const ExpenseSchema = new mongoose.Schema({
    expenseTitle : { type : String, require : true }, 
    price        : { type : Number, require : true }, 
    date         : { type : Date,   require : true },
    monthName    : {type : String,  require : true},
    billPhoto : { type : String,   require : true },
    deleted      : { type : Boolean, default : false},   
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: Hostel,
    }
});

export default mongoose.model('Expenditure',ExpenseSchema);

