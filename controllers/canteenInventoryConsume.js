import CanteenInventoryConsume from "../model/CanteenInventoryConsume.js";
import Hostel from "../model/Hostel.js";
import CanteenInventoryPurches from "../model/CanteenInventoryPurches.js";
import User from "../model/User.js";
import messages from "../constants/message.js";
import CanteenInventory from "../model/CanteenInventory.js";

const add = async (req, res) => {
  console.log("In CanteenInventoryConsume Controller..");
  console.log("Req Id =>", req.params.id);
  console.log("Req Body =>", req.body);
  let remaning = 0;

  try {
    const { productName, quantity, date } = req.body;

    let data = await CanteenInventory.findOne({ productName: productName });

    let latestConsume = await CanteenInventoryConsume.findOne({
      productName,
      createdBy: req.params.id,
    }).sort({ date: -1 });
    console.log("latestConsume===>", latestConsume);

    let purchaseData = await CanteenInventoryPurches.findOne({
      productName,
      createdBy: req.params.id,
    });
    if (!purchaseData) {
      return res
        .status(404)
        .json({ message: "Product not found in inventory." });
    }

    if (!latestConsume) {
      remaning = purchaseData.quantity - Number(quantity);
    } else {
      remaning = latestConsume.remaning - Number(quantity);
    }

    const purchaseQuantity = purchaseData.quantity;
    console.log("purchaseQuantity => ", purchaseQuantity);

    //check if consume quantity is more than purchase and remaning quantity..
    if (Number(quantity) > purchaseQuantity || remaning < 0) {
      return res.status(205).json({
        message:
          "Consume quantity cannot be greater than remaining or purchase quantity.",
      });
    }

    const newConsume = new CanteenInventoryConsume({
      productId: data._id,
      productName,
      quantity,
      remaning,
      date,
      createdBy: req.params.id,
    });
    await newConsume.save();

    console.log("newConsume==>", newConsume);
    res.status(201).json({ message: "Data submitted successfully." });
  } catch (error) {
    console.log("Error Found While Add Data", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const index = async (req, res) => {
  console.log("In CanteenInventoryConsume Controller..");
  console.log("Id =>", req.params.id);

  try {
    let result = await CanteenInventoryConsume.find({
      createdBy: req.params.id,
      deleted: false,
    }).populate("productId", "mesurment");
    console.log("result=>", result);
    let total_recodes = await CanteenInventoryConsume.countDocuments({
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
  console.log("In CanteenInventoryConsume Controller..");
  console.log("Id=>", req.params.id);

  let result = await CanteenInventoryConsume.findById({ _id: req.params.id });
  console.log("result=>", result);

  if (!result) {
    return res.status(404).json({ message: "Product is not Found.." });
  }
  res.status(200).json(result);
};

const edit = async (req, res) => {
  console.log("on edit consume quantity id =>", req.params.id);
  try {
    const currentConsumeQut = await CanteenInventoryConsume.findById(
      req.params.id
    );
    console.log("currentConsumeQut  ==> ", currentConsumeQut);

    const purchaseData = await CanteenInventoryPurches.findOne({
      productName: req.body.productName,
      createdBy: currentConsumeQut.createdBy,
    });
    console.log("purchaseData  ==> ", purchaseData);

    const purchaseQuantity = purchaseData.quantity;
    console.log("purchaseQuantity => ", purchaseQuantity);

    if (
      Number(req.body.quantity) > purchaseQuantity ||
      Number(req.body.quantity) > currentConsumeQut.remaning
    ) {
      return res.status(205).json({
        message:
          "Consume quantity cannot be greater than remaining or purchase quantity.",
      });
    }

    let remqut;
    if (Number(req.body.quantity) > currentConsumeQut.quantity) {
      let diff = Number(req.body.quantity) - currentConsumeQut.quantity;
      console.log(
        "diff => when consume quatity grater then current consume quanity =>",
        diff
      );

      remqut = currentConsumeQut.remaning - diff;
      console.log(
        "remqut => when consume quatity grater then current consume quanity =>",
        remqut
      );
    } else {
      let diff = currentConsumeQut.quantity - Number(req.body.quantity);
      console.log(
        "diff => when consume quatity less then current consume quanity =>",
        diff
      );

      remqut = currentConsumeQut.remaning + diff;
      console.log(
        "remqut => when consume quatity less then current consume quanity =>",
        remqut
      );
    }

    let result = await CanteenInventoryConsume.updateOne(
      { _id: req.params.id },
      {
        $set: {
          quantity: req.body.quantity,
          remaning: remqut,
          date: req.body.date,
        },
      }
    );

    console.log("result==>", result);
    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    console.log("Error Found ==>", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  console.log("In CanteenInventoryConsume Controller..");
  console.log("Id=>", req.params.id);

  try {
    let result = await CanteenInventoryConsume.findById({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await CanteenInventoryConsume.findByIdAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );
      console.log("Product Details deleted successfully !!");
      res.json({ message: "Product Details deleted successfully !!" });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

export default { add, index, view, edit, deleteData };
