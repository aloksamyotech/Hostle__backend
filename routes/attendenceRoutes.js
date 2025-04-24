import express from 'express';
const router = express.Router();
import attendence from '../controllers/attendence.js';


router.post('/add',attendence.add);
router.put('/edit/:id/:date',attendence.edit);

export default router;