import StudentComplaint from "../model/StudentComplaint.js";
import StudentReservation from "../model/StudentReservation.js";
import messages from "../constants/message.js";

const add = async (req, res) => {
    console.log("In Student Complaint Controller");
    console.log("Req Id=>",req.params.id);
    console.log("Req Data=>",req.body);

    try{
        const {studentName,studentPhoneNo,datetime,problemDescription,status} = req.body;

        const data = await StudentReservation.findOne({studentPhoneNo : req.body.studentPhoneNo});
        console.log("data=>",data);

        // const roomNumber = data.roomNumber;

        const newComplaint = new StudentComplaint({
            studentName,
            studentPhoneNo, 
            roomNumber : data.roomNumber,
            datetime,
            problemDescription,
            status,
            createdBy : req.params.id
        });
        await newComplaint.save();

        console.log("Data Store =>",newComplaint);
        res.status(201).json({ message : messages.DATA_SUBMITED_SUCCESS});
    }catch(error){
        console.log("Error Found While add rooms",error);
        res.status(500).json({ message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async (req, res) => {
    console.log("In Student Complaint Controller");
    console.log("Req Id=>",req.params.id);

    try{
        let result = await StudentComplaint.find({createdBy : req.params.id, deleted : false}); 
        console.log("result=>",result); 

        let total_recodes = await StudentComplaint.countDocuments({createdBy : req.params.id, deleted : false});
        console.log("total_recodes==>",total_recodes);

        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });
    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    } 
}

const view = async (req, res) => {
    console.log("In View");
    console.log("id =>", req.params.id);

    let result = await StudentComplaint.findOne({studentHosId : req.params.id});
    if(!result){
    return res.status(404).json({message : "No Details is Found.."});
    }
    console.log("result=>",result);
    res.status(200).json(result);
}

const edit = async (req, res) => {
    console.log("In Student Complaint Controller For Edit----------->");
    console.log("Id",req.params.id);

    try{
        let result = await StudentComplaint.updateOne(
            {_id : req.params.id},
                {
                    $set : {
                        studentName : req.body.studentName,
                        roomNumber : req.body.roomNumber,
                        datetime : req.body.datetime,
                        problemDescription : req.body.problemDescription,
                        status : req.body.status, 
                    }
                }
        );
        res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
    }catch(error){
        console.log("Found Error While Update", error);
        res.status(400).json({message : messages.DATA_UPDATED_FAILED});
    }
}

const deleteData = async (req,res) => {
    console.log("In Student Complaint Controller Delete Data");
    console.log("Id:",req.params.id);
    try{
        
        const result = await StudentComplaint.findOne({_id : req.params.id});
        if(!result){
            return res.status(404).json({message: messages.DATA_NOT_FOUND_ERROR});
        }else{
          await StudentComplaint.findOneAndUpdate({_id : req.params.id},{deleted : true});
          console.log("Student Complain Details deleted successfully !!");
          res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
        }

      }catch(error){
        console.log("Error =>", error);
        res.status(400).json({ message: messages.DATA_DELETE_FAILED });
    }
}

const allComplaints = async (req,res) => {
    try{
        console.log("in allComplaints... Id",req.params.id);

         // Fetch all expenditures created by the specified user
         const adminData = await StudentComplaint.find({ createdBy: req.params.id });
         console.log("adminData =>", adminData);

         let totalComplaints ={
            complete : 0,
            register : 0,
            inprogress : 0,
         }

         for(let complaint of adminData){
            if(complaint.status === 'complete'){
                totalComplaints.complete += 1;

            }else if(complaint.status === 'register'){
                totalComplaints.register += 1;

            }else if(complaint.status === 'in progress'){
                totalComplaints.inprogress += 1;
            }
         }
         res.status(200).json({totalComplaints, message: messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Found Error While Update", error);
        res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    }

}

export default {add,index,view,edit,deleteData,allComplaints};