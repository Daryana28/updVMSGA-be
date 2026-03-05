/* PATH: ./routes/notificationRoutes.js */
import express from 'express';
// Sesuaikan path import dengan lokasi file subscribe.js Anda
import subscribe from '../controller/Notification/subscribe.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

/**
 * Endpoint: POST /subscribe
 * Deskripsi: Menyimpan data subscription push notification dan NIK user
 * Diakses via Axios/Fetch dari Frontend
 */
router.post('/subscribe', verifyToken, subscribe);

/**
 * Endpoint: GET /test-push
 * Deskripsi: Mengirim notifikasi tes ke user yang sedang login
 * Digunakan untuk verifikasi koneksi backend ke browser push service
 */
router.get('/test-push', verifyToken, async (req, res) => {
 
 
  try {
    // Import dinamis untuk memastikan helper terload saat dibutuhkan
    const { sendPushNotif } = await import('../controller/Notification/sendNotif.js');
    
    // Menggunakan NIK dari token yang diverifikasi middleware
    await sendPushNotif(req.user.nik, {
      title: "GA SYSTEM TEST",
      body: "Koneksi Web Push berhasil dikonfigurasi.",
      url: "/dashboard"
    });
    
    res.json({ success: true, message: "Notification sent successfully to your device." });
  } catch (error) {
   
   
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;