import Expenditure from "../model/Expenditures.js";
import Hostel from "../model/Hostel.js";
import User from "../model/User.js";
import messages from "../constants/message.js";
import Expenditures from "../model/Expenditures.js";
import { statusCodes } from "../core/constant.js";
import { commonMessage, expenditureMessages } from "../core/messages.js";
import { createResponse, sendResponse } from "../helper/ResponseHelper.js";

const add = async (req, res) => {
  try {
    const { expenseTitle, price, date } = req.body;
    const dateObj = new Date(date);
    const monthNamee = dateObj.toLocaleString("default", { month: "long" });
    const [day, month, year] = date.split("-");

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthName = monthNames[parseInt(month, 10) - 1];

    let billPhoto = null;
    if (req.files && req.files.billPhoto) {
      billPhoto = `/images/${req.files.billPhoto[0].filename}`;
    }

    const newExpense = new Expenditure({
      expenseTitle,
      price,
      date,
      monthName,
      billPhoto,
      createdBy: req.params.id,
    });
    await newExpense.save();

    return sendResponse(
      res,
      createResponse(statusCodes.CREATED, expenditureMessages.ADD)
    );
  } catch (error) {
    console.log("Error Found While Add Data", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.BAD_REQ,
        canteenInventoryConsumeMessages.INVALID_CONSUME_QUANTITY
      )
    );
  }
};

const index = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = {
      createdBy: req.params.id,
      deleted: false,
    };

    if (startDate) {
      filter.date = { $gte: new Date(startDate) };
    }
    if (endDate) {
      if (!filter.date) {
        filter.date = {};
      }
      filter.date.$lte = new Date(endDate);
    }

    const result = await Expenditure.find(filter);

    const total_recodes = await Expenditure.countDocuments(filter);
    // res.status(200).send({
    //   result,
    //   totalRecodes: total_recodes,
    //   message: messages.DATA_FOUND_SUCCESS,
    // });

    return sendResponse(
      res,
      createResponse(statusCodes.OK, commonMessage.SUCCESS, result)
    );
  } catch (error) {
    console.log("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.BAD_REQ,
        canteenInventoryConsumeMessages.INVALID_CONSUME_QUANTITY
      )
    );
  }
};

const monthlyExpenses = async (req, res) => {
  try {
    // Fetch all expenditures created by the specified user
    const adminData = await Expenditure.find({ createdBy: req.params.id });

    // Initialize an object to store total expenses for each month
    let monthlyExpenses = {
      January: 0,
      February: 0,
      March: 0,
      April: 0,
      May: 0,
      June: 0,
      July: 0,
      August: 0,
      September: 0,
      October: 0,
      November: 0,
      December: 0,
    };

    // Iterate through each expenditure document
    for (let expenditure of adminData) {
      const month = expenditure.monthName;
      const amount = expenditure.price;

      // Add the amount to the corresponding month's total
      if (monthlyExpenses.hasOwnProperty(month)) {
        monthlyExpenses[month] += amount;
      }
    }

    // Respond with the aggregated monthly expenses object
    res.status(200).json({ monthlyExpenses });
  } catch (error) {
    console.log("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.BAD_REQ,
        canteenInventoryConsumeMessages.INVALID_CONSUME_QUANTITY
      )
    );
  }
};

const edit = async (req, res) => {
  try {
    const dateObj = new Date(req.body.date);
    const monthNamee = dateObj.toLocaleString("default", { month: "long" });

    const [day, month, year] = req.body.date.split("-");

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const monthName = monthNames[parseInt(month, 10) - 1];

    // Fetch existing document to get the current billPhoto
    const existingDoc = await Expenditure.findById(req.params.id);
    if (!existingDoc) {
      return sendResponse(
        res,
        createResponse(statusCodes.NOT_FOUND, expenditureMessages.NOT_FOUND)
      );
    }

    let billPhoto = existingDoc.billPhoto;
    if (req.files && req.files.billPhoto) {
      billPhoto = `/images/${req.files.billPhoto[0].filename}`;
    }

    const result = await Expenditure.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          expenseTitle: req.body.expenseTitle,
          price: req.body.price,
          date: req.body.date,
          monthName,
          billPhoto,
        },
      },
      { new: true }
    );

    return sendResponse(
      res,
      createResponse(statusCodes.OK, expenditureMessages.UPDATE, result)
    );
  } catch (error) {
    console.log("Found Error While Update", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.BAD_REQ,
        canteenInventoryConsumeMessages.INVALID_CONSUME_QUANTITY
      )
    );
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await Expenditure.findById({ _id: req.params.id });
    if (!result) {
      return sendResponse(
        res,
        createResponse(statusCodes.NOT_FOUND, expenditureMessages.NOT_FOUND)
      );
    } else {
      await Expenditure.findOneAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );

      return sendResponse(
        res,
        createResponse(statusCodes.OK, expenditureMessages.DELETE)
      );
    }
  } catch (error) {
    console.log("Error =>", error);
    return sendResponse(
      res,
      createResponse(
        statusCodes.BAD_REQ,
        canteenInventoryConsumeMessages.INVALID_CONSUME_QUANTITY
      )
    );
  }
};

export default { add, index, monthlyExpenses, edit, deleteData };
