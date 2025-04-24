import express from 'express';
const router = express.Router();
import canteeninventoryconsume from '../controllers/canteenInventoryConsume.js'

router.post('/add/:id',canteeninventoryconsume.add);
router.get('/index/:id',canteeninventoryconsume.index);
router.get('/view/:id',canteeninventoryconsume.view);
router.put('/edit/:id',canteeninventoryconsume.edit);
router.delete('/delete/:id',canteeninventoryconsume.deleteData);

export default router;