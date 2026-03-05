/* be/routes/dashboardRoutes.js */
import express from 'express';
import { verifyToken } from '../middleware/verifyToken.js';
import { getDashboardSummary } from '../controller/Dashboard/getDashboardSummary.js';

const dashboardRoutes = express.Router();

dashboardRoutes.post('/summary', verifyToken, getDashboardSummary);

export default dashboardRoutes;