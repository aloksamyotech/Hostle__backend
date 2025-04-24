import express from 'express';
const router = express.Router();
import canteeninventorypurches from '../controllers/canteenInventoryPurches.js'

router.post('/add/:id',canteeninventorypurches.add);
router.get('/index/:id',canteeninventorypurches.index);
router.get('/view/:id',canteeninventorypurches.view);
router.put('/edit/:id',canteeninventorypurches.edit);
router.delete('/delete/:id',canteeninventorypurches.deleteData);

export default router;