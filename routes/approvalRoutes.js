import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getApprovalById } from '../controller/Approval/getApprovalById.js';
import { manageApproval } from '../controller/Approval/manageApproval.js';
import { getApproverByJabatan } from '../controller/Visitor/getApproverByJabatan.js';
import { manageApprovers } from '../controller/Visitor/manageApprovers.js';
const approvalRoutes = express.Router();

approvalRoutes.post('/getApprovalById', verifyToken, getApprovalById);
approvalRoutes.post('/manageApproval', verifyToken, manageApproval);
approvalRoutes.post('/getApproverByJabatan', verifyToken, getApproverByJabatan);
approvalRoutes.post('/manageApprovers', verifyToken, manageApprovers);

export default approvalRoutes;
