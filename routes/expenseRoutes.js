import express from 'express';
const router = express.Router();
import expense from '../controllers/expense.js';
import { ExpenseBillImg } from '../utils/upload.js';
import fileHandler from '../middlewares/filehandler.js';

router.post('/add/:id', fileHandler(), expense.add);
router.get('/index/:id',expense.index);
router.put('/edit/:id', fileHandler(), expense.edit);
router.delete('/delete/:id',expense.deleteData);
router.get('/allexpenses/:id',expense.monthlyExpenses);






export default router;