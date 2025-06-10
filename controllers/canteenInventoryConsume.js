import CanteenInventoryConsume from "../model/CanteenInventoryConsume.js";
import Hostel from "../model/Hostel.js";
import CanteenInventoryPurches from "../model/CanteenInventoryPurches.js";
import User from "../model/User.js";
import messages from "../constants/message.js";
import CanteenInventory from "../model/CanteenInventory.js";
import { statusCodes } from "../core/constant.js";
import {
  commonMessage,
  canteenInventoryConsumeMessages,
} from "../core/messages.js";
import { createResponse, sendResponse } from "../helper/ResponseHelper.js";

const add = async (req, res) => {
  let remaning = 0;

  try {
    const { productName, quantity, date } = req.body;

    let data = await CanteenInventory.findOne({ productName: productName });

    let latestConsume = await CanteenInventoryConsume.findOne({
      productName,
      createdBy: req.params.id,
      deleted: false,
    }).sort({ date: -1 });
 

    let purchaseData = await CanteenInventoryPurches.findOne({
      productName,
      createdBy: req.params.id,
    });
    if (!purchaseData) {
      return sendResponse(
        res,
        createResponse(
          statusCodes.NOT_FOUND,
          canteenInventoryConsumeMessages.NOT_FOUND
        )
      );
    }

    if (!latestConsume) {
      remaning = purchaseData.quantity - Number(quantity);
    } else {
      remaning = latestConsume.remaning - Number(quantity);
    }

    const purchaseQuantity = purchaseData.quantity;


    //check if consume quantity is more than purchase and remaning quantity..
    if (Number(quantity) > purchaseQuantity || remaning < 0) {
      // return res.status(205).json({
      //   message:
      //     "Consume quantity cannot be greater than remaining or purchase quantity.",
      // });

      return sendResponse(
        res,
        createResponse(
          statusCodes.BAD_REQ,
          canteenInventoryConsumeMessages.INVALID_CONSUME_QUANTITY
        )
      );
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

    return sendResponse(
      res,
      createResponse(statusCodes.CREATED, canteenInventoryConsumeMessages.ADD)
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
    let result = await CanteenInventoryConsume.find({
      createdBy: req.params.id,
      deleted: false,
    }).populate("productId", "mesurment");

    let total_recodes = await CanteenInventoryConsume.countDocuments({
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
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const view = async (req, res) => {


  let result = await CanteenInventoryConsume.findById({ _id: req.params.id });

  if (!result) {
    return res.status(404).json({ message: "Product is not Found.." });
  }
  res.status(200).json(result);
};

const edit = async (req, res) => {

  const { productName, quantity, date } = req.body;

  const currentEntry = await CanteenInventoryConsume.findById(req.params.id);

  const previousEntry = await CanteenInventoryConsume.findOne({
    productId: currentEntry.productId,
    createdAt: { $lt: currentEntry.createdAt },
    deleted: false,
  }).sort({ createdAt: -1 }); // Sort descending to get the most recent before the current one

  if (previousEntry) {
    if (quantity > previousEntry.remaning) {
      return sendResponse(
        res,
        createResponse(
          statusCodes.BAD_REQ,
          canteenInventoryConsumeMessages.INVALID_CONSUME_QUANTITY1
        )
      );
    } else {
      let remaning = previousEntry.remaning - Number(quantity);

      const updatedEntry = await CanteenInventoryConsume.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            quantity: quantity,
            remaning: remaning,
            date: date,
          },
        },
        { new: true }
      );

      return sendResponse(
        res,
        createResponse(statusCodes.OK, canteenInventoryConsumeMessages.UPDATE)
      );
    }
  } else {
    let purchaseData = await CanteenInventoryPurches.findOne({
      productName: productName,
      createdBy: currentEntry.createdBy,
    });
 

    const purchaseQuantity = purchaseData.quantity;


    if (Number(quantity) > purchaseQuantity) {
      return sendResponse(
        res,
        createResponse(
          statusCodes.BAD_REQ,
          canteenInventoryConsumeMessages.INVALID_CONSUME_QUANTITY
        )
      );
    }

    let remaning = purchaseQuantity - Number(quantity);
  

    const updatedEntry = await CanteenInventoryConsume.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          quantity: quantity,
          remaning: remaning,
          date: date,
        },
      },
      { new: true }
    );

    return sendResponse(
      res,
      createResponse(statusCodes.OK, canteenInventoryConsumeMessages.UPDATE)
    );
  }
};

const deleteData = async (req, res) => {
  try {
    let result = await CanteenInventoryConsume.findById({ _id: req.params.id });
    if (!result) {
      return sendResponse(
        res,
        createResponse(
          statusCodes.NOT_FOUND,
          canteenInventoryConsumeMessages.NOT_FOUND
        )
      );
    } else {
      await CanteenInventoryConsume.findByIdAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );

      return sendResponse(
        res,
        createResponse(statusCodes.OK, canteenInventoryConsumeMessages.DELETE)
      );
    }
  } catch (error) {
    console.log("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

export default { add, index, view, edit, deleteData };
