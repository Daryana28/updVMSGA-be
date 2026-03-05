// be\controller\User\refreshToken.js
import jwt from 'jsonwebtoken';

export const refreshToken = async (req, res) => {
  try {
    const user = req.user; // Dari middleware verifyToken
    
    // Buat token baru
    const newToken = jwt.sign(
      { id: user.id, nik: user.nik, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
    
    res.json({
      success: true,
      token: newToken,
      user: {
        id: user.id,
        nik: user.nik,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({
      success: false,
      message: 'Gagal memperbarui token'
    });
  }
};