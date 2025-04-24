import WeeklyFoodMenu from "../model/WeeklyFoodMenu.js";
import messages from "../constants/message.js";
import User from "../model/User.js";

const add = async (req,res) => {
    console.log("In WeeklyFoodMenu Controller..");
    console.log("req id =>",req.params.id);
    console.log("req data =>",req.body);

    try{
        const {weekdays, foodType, foodDescription} = req.body;
        
        let newFoodMenu = new WeeklyFoodMenu({
            weekdays,
            foodType,
            foodDescription,
            createdBy : req.params.id,
        });
        await newFoodMenu.save(); 

        console.log("newFoodMenu=>",newFoodMenu);
        res.status(201).json({ message : messages.DATA_SUBMITED_SUCCESS});

    }catch(error){
        console.log("Error Found While add Data",error);
        res.status(500).json({ message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async (req,res) => {
    console.log("In WeeklyFoodMenu Controller..");
    console.log("Id =>",req.params.id);

    try{
        let result = await WeeklyFoodMenu.find({createdBy : req.params.id, deleted : false});
        console.log("result==>",result);

        let total_recodes = await WeeklyFoodMenu.countDocuments({createdBy : req.params.id, deleted : false});
        console.log("total_recodes==>",total_recodes);

        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });
    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    }   
}

const edit = async (req, res) => {
    console.log("req.params =>", req.params.id);
    console.log("req.body =>",req.body);
    try{
        let result = await WeeklyFoodMenu.updateOne(
            {_id : req.params.id},
            {
                $set : {
                    weekdays : req.body.weekdays,
                foodType : req.body.foodType,
                foodDescription : req.body.foodDescription,
                }
            }
        ); 

        console.log("edit result =>",result);
        res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
    }catch(error){
        console.log("Error =>", error);
        res.status(400).json({ message: messages.DATA_UPDATED_FAILED});
    }
}

const deleteData = async( req, res) => {
    try{
        console.log("Id:",req.params.id);
        const result = await WeeklyFoodMenu.findById({_id : req.params.id});
        if(!result){
          return res.status(404).json({message : messages.DATA_NOT_FOUND_ERROR});
        }else{
          await WeeklyFoodMenu.findByIdAndUpdate({_id : req.params.id},{deleted : true});
          console.log("Data deleted successfully !!");
          res.json({message : messages.DATA_DELETE_SUCCESS});
        }
    }catch(error){
        res.status(404).json({message : messages.DATA_DELETE_FAILED,error});
    }
}

export default {add, index,edit, deleteData };

