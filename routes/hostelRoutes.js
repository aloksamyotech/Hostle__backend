import express from "express";
import hostel from "../controllers/hostel.js";
import fileHandler from "../middlewares/filehandler.js";
const router = express.Router();

import combinedUpload from "../utils/upload.js";

router.post("/addnew", fileHandler(), hostel.addNew);
router.get("/list", hostel.index);
router.get("/view/:id", hostel.view);
router.put("/edit/:id", fileHandler(), hostel.edit);
router.delete("/delete/:id", hostel.deleteData);
router.get("/availablebeds/:id", hostel.bedsCount);
router.post("/change_password", hostel.changePassword);

export default router;
