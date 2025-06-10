import messages from "../constants/message.js";
import CanteenInventory from "../model/CanteenInventory.js";
import CanteenInventoryPurches from "../model/CanteenInventoryPurches.js";
import User from "../model/User.js";
import { statusCodes } from "../core/constant.js";
import {
  commonMessage,
  canteenInventoryPurchesMessages,
} from "../core/messages.js";
import { createResponse, sendResponse } from "../helper/ResponseHelper.js";

const add = async (req, res) => {
  try {
    const { productName, quantity, price, date } = req.body;

    const data = await CanteenInventory.findOne({
      productName: productName,
      createdBy: req.params.id,
      deleted: false,
    });

    if (!data) {
      return sendResponse(
        res,
        createResponse(
          statusCodes.NOT_FOUND,
          canteenInventoryPurchesMessages.NOT_FOUND
        )
      );
    }

    let purchesBillPhoto = null;
    if (req.files && req.files.purchesBillPhoto) {
      purchesBillPhoto = `/images/${req.files.purchesBillPhoto[0].filename}`;
    }

    const newPurches = new CanteenInventoryPurches({
      productId: data._id,
      productName,
      quantity,
      price,
      date,
      purchesBillPhoto,
      createdBy: req.params.id,
    });
    await newPurches.save();

    return sendResponse(
      res,
      createResponse(statusCodes.CREATED, canteenInventoryPurchesMessages.ADD)
    );
  } catch (error) {
    console.log("Error Found While Add Data", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const index = async (req, res) => {
  try {
    let result = await CanteenInventoryPurches.find({
      createdBy: req.params.id,
      deleted: false,
    }).populate("productId", "mesurment");

    let total_recodes = await CanteenInventoryPurches.countDocuments({
      createdBy: req.params.id,
      deleted: false,
    });
   

    return sendResponse(
      res,
      createResponse(statusCodes.OK, commonMessage.SUCCESS, result)
    );
  } catch (error) {
    console.log("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.NOT_FOUND,
        canteenInventoryPurchesMessages.NOT_FOUND
      )
    );
  }
};

const view = async (req, res) => {


  let result = await CanteenInventoryPurches.findById({ _id: req.params.id });
 

  if (!result) {
    return res.status(404).json({ message: "Product is not Found.." });
  }
  res.status(200).json(result);
};

const edit = async (req, res) => {
  try {
    let purchesBillPhoto = null;
    if (req.files && req.files.purchesBillPhoto) {
      purchesBillPhoto = `/images/${req.files.purchesBillPhoto[0].filename}`;
    }

    let result = await CanteenInventoryPurches.updateOne(
      { _id: req.params.id },
      {
        $set: {
          productName: req.body.productName,
          quantity: req.body.quantity,
          price: req.body.price,
          date: req.body.date,
          purchesBillPhoto: purchesBillPhoto,
        },
      }
    );
    // res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
    return sendResponse(
      res,
      createResponse(
        statusCodes.OK,
        canteenInventoryPurchesMessages.UPDATE,
        result
      )
    );
  } catch (error) {
    console.log("Found Error While Update", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.NOT_FOUND,
        canteenInventoryPurchesMessages.NOT_FOUND
      )
    );
  }
};

const deleteData = async (req, res) => {
  try {
    let result = await CanteenInventoryPurches.findById({ _id: req.params.id });

    if (!result) {
      return sendResponse(
        res,
        createResponse(
          statusCodes.NOT_FOUND,
          canteenInventoryPurchesMessages.NOT_FOUND
        )
      );
    } else {
      await CanteenInventoryPurches.findByIdAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );

      return sendResponse(
        res,
        createResponse(statusCodes.OK, canteenInventoryPurchesMessages.DELETE)
      );
    }
  } catch (error) {
    console.log("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.NOT_FOUND,
        canteenInventoryPurchesMessages.NOT_FOUND
      )
    );
  }
};

export default { add, index, view, edit, deleteData };
