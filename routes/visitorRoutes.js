import express from 'express';
const router = express.Router();
import visitor from '../controllers/visitor.js'
import auth from '../middlewares/auth.js';
import Visitor from '../model/Visitor.js';

router.post('/add/:id',  visitor.add);
router.get('/index/:id',  visitor.index);
router.get('/list/:id',  visitor.list);



export default router;