import WeeklyFoodMenu from "../model/WeeklyFoodMenu.js";
import messages from "../constants/message.js";
import User from "../model/User.js";

const add = async (req, res) => {
  try {
    const { weekdays, foodType, foodDescription } = req.body;
    const createdBy = req.params.id;

    const today = new Date().toISOString().split("T")[0];
    console.log("today =>", today);

    const existing = await WeeklyFoodMenu.findOne({
      weekdays,
      foodType,
      createdBy,
      deleted: false,
      // $expr: {
      //   $eq: [
      //     { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
      //     today,
      //   ],
      // },
    });

    console.log("existing ===>", existing);

    const date = existing?.createdAt?.toISOString().split("T")[0];
    console.log("date ===>", date);

    if (today === date) {
      return res.status(400).json({
        message: "You have already added this combination today.",
      });
    } else {
      const newFoodMenu = new WeeklyFoodMenu({
        weekdays,
        foodType,
        foodDescription,
        createdBy,
      });
      await newFoodMenu.save();

      res.status(201).json({
        message: "Food menu added successfully.",
        data: newFoodMenu,
      });
    }
  } catch (error) {
    console.error("Error adding food menu:", error);
    res.status(500).json({ message: "Internal server error." });
  }
};

const index = async (req, res) => {
  console.log("In WeeklyFoodMenu Controller..");
  console.log("Id =>", req.params.id);

  try {
    let result = await WeeklyFoodMenu.find({
      createdBy: req.params.id,
      deleted: false,
    });
    console.log("result==>", result);

    let total_recodes = await WeeklyFoodMenu.countDocuments({
      createdBy: req.params.id,
      deleted: false,
    });
    console.log("total_recodes==>", total_recodes);

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

const edit = async (req, res) => {
  console.log("req.params =>", req.params.id);
  console.log("req.body =>", req.body);
  try {
    let result = await WeeklyFoodMenu.updateOne(
      { _id: req.params.id },
      {
        $set: {
          weekdays: req.body.weekdays,
          foodType: req.body.foodType,
          foodDescription: req.body.foodDescription,
        },
      }
    );

    console.log("edit result =>", result);
    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  try {
    console.log("Id:", req.params.id);
    const result = await WeeklyFoodMenu.findById({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await WeeklyFoodMenu.findByIdAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );
      console.log("Data deleted successfully !!");
      res.json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    res.status(404).json({ message: messages.DATA_DELETE_FAILED, error });
  }
};

export default { add, index, edit, deleteData };
