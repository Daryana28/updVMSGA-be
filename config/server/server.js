// config/server.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const requiredEnvs = [
  'PORT',
  'SESSION_SECRET',
  'JWT_SECRET',
  'TOKEN_KEY',
  'VAPID_PUBLIC_KEY',
  'VAPID_PRIVATE_KEY'
];

requiredEnvs.forEach((env) => {
  if (!process.env[env]) {
    console.error(`Critical Error: Missing env variable [${env}]`);
    process.exit(1);
  }
});

const keyPath = path.join(__dirname, '../../cert', 'private.key');
const certPath = path.join(__dirname, '../../cert', 'certificate.cer');

if (!fs.existsSync(keyPath) || !fs.existsSync(certPath)) {
  console.error('Certificate files not found');
  process.exit(1);
}

export const serverConfig = {
  port: parseInt(process.env.PORT) || 5010,
  sslOptions: {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  },
  allowedOrigins: [
    'https://pik1com074.local.ikoito.co.id:3000',
    'https://pik1com074.local.ikoito.co.id',
    'https://pik1com074.local.ikoito.co.id:5010',
    'https://pik1com074.local.ikoito.co.id:449',
    'https://pik1com191.local.ikoito.co.id:3000',
    'https://pik1com191.local.ikoito.co.id',
    'https://pik1com191.local.ikoito.co.id:5010',
    'https://pik1com191.local.ikoito.co.id:449',
    'https://pik1svr008.local.ikoito.co.id:449',
    'https://localhost:3000',
    'https://localhost:449',
    'https://localhost:5010',
    'http://localhost:3000',
    'http://localhost:449',
  ],
  rateLimit: {
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { status: 429, message: 'Terlalu banyak permintaan, coba lagi nanti.' }
  },
  session: {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      secure: true,
      httpOnly: true,
      sameSite: 'none',
      maxAge: 3600000
    }
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        "default-src": ["'self'"],
        "script-src": ["'self'", "'unsafe-inline'"],
        "style-src": ["'self'", "'unsafe-inline'"],
        "img-src": ["'self'", "data:", "https:"],
        "connect-src": ["'self'"]
      }
    }
  }
};
