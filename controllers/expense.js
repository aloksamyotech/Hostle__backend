import Expenditure from "../model/Expenditures.js";
import Hostel from "../model/Hostel.js";
import User from "../model/User.js";
import messages from "../constants/message.js";
import Expenditures from "../model/Expenditures.js";

const add = async (req, res) => {
  console.log("In Expenditures Controller..");
  console.log("Id =>", req.params.id);
  console.log("Data =>", req.body);
  console.log("Bill Img =>", req.file);
  try {
    console.log("in try");
    const { expenseTitle, price, date } = req.body;

    const dateObj = new Date(date);
    const monthNamee = dateObj.toLocaleString("default", { month: "long" });
    console.log("monthNamee==>", monthNamee);

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
    console.log("monthName==>", monthName);

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

    console.log("newExpense =>", newExpense);
    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error Found While Add Data", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const index = async (req, res) => {
  console.log("In Expenditures Controller..");
  console.log("Id =>", req.params.id);
  console.log("Query Parameters =>", req.query);

  try {
    const { startDate, endDate } = req.query;
    const filter = {
      createdBy: req.params.id,
      deleted: false,
    };

    if (startDate) {
      filter.date = { $gte: new Date(startDate) };
      console.log("filter.date=========>", filter.date);
    }
    if (endDate) {
      if (!filter.date) {
        filter.date = {};
      }
      filter.date.$lte = new Date(endDate);
      console.log("filter.date.$lte =========>", filter.date.$lte);
    }

    const result = await Expenditure.find(filter);
    console.log("result =>", result);

    const total_recodes = await Expenditure.countDocuments(filter);
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

const monthlyExpenses = async (req, res) => {
  try {
    console.log("In monthlyExpenses... Id=>,", req.params.id);

    // Fetch all expenditures created by the specified user
    const adminData = await Expenditure.find({ createdBy: req.params.id });
    console.log("adminData =>", adminData);

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
      console.log("month==>", month, "amount==>", amount);

      // Add the amount to the corresponding month's total
      if (monthlyExpenses.hasOwnProperty(month)) {
        monthlyExpenses[month] += amount;
      }
    }
    console.log("monthlyExpenses====>", monthlyExpenses);

    // Respond with the aggregated monthly expenses object
    res.status(200).json({ monthlyExpenses });
  } catch (error) {
    console.log("Error =>", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

// const edit = async (req, res) =>{
//     console.log("edit expense Id=>", req.params.id);
//     console.log("edit file Data =>", req.file);
//     try{

//         const dateObj = new Date(req.body.date);
//         const monthNamee = dateObj.toLocaleString('default', { month: 'long' });
//         console.log("monthNamee==>",monthNamee);

//         // Parse the month from the dd-mm-yyyy format date string
//         const [day, month, year] = req.body.date.split('-');

//         // Map month number to month name
//         const monthNames = ["January", "February", "March", "April", "May", "June",
//                             "July", "August", "September", "October", "November", "December"];

//         const monthName = monthNames[parseInt(month, 10) - 1];
//         console.log("monthName==>", monthName);

//         let  result = await Expenditure.findByIdAndUpdate(
//             {
//                 _id : req.params.id
//             },
//             {
//                 $set : {
//                     expenseTitle : req.body.expenseTitle,
//                     price : req.body.price,
//                     date : req.body.date,
//                     monthName,
//                     billPhoto : req.file.filename,
//                 }
//             }

//         );

//         res.status(200).json({result, message : messages.DATA_UPDATED_SUCCESS});
//     }catch(error){
//         console.log("Found Error While Update", error);
//         res.status(400).json({message : messages.DATA_UPDATED_FAILED});
//     }
// }

const edit = async (req, res) => {
  console.log("edit expense Id=>", req.params.id);
  console.log("edit file Data =>", req.file);

  try {
    const dateObj = new Date(req.body.date);
    const monthNamee = dateObj.toLocaleString("default", { month: "long" });
    console.log("monthNamee==>", monthNamee);

    // Parse the month from the dd-mm-yyyy format date string
    const [day, month, year] = req.body.date.split("-");

    // Map month number to month name
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
    console.log("monthName==>", monthName);

    // Fetch existing document to get the current billPhoto
    const existingDoc = await Expenditure.findById(req.params.id);
    if (!existingDoc) {
      return res.status(404).json({ message: "Expense not found" });
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
      { new: true } // Return the updated document
    );

    console.log("edit result ===>", result);

    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    console.log("Found Error While Update", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  try {
    console.log("In deleteData Id:", req.params.id);

    const result = await Expenditure.findById({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await Expenditure.findOneAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );
      console.log("Expense deleted successfully !!");
      res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};

export default { add, index, monthlyExpenses, edit, deleteData };
