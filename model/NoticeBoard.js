import mongoose from "mongoose";
import Hostel from "./Hostel.js";

const NoticeBoardSchema = new mongoose.Schema({
    noticeTitle : {type : String, require : true},
    description : {type : String, require : true},
    dateTime    : {type : Date, require : true},
    deleted     : {type : Boolean, default : false },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: Hostel,
    }
}); 

export default mongoose.model('NoticeBoard',NoticeBoardSchema);
