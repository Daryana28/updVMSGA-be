// PATH: be/middleware/verifyToken.js
import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ 
      status: 401, 
      msg: 'Sesi tidak ditemukan.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Normalisasi object user agar konsisten digunakan di seluruh controller
    req.user = {
      ...decoded,
      nama: decoded.nama || decoded.name,
      nik: decoded.nik,
      dept: decoded.dept
    };
    
    next();
  } catch (err) {
    const message = err.name === 'TokenExpiredError' ? 'Sesi telah berakhir' : 'Sesi tidak valid';
    return res.status(401).json({ 
      status: 401, 
      msg: message 
    });
  }
};