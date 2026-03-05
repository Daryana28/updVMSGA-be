import moment from 'moment';
import MUser from "../../model/MUser.js";
import PushSubscription from "../../model/PushSubscription.js";

export const logout = async (req, res) => {
  // Ambil token dari cookie
  const token = req.cookies?.token;

  // Jika token tidak ada, bersihkan cookie dan beri respon sukses
  if (!token) {
    res.clearCookie('token');
    return res.status(200).json({ msg: 'Logout berhasil (Cookie cleared)' });
  }

  try {
    // 1. Hapus token di database MUser
    await MUser.update(
      {
        token: null,
        updatedAt: moment().format('YYYY-MM-DD HH:mm')
      },
      { 
        where: { token: token } 
      }
    );

    // 2. INTEGRASI WEB-PUSH: Hapus data langganan notifikasi dari database
    // Kita gunakan .catch() agar jika tabel tidak ada/error, proses logout tetap lanjut
    await PushSubscription.destroy({ 
      where: { token: token } 
    }).catch(err => console.warn('Push subscription cleanup failed:', err.message));

    // 3. Bersihkan cookie di browser (Wajib untuk HTTPS/Production)
    res.clearCookie('token', {
      httpOnly: true,
      secure: true, 
      sameSite: 'None' 
    });

    return res.status(200).json({ msg: 'Logout berhasil' });

  } catch (err) {
    console.error('Error saat logout:', err);
    // Jalur penyelamatan: Pastikan cookie tetap dihapus demi pengalaman user
    res.clearCookie('token');
    return res.status(500).json({ 
      msg: 'Terjadi kesalahan server, namun session browser telah dibersihkan', 
      error: err.message 
    });
  }
};