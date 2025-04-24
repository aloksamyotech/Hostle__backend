import express from "express";
import administrator from "../controllers/administrator.js";
const  router = express.Router();
import { Image } from "../utils/upload.js";
import auth from "../middlewares/auth.js";

//not in use.....
router.post('/add',Image, administrator.add);
router.get('/list',administrator.index);
router.get('/view/:id',administrator.view);
router.put('/edit/:id',Image,administrator.edit);
router.delete('/delete/:id',administrator.deleteData);



router.post('/login',administrator.login);



export default router;