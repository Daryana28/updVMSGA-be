import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getListVisitor } from '../controller/Visitor/getListVisitor.js';
import { getListVisitorByUser } from '../controller/Visitor/getListVisitorByUser.js';
import { manageVisitor } from '../controller/Visitor/manageVisitor.js';
import { getFacilityByDate } from '../controller/Visitor/getFacilityByDate.js';
import { upload } from '../middleware/uploadMiddleware.js';
import { getVisitorByToken } from '../controller/Visitor/getVisitorByToken.js';
import { getVisitorAttendanceByToken } from '../controller/Visitor/getVisitorAttendanceByToken.js';
import { getListBoard } from '../controller/Visitor/getListBoard.js';
import { manageListBoard } from '../controller/Visitor/manageListBoard.js';
import { getDocumentVisitor } from '../controller/Visitor/getDocumentVisitor.js';

const visitorRoutes = express.Router();

visitorRoutes.post('/getListVisitor', verifyToken, getListVisitor);
visitorRoutes.post('/getVisitorByToken', verifyToken, getVisitorByToken);
visitorRoutes.post('/getVisitorAttendanceByToken', verifyToken, getVisitorAttendanceByToken);
visitorRoutes.post('/getListVisitorByUser', verifyToken, getListVisitorByUser);
visitorRoutes.get('/getDocumentVisitor/:id', verifyToken, getDocumentVisitor);
visitorRoutes.post('/manageVisitor', verifyToken, upload, manageVisitor);
visitorRoutes.post('/getFacilityByDate', verifyToken, getFacilityByDate);
visitorRoutes.post('/getListBoard', verifyToken, getListBoard);
visitorRoutes.post('/manageListBoard', verifyToken, manageListBoard);

export default visitorRoutes;