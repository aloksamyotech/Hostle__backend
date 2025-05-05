import express from 'express'
import room from '../controllers/room.js'
import { RoomImage } from '../utils/upload.js';
const router = express.Router();
import auth from '../middlewares/auth.js'
import fileHandler from '../middlewares/filehandler.js';

router.post('/add/:id', fileHandler(), room.add); 
router.get('/index/:id',room.index);
router.get('/view/:id', room.view);
router.put('/edit/:id', fileHandler(), room.edit);
router.delete('/deleteData/:id',  room.deleteData);


router.get('/alRooms',room.countRooms);
router.get('/calculate-beds', room.calculateBeds);

router.get("/get_roomdata/:hostelId/:roomId",room.roomData); 
export default router;