// routes/timeRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getMasterTime } from '../controller/time/getMasterTime.js';
import { getRoomAvail } from '../controller/Room/getRoomAvail.js';
import { cacheMiddleware } from '../middleware/cache.js';

const timeRoutes = express.Router();

timeRoutes.post('/getMasterTime', verifyToken, cacheMiddleware, getMasterTime);
timeRoutes.post('/roomAvail', verifyToken, cacheMiddleware, getRoomAvail);

export default timeRoutes;