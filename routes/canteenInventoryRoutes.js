import express from 'express';
const router = express.Router();
import canteeninventory from '../controllers/canteenInventory.js'

router.post('/add/:id', canteeninventory.add);
router.get('/index/:id',canteeninventory.index);
router.get('/view/:id',canteeninventory.view);
router.put('/edit/:id',canteeninventory.edit);
router.delete('/delete/:id',canteeninventory.deleteData);

router.post('/importFile/:id',canteeninventory.importFileData);


export default router;