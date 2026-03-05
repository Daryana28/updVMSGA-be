import multer from 'multer';
import path from 'path';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

// Filter file
const fileFilter = (req, file, cb) => {
 // izinkan jpg, png, gif, pdf
 const allowedTypes = /jpeg|jpg|png|gif|pdf/;

 const extname = allowedTypes.test(
  path.extname(file.originalname).toLowerCase()
 );
 const mimetype = allowedTypes.test(file.mimetype.toLowerCase());

 if (extname && mimetype) {
  cb(null, true);
 } else {
  cb(new Error('Format file tidak didukung'), false);
 }
};

// Storage di memory (supaya bisa masuk ke DB)
const uploadMemory = multer({
 storage: multer.memoryStorage(),
 fileFilter,
 limits: { fileSize: MAX_FILE_SIZE, files: 50 },
});

export const upload = uploadMemory.any();
