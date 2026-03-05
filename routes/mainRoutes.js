// PATH: backend/src/routes/index.js

import express from 'express';
import userRoutes from './userRoutes.js';
import roomRoutes from './roomRoutes.js';
import timeRoutes from './timeRoutes.js';
import visitorRoutes from './visitorRoutes.js';
import carRoutes from './carRoutes.js';
import parkRoutes from './parkRoutes.js';
import lockerRoutes from './LockerRoutes.js';
import approvalRoutes from './approvalRoutes.js';
import driverRoutes from './driverRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';
import contractorRoutes from './contractorRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import integrationRoutes from './integrationRoutes.js';

const mainRoutes = express.Router();
mainRoutes.use('/user', userRoutes);
mainRoutes.use('/room', roomRoutes);
mainRoutes.use('/visitor', visitorRoutes);
mainRoutes.use('/car', carRoutes);
mainRoutes.use('/driver', driverRoutes);
mainRoutes.use('/time', timeRoutes);
mainRoutes.use('/park', parkRoutes);
mainRoutes.use('/locker', lockerRoutes);
mainRoutes.use('/approval', approvalRoutes);
mainRoutes.use('/dashboard', dashboardRoutes);
mainRoutes.use('/contractor', contractorRoutes);
mainRoutes.use('/notifications', notificationRoutes);
mainRoutes.use('/integration', integrationRoutes);
export default mainRoutes;
