import express from "express";
import studentrev from '../controllers/reservationstudent.js';
import auth from "../middlewares/auth.js";
import { uploadStudent } from "../utils/upload.js";


const router = express.Router();

router.post('/add/:id', uploadStudent, studentrev.add);
router.get('/index/:id',studentrev.index);
router.get('/view/:id', studentrev.view);
router.put('/edit/:id', uploadStudent, studentrev.edit);
router.delete('/deleteData/:id', studentrev.deleteData);

router.put('/updateStatus/:id', studentrev.updateStatus);








export default router;