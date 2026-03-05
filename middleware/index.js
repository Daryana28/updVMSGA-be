// middleware/index.js
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { serverConfig } from '../config/server/server.js';

export const setupMiddleware = (app) => {
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
  app.set('trust proxy', 1);
  
  // Helmet dengan config dari server.js
  const helmetConfig = { ...serverConfig.helmet };
  helmetConfig.contentSecurityPolicy.directives["connect-src"] = [
    "'self'",
    ...serverConfig.allowedOrigins
  ];
  app.use(helmet(helmetConfig));
  
  app.use(compression());
  app.use('/api/', rateLimit(serverConfig.rateLimit));
  app.use(cors({ 
    origin: serverConfig.allowedOrigins, 
    credentials: true 
  }));
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true, limit: '10kb' }));
  app.use(cookieParser());
  app.use(session(serverConfig.session));
};