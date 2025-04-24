import express from "express";
import student from "../controllers/student.js";
const router = express.Router();
import { Image } from "../utils/upload.js";

import auth from "../middlewares/auth.js";

router.post('/add/:adminId', Image, student.add);
router.get('/list/:id', student.index);
router.get('/view/:id', student.view);
router.put('/edit/:id', Image, student.edit);
router.delete('/delete/:id',  student.deleteData);

router.get('/allStudentCount',student.countStudent);

export default router;