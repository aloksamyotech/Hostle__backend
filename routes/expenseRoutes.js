import express from 'express';
const router = express.Router();
import expense from '../controllers/expense.js';
import { ExpenseBillImg } from '../utils/upload.js';

router.post('/add/:id', ExpenseBillImg, expense.add);
router.get('/index/:id',expense.index);
router.put('/edit/:id', ExpenseBillImg, expense.edit);
router.delete('/delete/:id',expense.deleteData);
router.get('/allexpenses/:id',expense.monthlyExpenses);






export default router;