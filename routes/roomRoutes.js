import express from 'express'
import room from '../controllers/room.js'
import { RoomImage } from '../utils/upload.js';
const router = express.Router();
import auth from '../middlewares/auth.js'

router.post('/add/:id', RoomImage, room.add); 
router.get('/index/:id',room.index);
router.get('/view/:id', room.view);
router.put('/edit/:id', RoomImage,room.edit);
router.delete('/deleteData/:id',  room.deleteData);


router.get('/alRooms',room.countRooms);
router.get('/calculate-beds', room.calculateBeds);

router.get("/get_roomdata/:hostelId/:roomId",room.roomData); 
export default router;