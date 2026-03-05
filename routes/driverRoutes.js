import express from 'express';
import getMasterDriver from '../controller/Driver/getMasterDriver.js';
import { verifyToken } from '../middleware/verifyToken.js';

const driverRoutes = express.Router();

driverRoutes.post('/getMasterDriver', verifyToken, getMasterDriver);

export default driverRoutes;
