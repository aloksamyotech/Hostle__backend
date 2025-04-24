import express from 'express'
const router = express.Router();
import studentcomplaint from '../controllers/studentcomplaint.js';
import auth from '../middlewares/auth.js';

router.post('/add/:id', studentcomplaint.add);
router.get('/index/:id', studentcomplaint.index);
router.get('/view/:id',  studentcomplaint.view);
router.put('/edit/:id', studentcomplaint.edit);
router.delete('/deleteData/:id', studentcomplaint.deleteData);

router.get('/allComplaints/:id',studentcomplaint.allComplaints);
export default router;