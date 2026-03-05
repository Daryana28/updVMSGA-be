/* controllers/auth/login.js */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import MUser from '../../model/MUser.js';

export const login = async (req, res) => {
  try {
    const { nik, password } = req.body;

    if (!nik || !password) {
      return res.status(400).json({ status: 400, msg: 'Semua input harus diisi' });
    }

    const user = await MUser.findOne({
      raw: true,
      nest: true,
      where: { nik }
    });

    if (!user || !user.password) {
      return res.status(401).json({ status: 401, msg: 'Kredensial tidak valid' });
    }

    let hash = user.password;
    if (hash.startsWith('$2y$')) {
      hash = '$2a$' + hash.slice(4);
    }

    const isPasswordValid = await bcrypt.compare(password, hash);

    if (!isPasswordValid) {
      return res.status(401).json({ status: 401, msg: 'Kredensial tidak valid' });
    }

    const token = jwt.sign(
      { nik: Number(user.nik), nama: user.nama, dept: user.dept },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Update token di database
    await MUser.update(
      { token },
      { where: { nik } }
    );

    // Set cookie yang sinkron dengan JWT (1 hari)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 
    });

    // Response wajib menyertakan token agar frontend bisa menyimpannya di localStorage
    return res.status(200).json({
      status: 200,
      success: true,
      token: token,
      message: `Selamat datang ${user.nama}`,
      user: {
        nik: user.nik,
        nama: user.nama
      }
    });

  } catch (err) {
   console.log(err);
    console.error('Login error:', err);
    return res.status(500).json({ status: 500, msg: 'Terjadi kesalahan pada server' });
  }
};