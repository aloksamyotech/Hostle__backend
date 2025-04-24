import messages from "../constants/message.js";
import CanteenInventory from "../model/CanteenInventory.js";
import CanteenInventoryPurches from "../model/CanteenInventoryPurches.js";
import User from "../model/User.js";

const add = async (req, res) => {
  console.log("In CanteenInventoryPurches Controller..");
  console.log("req id =>", req.params.id);
  console.log("req data =>", req.body);

  try {
    const { productName, quantity, price, date } = req.body;

    const data = await CanteenInventory.findOne({
      productName: productName,
      createdBy: req.params.id,
      deleted: false,
    });
    console.log("data ==================>", data);

    if (!data) {
      return res.status(404).json({ message: "Product is not Found.." });
    }

    const newPurches = new CanteenInventoryPurches({
      productId: data._id,
      productName,
      quantity,
      price,
      date,
      createdBy: req.params.id,
    });
    await newPurches.save();
    console.log("newPurches==>", newPurches);
    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error Found While Add Data", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const index = async (req, res) => {
  console.log("Index In CanteenInventoryPurches Controller..");
  console.log("Id=>", req.params.id);

  try {
    let result = await CanteenInventoryPurches.find({
      createdBy: req.params.id,
      deleted: false,
    }).populate("productId", "mesurment");
    
    console.log("result=>", result);
    let total_recodes = await CanteenInventoryPurches.countDocuments({
      createdBy: req.params.id,
      deleted: false,
    });
    res.status(200).send({
      result,
      totalRecodes: total_recodes,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const view = async (req, res) => {
  console.log("In CanteenInventoryPurches Controller..");
  console.log("Id=>", req.params.id);

  let result = await CanteenInventoryPurches.findById({ _id: req.params.id });
  console.log("result=>", result);

  if (!result) {
    return res.status(404).json({ message: "Product is not Found.." });
  }
  res.status(200).json(result);
};

const edit = async (req, res) => {
  console.log("In CanteenInventoryPurches Controller..");
  console.log("Id=>", req.params.id);

  try {
    let result = await CanteenInventoryPurches.updateOne(
      { _id: req.params.id },
      {
        $set: {
          productName: req.body.productName,
          quantity: req.body.quantity,
          price: req.body.price,
          date: req.body.date,
        },
      }
    );
    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
    console.log("result==>", result);
  } catch (error) {
    console.log("Found Error While Update", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  console.log("In CanteenInventoryPurches Controller..");
  console.log("Id=>", req.params.id);

  try {
    let result = await CanteenInventoryPurches.findById({ _id: req.params.id });

    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await CanteenInventoryPurches.findByIdAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );
      console.log("Product Details deleted successfully !!");
      res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

export default { add, index, view, edit, deleteData };
