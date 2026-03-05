// PATH: be/controller/Contractor/deletePermit.js
import db from "../../model/index.js";

const { ContractorPermit, MApprovals, sequelize } = db;

export const deletePermit = async (req, res) => {
  const { id } = req.params; // Token: PRMT-xxxx
  let transaction;

  try {
    // 1. Inisialisasi Transaction
    transaction = await sequelize.transaction();

    // 2. Cek Keberadaan Data Utama
    const permit = await ContractorPermit.findOne({
      where: { token: id },
      transaction
    });

    if (!permit) {
      await transaction.rollback();
      return res.status(404).json({
        success: false,
        message: `Data permit ${id} tidak ditemukan.`
      });
    }

    // 3. Hapus Approvals (Manual)
    // Walaupun ada CASCADE, menghapus approvals secara eksplisit dalam transaksi sering dilakukan 
    // untuk memastikan integrasi tabel approval yang bersifat general.
    await MApprovals.destroy({
      where: { token: id },
      transaction
    });

    // 4. Hapus Permit Utama (Trigger CASCADE)
    // Menghapus baris ini akan otomatis menghapus pekerja dan gambar
    // karena onDelete: "CASCADE" pada model association di index.js.
    await ContractorPermit.destroy({
      where: { token: id },
      transaction
    });

    // 5. Commit Transaction
    await transaction.commit();

    // 6. Trigger Socket Real-time
    const io = req.app.get('io');
    if (io) {
      io.emit('contractor-data-changed', {
        token: id,
        action: 'DELETED',
        timestamp: Date.now()
      });
    }

    return res.status(200).json({
      success: true,
      message: `Berhasil menghapus data permit ${id} beserta riwayat Approval, Workers, dan Images.`
    });

  } catch (error) {
    // Rollback jika ada error dalam proses
    if (transaction) {
      await transaction.rollback();
    }

    console.error(`[CRITICAL ERROR] Delete Permit failed:`, error.message);

    return res.status(500).json({
      success: false,
      message: "Gagal memproses penghapusan data.",
      error: error.message
    });
  }
};