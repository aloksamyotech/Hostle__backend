import express from "express";
import roomTypes from "../controllers/roomTypes.js";
const router = express.Router();

router.post("/add/:id", roomTypes.add);
router.get("/getall/:id", roomTypes.getAll);
router.put("/update/:id", roomTypes.update);
router.delete("/delete/:id", roomTypes.deleteData);



export default router;
