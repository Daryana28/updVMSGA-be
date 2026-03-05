import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getMasterPark } from '../controller/Park/getMasterPark.js';
import { getParkListById } from '../controller/Park/getParkListById.js';
import { setMasterPark } from '../controller/Park/setMasterPark.js';
const parkRoutes = express.Router();

parkRoutes.post('/getMasterPark', verifyToken, getMasterPark);
parkRoutes.post('/getParkListById', verifyToken, getParkListById);
parkRoutes.post('/setMasterPark', verifyToken, setMasterPark);

export default parkRoutes;
