import express from "express";
const router = express.Router();
import studentPayment from "../controllers/studentPayment.js";
import { PaymentImg } from "../utils/upload.js";

router.post('/add/:id', studentPayment.add);
router.get('/list/:id',studentPayment.index);
router.get('/paymenthistory/:id',studentPayment.view);
router.get('/getRemaningData/:id', studentPayment.getStudentData);
router.get('/paymentDataById/:id', studentPayment.paymentDataById);





export default router;