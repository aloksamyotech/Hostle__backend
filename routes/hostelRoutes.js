import express from 'express';
import hostel from '../controllers/hostel.js';
const router = express.Router();

import combinedUpload from '../utils/upload.js';

router.post('/addnew',combinedUpload,hostel.addNew);
router.get('/list',hostel.index);
router.get('/view/:id',hostel.view);
router.put('/edit/:id',combinedUpload,hostel.edit);
router.delete('/delete/:id',hostel.deleteData);
router.get('/availablebeds/:id',hostel.bedsCount);

export default router; 