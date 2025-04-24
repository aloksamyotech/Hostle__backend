import express from 'express';
const router = express.Router();
import noticeboard from '../controllers/noticeboard.js';

router.post('/add/:id',noticeboard.add);
router.get('/index/:id',noticeboard.index);
router.get('/view/:id',noticeboard.view);
router.put('/edit/:id',noticeboard.edit);
router.delete('/delete/:id',noticeboard.deleteData);


export default router;

