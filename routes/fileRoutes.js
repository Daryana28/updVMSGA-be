// PATH: be/routes/fileRoutes.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Folder tempat file disimpan, misal './uploads'
const FILE_DIR = path.join(__dirname, '../uploads');

// Serve file statis dengan auth
router.get('/:filename', verifyToken, (req, res) => {
  const filePath = path.join(FILE_DIR, req.params.filename);
  res.sendFile(filePath, err => {
    if (err) res.status(404).json({ error: 'File not found' });
  });
});

export default router;
