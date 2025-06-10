import express from 'express';
const router = express.Router();
import canteeninventorypurches from '../controllers/canteenInventoryPurches.js'
import fileHandler from '../middlewares/filehandler.js';

router.post('/add/:id', fileHandler(), canteeninventorypurches.add);
router.get('/index/:id',canteeninventorypurches.index);
router.get('/view/:id',canteeninventorypurches.view);
router.put('/edit/:id', fileHandler(), canteeninventorypurches.edit);
router.delete('/delete/:id',canteeninventorypurches.deleteData);

export default router;