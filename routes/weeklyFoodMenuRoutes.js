import express from 'express';
const router = express.Router();
import weeklyfoodmenu from '../controllers/weeklyfood.js'; 

router.post('/add/:id',weeklyfoodmenu.add);
router.get('/index/:id',weeklyfoodmenu.index);
router.put('/edit/:id',weeklyfoodmenu.edit);
router.delete('/delete/:id',weeklyfoodmenu.deleteData);


export default router;