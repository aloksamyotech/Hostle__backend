import express from "express";
const router = express.Router();
import studentPayment from "../controllers/studentPayment.js";
import { PaymentImg } from "../utils/upload.js";

router.post('/add/:id',PaymentImg, studentPayment.add);
router.get('/list/:id',studentPayment.index);
router.get('/paymenthistory/:id',studentPayment.view);




export default router;