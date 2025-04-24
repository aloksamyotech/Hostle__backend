import Attendence from "../model/Attendence.js";
import StudentReservation from "../model/StudentReservation.js";

const add = async (req, res) => {
    console.log("In Attendence Controller..");
    console.log("Req Data =>",req.body);

    try{
        const {studentHosId, date, outTime, inTime } = req.body;

        const existingAttendance = await Attendence.findOne({ studentHosId : req.body.studentHosId, date :req.body.date });

        if (existingAttendance) {
            return res.status(400).json({ message: `Hi, attendance for student ID ${studentHosId} on ${date} has already been recorded.` });
        }
        
        const data = await StudentReservation.findOne({studentHosId : req.body.studentHosId});
        const hostelId = data.hostelId;
        const hostelName = data.hostelName;
        const studentName = data.studentName;

        const newAttendence = new Attendence({
            studentHosId,
            studentName,
            hostelId,
            hostelName,
            date,
            outTime,
            inTime
        });
        await newAttendence.save();
        console.log("newAttendence",newAttendence);
        res.status(201).json({message : `Hi ${studentName} Your Today's Attendence add Successfully!!`});
    }catch(error){
        console.log("Error Found While add Data",error);
        res.status(500).json({ message : "Internal Server Error"});
    }
}

const edit = async (req,res) => {
    console.log("In Attendence Controller..");
    console.log("Id=>",req.params.id);
    console.log("Date=>",req.params.date);

    try{
        let result = await Attendence.updateOne(
            {studentHosId : req.params.id, date : req.params.date},
            {
                $set : {
                    inTime : req.body.inTime,
                }
            }
        );
        console.log("result=>",result);
        res.status(200).json({result, message : " Add InTime Successfully !!"});
    }catch(error){
        console.log("Found Error While add InTime", error);
        res.status(400).json({error : "Failed to add InTime"});

    }


}

export default {add, edit };