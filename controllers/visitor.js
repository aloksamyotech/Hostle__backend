import StudentReservation from "../model/StudentReservation.js";
import Visitor from "../model/Visitor.js";
import messages from "../constants/message.js";

const add = async(req, res) => {
    console.log("Add ----> In Visitor Controller..");
    console.log("Req Id=>",req.params.id);
    console.log("Req Data====>",req.body);

    try{
        const { studentName,studentPhoneNo, visitorName, phoneNumber, dateTime } = req.body;

        const data = await StudentReservation.findOne({studentPhoneNo : req.body.studentPhoneNo});
        console.log("data=>",data);

        const newVisitor = new Visitor({
            studentId : data._id,
            studentName,
            visitorName,
            phoneNumber,
            dateTime,
            createdBy : req.params.id,
        });
        await newVisitor.save();

        console.log("newVisitor",newVisitor);
        res.status(201).json({ message : messages.DATA_SUBMITED_SUCCESS});
    }catch(error){
        console.log("Error Found While add Data",error);
        res.status(500).json({ message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async(req, res) => {
    console.log("index In Visitor Controller..");
    console.log("Req Id=>",req.params.id);

    try{
        let result = await Visitor.find({createdBy : req.params.id, deleted : false}).populate('studentId', 'roomNumber');
        console.log("result==>",result);

        let total_recodes = await Visitor.countDocuments({createdBy : req.params.id, deleted : false});
        console.log("total_recodes==>",total_recodes);

        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });
    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    } 
}

const list = async(req, res) => {
    console.log("list In Visitor Controller.. Id ====>", req.params.id);

    try{
        const result = await Visitor.find({studentId : req.params.id});
        console.log("In Visitor result ===>",result);
        const total_recodes = await Visitor.countDocuments({studentId : req.params.id, deleted : false});
        console.log("In Visitor total_recodes ===>",total_recodes);


        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });
    }catch(error){
        console.log("Error =>", error);
        res.status(401).json({message : messages.DATA_NOT_FOUND_ERROR});
    }
}


export default {add, index, list};