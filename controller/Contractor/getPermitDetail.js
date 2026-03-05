// backend/src/controllers/permit/getPermitDetail.js

import WorkingPermit from "../../model/contractor/WorkingPermitModel.js";

/**
 * Controller untuk mengambil detail permit berdasarkan TOKEN
 * Mengacu pada tabel dbo.WORKINGPERMIT
 */
export const getPermitDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Menggunakan findByPk karena TOKEN telah didefinisikan sebagai primaryKey di WorkingPermitModel
    // Langsung menggunakan Model WorkingPermit (bukan req.db) untuk konsistensi Sequelize
    const permit = await WorkingPermit.findByPk(id);
    
    if (!permit) {
      return res.status(404).json({ 
        success: false, 
        msg: 'Permit tidak ditemukan' 
      });
    }

    // Response sukses mengembalikan objek permit
    // Getter di model akan otomatis menangani JSON.parse pada kolom PEKERJA
    res.json({ 
      success: true, 
      permit 
    });
  } catch (error) {
    console.error("Error getPermitDetail:", error.message);
    res.status(500).json({ 
      success: false, 
      msg: 'Gagal mengambil detail permit',
      error: error.message 
    });
  }
};