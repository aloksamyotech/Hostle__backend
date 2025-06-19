import express from "express";
import studentrev from "../controllers/reservationstudent.js";
import auth from "../middlewares/auth.js";
import { uploadStudent } from "../utils/upload.js";
import fileHandler from "../middlewares/filehandler.js";

const router = express.Router();

router.post("/add/:id", uploadStudent, studentrev.add);
router.get("/index/:id", studentrev.index);
router.get("/view/:id", studentrev.view);
router.put("/edit/:id", fileHandler(), studentrev.edit);
router.delete("/deleteData/:id", studentrev.deleteData);
router.put("/updateStatus/:id", studentrev.updateStatus);

router.post("/assignBed/:id", fileHandler(), studentrev.assignBed);
router.get("/getAllReservedStudents/:id", studentrev.allReservedStudents);
router.get("/getStudent/:id", studentrev.getStudent);
router.put("/update/:id/:hostelId", studentrev.editAssignBed);
router.put("/change_status/:id", studentrev.activeDeactiveUser);
router.get("/getStudentByContact/:contact", studentrev.getStudentByContact);
router.get("/get-students/:id", studentrev.getStudentsData);

export default router;
