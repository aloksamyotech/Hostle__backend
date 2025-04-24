import NoticeBoard from "../model/NoticeBoard.js";
import Hostel from "../model/Hostel.js";
import messages from "../constants/message.js";
import User from "../model/User.js";

const add = async(req,res) => {
    console.log("in noticeboard controller..");
    console.log("req id=>",req.params.id);
    console.log("req data=>",req.body);

    try{
        const { noticeTitle, description, dateTime } = req.body;
        
        const newNotice = new NoticeBoard({
            noticeTitle,
            description,
            dateTime,
            createdBy : req.params.id
        });
        await newNotice.save();
        console.log("newNotice=>",newNotice);
        res.status(201).json({message : messages.DATA_SUBMITED_SUCCESS});
    }catch(error){
        res.status(500).json({message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async (req,res) => {
    console.log("in noticeboard controller..");
    console.log("Id==>",req.params.id);

    try{
        let result = await NoticeBoard.find({createdBy : req.params.id, deleted : false});
        console.log("Results=>",result);

        let total_recodes = await NoticeBoard.countDocuments({createdBy : req.params.id, deleted : false});
        console.log("total_recodes==>",total_recodes);
        
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });

    }   
}

const view = async (req,res) => {
    console.log("in noticeboard controller..");
    console.log("Id : ",req.params.id );

    let result = await NoticeBoard.findById({_id : req.params.id});

    if(!result){
        res.status(400).json({message : 'data is not found'});
    }else{
        res.status(200).json(result);
    }
}

const edit = async (req,res) => {
    console.log("in noticeboard controller..");
    console.log("Id : ",req.params.id );

    try{
        let result = await NoticeBoard.updateOne(
            {_id : req.params.id},
            {
                $set : {
                    noticeTitle : req.body.noticeTitle,
                    description : req.body.description,
                    dateTime : req.body.dateTime,
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
    try{
        console.log("Id:",req.params.id);
        const result = await NoticeBoard.findById({_id : req.params.id});
        if(!result){
          return res.status(404).json({message :' data is not found !!'});
        }else{
          await NoticeBoard.findByIdAndUpdate({_id : req.params.id},{deleted : true});
          console.log("Data deleted successfully !!");
          res.json({message : "Data deleted successfully !!"});
        }
      }catch(error){
        res.status(404).json({message : "Error Found",error});
    }
}

export default { add, index,view,edit,deleteData};
