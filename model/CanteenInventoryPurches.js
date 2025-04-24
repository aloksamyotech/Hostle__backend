import mongoose from "mongoose";
import Hostel from "./Hostel.js";

const CanteenInventoryPurchesSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: "CanteenInventory",
    require: true,
  },
  productName: { type: String, require: true },
  quantity: { type: Number, require: true },
  price: { type: String, require: true },
  date: { type: Date, require: true },
  deleted: { type: Boolean, default: false },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: Hostel,
  },
});
export default mongoose.model(
  "CanteenInventoryPurches",
  CanteenInventoryPurchesSchema
);
