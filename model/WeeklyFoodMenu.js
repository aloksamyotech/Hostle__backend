import mongoose from 'mongoose';
import Hostel from './Hostel.js';

const WeeklyFoodSchema = new mongoose.Schema({
    weekdays : {type : String, require : true},
    foodType : {type : String, require : true},
    foodDescription : {type : String, require : true},
    deleted : {type : Boolean, default : false},
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: Hostel,
    }
});
export default mongoose.model('WeeeklyFoodMenu', WeeklyFoodSchema);

