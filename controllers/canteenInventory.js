import CanteenInventory from "../model/CanteenInventory.js";
import messages from "../constants/message.js";
import User from "../model/User.js";

const add = async (req, res) => {
    console.log("In CanteenInventory Controller..");
    console.log("req id=>",req.params.id);
    console.log("req data=>",req.data);

    try{
        const { productName, mesurment } = req.body;
        
        const newInventory = new CanteenInventory({
            productName,
            mesurment,
            createdBy : req.params.id,
        });
        await newInventory.save();
        console.log("newInventory==>",newInventory);
        res.status(201).json({message : messages.DATA_SUBMITED_SUCCESS});

    }catch(error){
        console.log('Error Found While Add Data',error);
        res.status(500).json({message : messages.INTERNAL_SERVER_ERROR});
    }
}

const index = async (req, res) => {
    console.log("In CanteenInventory Controller..");
    console.log("Req id=>",req.params.id);
    try{
        let result = await CanteenInventory.find({createdBy : req.params.id, deleted : false});
        console.log("result=>",result);

        let total_recodes = await CanteenInventory.countDocuments({createdBy : req.params.id, deleted : false});
        res.status(200).send({ result, totalRecodes: total_recodes, message : messages.DATA_FOUND_SUCCESS });

    }catch(error){
        console.log("Error =>", error);
        res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
    } 
}

const view = async (req, res) => {
    console.log("In CanteenInventory Controller..");
    console.log("Id=>", req.params.id);

    let result = await CanteenInventory.findById({_id : req.params.id});
    console.log("result=>",result);

    if(!result){
        return res.status(404).json({message : "Product is Found.."});
    }
    res.status(200).json(result);
}

const edit = async (req, res) => {
    console.log("Edittttt In CanteenInventory Controller..");
    console.log("Id=>", req.params.id);

    try{
        let result = await CanteenInventory.updateOne(
            {_id : req.params.id},
            {
                $set : {
                    productName : req.body.productName,
                    mesurment : req.body.mesurment,
                }
            }
        );
        res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
        console.log("result==>",result);
    }catch(error){
        console.log("Found Error While Update", error);
        res.status(400).json({message : messages.DATA_UPDATED_FAILED});
    }
}

const deleteData = async (req, res) => {
    console.log("In CanteenInventory Controller..");
    console.log("Id=>", req.params.id);

    try{
        let result = await CanteenInventory.findById({_id : req.params.id});

        if(!result){
            return res.status(404).json({message: messages.DATA_NOT_FOUND_ERROR});
        }else{
            await CanteenInventory.findByIdAndUpdate({_id : req.params.id},{deleted : true});
            console.log("Product Details deleted successfully !!");
            res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
        }
    }catch(error){
        console.log("Error =>", error);
        res.status(400).json({ message: messages.DATA_DELETE_FAILED });
    }
}

const importFileData = async (req, res)=> {
    console.log("in importFileData controller");
    console.log("req.params =>", req.params.id);
    console.log("aaya ==>", req.body);

    const items = req.body;
    console.log("items =>",items);
  
    if (!items || !Array.isArray(items)) {
      return res.status(400).send({ message: 'Invalid data format' });
    }

    try{
        console.log("in try...");

        const normalizedItems = items.map(item => ({
            productName: item['productName'],
            mesurment: item['mesurment'],
            createdBy: req.params.id, 
          }));

        console.log("normalizedItems==>", normalizedItems);
        await CanteenInventory.insertMany(normalizedItems);
        res.status(200).send({ message: 'Inventory items imported successfully' });
    }catch(error){
        console.error(error);
        res.status(500).send({ message: 'Failed to import items' });
    }
}

export default { add, index, view, edit, deleteData, importFileData };