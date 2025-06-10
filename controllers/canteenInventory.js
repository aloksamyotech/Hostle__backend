import CanteenInventory from "../model/CanteenInventory.js";
import messages from "../constants/message.js";
import User from "../model/User.js";
import { statusCodes } from "../core/constant.js";
import {
  commonMessage,
  canteenInventoryMessages,
  canteenInventoryConsumeMessages,
} from "../core/messages.js";
import { createResponse, sendResponse } from "../helper/ResponseHelper.js";
import CanteenInventoryConsume from "../model/CanteenInventoryConsume.js";
import CanteenInventoryPurches from "../model/CanteenInventoryPurches.js";

const add = async (req, res) => {
  try {
    const id = req.params.id;
    const { productName, mesurment } = req.body;

    const alreadyExist = await CanteenInventory.findOne({
      productName: productName,
    });

    if (alreadyExist) {
      return sendResponse(
        res,
        createResponse(statusCodes.CONFLICT, canteenInventoryMessages.EXIST)
      );
    }

    const newInventory = new CanteenInventory({
      productName,
      mesurment,
      createdBy: req.params.id,
    });
    await newInventory.save();

    return sendResponse(
      res,
      createResponse(statusCodes.CREATED, canteenInventoryMessages.ADD)
    );
  } catch (error) {
    console.error("Error", error);
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
    let result = await CanteenInventory.find({
      createdBy: req.params.id,
      deleted: false,
    });

    let total_recodes = await CanteenInventory.countDocuments({
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
  let result = await CanteenInventory.findById({ _id: req.params.id });

  if (!result) {
    return sendResponse(
      res,
      createResponse(statusCodes.NOT_FOUND, commonMessage.NOT_FOUND)
    );
  }
  return sendResponse(
    res,
    createResponse(statusCodes.OK, commonMessage.SUCCESS)
  );
};

const edit = async (req, res) => {
  try {
    let result = await CanteenInventory.updateOne(
      { _id: req.params.id },
      {
        $set: {
          productName: req.body.productName,
          mesurment: req.body.mesurment,
        },
      }
    );
    return sendResponse(
      res,
      createResponse(statusCodes.OK, canteenInventoryMessages.UPDATE)
    );
  } catch (error) {
    console.log("Found Error While Update", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.INTERNAL_SERVER_ERROR,
        messages.INTERNAL_SERVER_ERROR
      )
    );
  }
};

const deleteData = async (req, res) => {


  try {
    let result = await CanteenInventory.findById({ _id: req.params.id });

    if (!result) {
      return sendResponse(
        res,
        createResponse(statusCodes.NOT_FOUND, commonMessage.NOT_FOUND)
      );
    } else {
      await CanteenInventory.findByIdAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );
      return sendResponse(
        res,
        createResponse(statusCodes.OK, canteenInventoryMessages.DELETE)
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

const importFileData = async (req, res) => {
  const items = req.body;

  if (!items || !Array.isArray(items)) {
    return res.status(400).send({ message: "Invalid data format" });
  }

  try {
 

    const normalizedItems = items.map((item) => ({
      productName: item["productName"],
      mesurment: item["mesurment"],
      createdBy: req.params.id,
    }));

 
    await CanteenInventory.insertMany(normalizedItems);
    res.status(200).send({ message: "Inventory items imported successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Failed to import items" });
  }
};

const inventoryReport = async (req, res) => {
  try {
    const inventoryItems = await CanteenInventory.find({ deleted: false });

    const inventoryData = await Promise.all(
      inventoryItems.map(async (item) => {
        const { _id, productName } = item;

        const purchasedAgg = await CanteenInventoryPurches.aggregate([
          { $match: { productId: _id, deleted: false } },
          {
            $group: {
              _id: null,
              totalPurchased: { $sum: "$quantity" },
            },
          },
        ]);

        // Step 3: Calculate total consumed quantity for the product
        const consumedAgg = await CanteenInventoryConsume.aggregate([
          { $match: { productId: _id, deleted: false } },
          {
            $group: {
              _id: null,
              totalConsumed: { $sum: "$quantity" },
            },
          },
        ]);

        const purchased = purchasedAgg[0]?.totalPurchased || 0;
        const consumed = consumedAgg[0]?.totalConsumed || 0;
        const remaining = purchased - consumed;

        return {
          productName,
          purchased,
          consumed,
          remaining,
        };
      })
    );

 

    res.status(200).send({
      inventoryData,
      message: "Generating Inventory Summary successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error generating inventory summary" });
  }
};

export default {
  add,
  index,
  view,
  edit,
  deleteData,
  importFileData,
  inventoryReport,
};
