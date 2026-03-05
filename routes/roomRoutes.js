import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getKategoriRoom } from '../controller/Room/getCategoryRoom.js';
import { getMeetingRoom } from '../controller/Room/getMeetingRoom.js';
import { getCarouselRoom } from '../controller/Room/getCarouselRoom.js';
import { findMeetingRoomById } from '../controller/Room/findMeetingRoomById.js';
import { getScheduleRoom } from '../controller/Room/getScheduleRoom.js';
import { manageMasterRoom } from '../controller/Room/manageMasterRoom.js';
import { getMeetingMasterStandard } from '../controller/Room/getMeetingMasterStandard.js';
import { getMeetingStandard } from '../controller/Room/getMeetingStandard.js';
import { manageStandardRoom } from '../controller/Room/manageStandardRoom.js';
import { findMeetingStandardByIdRoom } from '../controller/Room/findMeetingStandardByIdRoom.js';
import { findMasterMeetingStandardByKat } from '../controller/Room/findMasterMeetingStandardByKat.js';
import { findMeetingStandardByKat } from '../controller/Room/findMeetingStandardByKat.js';
import { manageRequestRoom } from '../controller/Room/manageRequestRoom.js';
import { manageMasterStandard } from '../controller/Room/manageMasterStandard.js';
import { getMasterMeetingRoom } from '../controller/Room/getMasterMeetingRoom.js';

const roomRoutes = express.Router();

roomRoutes.post('/getKategoriRoom', verifyToken, getKategoriRoom);
roomRoutes.post('/getMeetingRoom', verifyToken, getMeetingRoom);
roomRoutes.post('/getMasterMeetingRoom', verifyToken, getMasterMeetingRoom);
roomRoutes.post('/findMeetingRoomById', verifyToken, findMeetingRoomById);
roomRoutes.post('/getCarouselRoom', verifyToken, getCarouselRoom);
roomRoutes.post('/getScheduleRoom', verifyToken, getScheduleRoom);
roomRoutes.post('/manageMasterRoom', verifyToken, manageMasterRoom);
roomRoutes.post('/getMeetingMasterStandard', verifyToken, getMeetingMasterStandard);
roomRoutes.post('/manageMasterStandard', verifyToken, manageMasterStandard);
roomRoutes.post('/getMeetingStandard', verifyToken, getMeetingStandard);
roomRoutes.post('/findMeetingStandardByIdRoom', verifyToken, findMeetingStandardByIdRoom);
roomRoutes.post('/findMasterMeetingStandardByKat', verifyToken, findMasterMeetingStandardByKat);
roomRoutes.post('/findMeetingStandardByKat', verifyToken, findMeetingStandardByKat);
roomRoutes.post('/manageStandardRoom', verifyToken, manageStandardRoom);
roomRoutes.post('/manageRequestRoom', verifyToken, manageRequestRoom);

export default roomRoutes;