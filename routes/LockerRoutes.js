import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getKategoriLoker } from '../controller/Locker/getKategoriLoker.js';
import { findLokerByKategori } from '../controller/Locker/findLokerByKategori.js';
import { manageLocker } from '../controller/Locker/manageLocker.js';

const lockerRoutes = express.Router();

lockerRoutes.post('/getKategoriLoker', verifyToken, getKategoriLoker);
lockerRoutes.post('/findLokerByKategori', verifyToken, findLokerByKategori);
lockerRoutes.post('/manageLocker', verifyToken, manageLocker);

export default lockerRoutes;