import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getScheduleCar } from '../controller/Car/getScheduleCar.js';
import { getMasterCar } from '../controller/Car/getMasterCar.js';
import { manageScheduleCar } from '../controller/Car/manageScheduleCar.js';
import { getMasterCarDriver } from '../controller/Car/getMasterCarDriver.js';
import { manageCarDriver } from '../controller/Car/manageCarDriver.js';
import { manageMasterCar } from '../controller/Car/manageMasterCar.js';

const carRoutes = express.Router();

carRoutes.post('/getScheduleCar', verifyToken, getScheduleCar);
carRoutes.post('/manageScheduleCar', verifyToken, manageScheduleCar);
carRoutes.post('/getMasterCar', verifyToken, getMasterCar);
carRoutes.post('/manageMasterCar', verifyToken, manageMasterCar);
carRoutes.post('/getMasterCarDriver', verifyToken, getMasterCarDriver);
carRoutes.post('/manageCarDriver', verifyToken, manageCarDriver);

export default carRoutes;