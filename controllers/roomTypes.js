import RoomType from "../model/RoomType.js";
import messages from "../constants/message.js";

const add = async (req, res) => {
  const id = req.params.id;

  const roomType = req.body.roomType.toLowerCase();
  const roomCategory = req.body.roomCategory;

  try {
    const existingRoom = await RoomType.findOne({
      roomType,
      roomCategory,
      createdBy: id,
    });

    if (existingRoom) {
      return res.status(400).json({
        message: "This room type and category combination already exists.",
      });
    }

    const newRoomType = new RoomType({
      roomType,
      roomCategory,
      createdBy: id,
    });

    await newRoomType.save();
    res.status(201).json({ message: messages.DATA_SUBMITED_SUCCESS });
  } catch (error) {
    console.log("Error Found While add rooms type", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const getAll = async (req, res) => {
  const id = req.params.id;

  try {
    const result = await RoomType.find({ createdBy: id, deleted: false });
    res.status(200).send({
      result,
      message: messages.DATA_FOUND_SUCCESS,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR });
  }
};

const update = async (req, res) => {
  console.log("req.params.id : ", req.params.id);

  console.log("req.body :", req.body);

  try {
    let result = await RoomType.updateOne(
      { _id: req.params.id },
      {
        $set: {
          roomType: req.body.roomType,
          roomCategory: req.body.roomCategory,
        },
      }
    );
    res.status(200).json({ result, message: messages.DATA_UPDATED_SUCCESS });
  } catch (error) {
    console.log("Found Error While Update", error);
    res.status(400).json({ message: messages.DATA_UPDATED_FAILED });
  }
};

const deleteData = async (req, res) => {
  try {
    const result = await RoomType.findById({ _id: req.params.id });
    if (!result) {
      return res.status(404).json({ message: messages.DATA_NOT_FOUND_ERROR });
    } else {
      await RoomType.findByIdAndUpdate(
        { _id: req.params.id },
        { deleted: true }
      );
      res.status(200).json({ message: messages.DATA_DELETE_SUCCESS });
    }
  } catch (error) {
    console.log("Error =>", error);
    res.status(400).json({ message: messages.DATA_DELETE_FAILED });
  }
};
export default { add, getAll, update, deleteData };
