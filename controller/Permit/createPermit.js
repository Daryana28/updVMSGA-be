// PATH: backend/src/controllers/permit/createPermit.js
import db from "../../model/index.js"; 
// Menggunakan import langsung lebih aman daripada req.db jika middleware belum stabil

const { ContractorPermit, ContractorWorker, sequelize } = db;

export const createPermit = async (req, res) => {
  // Gunakan Transaction agar jika simpan pekerja gagal, permit juga dibatalkan
  const t = await sequelize.transaction();
  
  

  try {
    const {
      token,
      no_permit,
      bulan,
      perusahaan,
      tipe_pekerjaan,
      pekerjaan,
      lokasi,
      tgl_mulai,
      tgl_akhir,
      jam_mulai,
      jam_akhir,
      pic_user,
      pic_hse,
      created_by,
      workers // Array objek pekerja
    } = req.body;

    // 1. Validasi Input sesuai Model (Snake Case)
    if (!token || !bulan || !perusahaan || !tgl_mulai || !tgl_akhir) {
      await t.rollback();
      return res.status(400).json({ 
        success: false, 
        msg: 'Data required: token, bulan, perusahaan, tgl_mulai, tgl_akhir' 
      });
    }

    // 2. Simpan ke tabel ContractorPermit
    const newPermit = await ContractorPermit.create({
      token,
      no_permit,
      bulan,
      perusahaan,
      tipe_pekerjaan,
      pekerjaan,
      lokasi,
      tgl_mulai,
      tgl_akhir,
      jam_mulai,
      jam_akhir,
      pic_user,
      pic_hse,
      created_by
    }, { transaction: t });

    // 3. Simpan ke tabel ContractorWorker (Bulk Insert)
    if (workers && Array.isArray(workers) && workers.length > 0) {
      const workerData = workers.map(w => ({
        permit_token: token,
        nama_pekerja: typeof w === 'string' ? w : w.nama_pekerja,
        identitas_no: w.identitas_no || null,
        status_absensi: 'Registered'
      }));

      await ContractorWorker.bulkCreate(workerData, { transaction: t });
    }

    // Commit semua perubahan ke database
    await t.commit();
    

    // Ambil data lengkap untuk respon/socket
    const fullPermit = await ContractorPermit.findOne({
      where: { token },
      include: [{ model: ContractorWorker, as: 'workers' }]
    });

    // === LOGIC SOCKET.IO SYNC ===
    // Menggunakan nama event yang didengarkan oleh ContractorDataLoader.jsx
    if (req.io) {
      req.io.emit('contractor-data-changed', { action: 'created', token });
      req.io.emit('newPermit', fullPermit);
      
    }

    res.status(201).json({
      success: true,
      msg: 'Permit dan Daftar Pekerja berhasil dibuat',
      permit: fullPermit
    });

  } catch (error) {
   
   
    if (t) await t.rollback();
    
    console.error("Error Create Permit:", error);
    res.status(500).json({ 
      success: false, 
      msg: 'Gagal membuat permit',
      error: error.message 
    });
  }
};