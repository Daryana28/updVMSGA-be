// PATH: backend/src/routes/contractorRoutes.js
import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../middleware/uploadMiddleware.js';

import { getPermitList } from '../controller/Contractor/getPermitList.js';
import { getPermitDetail } from '../controller/Contractor/getPermitDetail.js';
import { createPermit } from '../controller/Contractor/createPermit.js';
import { updatePermit } from '../controller/Contractor/updatePermit.js';
import { deletePermit } from '../controller/Contractor/deletePermit.js';
import { getFile } from '../controller/Contractor/getFile.js';
import { approveContractorPermit } from '../controller/Contractor/approveContractorPermit.js';

const router = express.Router();

// 1. RUTE STATIS (Tanpa Parameter)
router.post('/list', verifyToken, getPermitList);
router.post('/create', verifyToken, upload, createPermit);
router.post('/approve', verifyToken, approveContractorPermit);

// 2. RUTE SPESIFIK DENGAN PREFIX
// Letakkan /delete/:id DI ATAS /:id agar tidak tertabrak
router.delete('/delete/:id', verifyToken, deletePermit);

// 3. RUTE DENGAN SUFFIX
router.put('/:id/update', verifyToken, upload, updatePermit);

// 4. RUTE FILE
router.get('/files/:id', (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
}, getFile);

// 5. RUTE DINAMIS UMUM (ID ONLY)
// WAJIB diletakkan paling bawah karena paling "greedy"
router.get('/:id', verifyToken, getPermitDetail);

export default router;