// PATH: be/controller/Contractor/updatePermit.js
import db from "../../model/index.js";
import moment from "moment";

export const updatePermit = async (req, res) => {
  const { ContractorPermit, ContractorWorker, MPermitImage } = db;
  // Perbaikan pengambilan instance socket
  const io = req.app.get('io') || req.app.get('socketio');
  const { id } = req.params; 

  let transaction;

  try {
    if (!req.body?.data) {
      return res.status(400).json({ success: false, message: "Payload 'data' tidak ditemukan." });
    }

    const payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
    
    const { 
      daftar_pekerja, 
      tgl_mulai, 
      tgl_akhir, 
      jam_mulai, 
      jam_akhir, 
      pic_hse, 
      pekerjaan, 
      lokasi, 
      tipe_pekerjaan,
      rank,
      no_permit,
      perusahaan
    } = payload;

    const permit = await ContractorPermit.findOne({ where: { token: id } });
    if (!permit) {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    transaction = await db.sequelize.transaction();

    await ContractorPermit.update({
      no_permit: no_permit || permit.no_permit,
      perusahaan: perusahaan || permit.perusahaan,
      tipe_pekerjaan: tipe_pekerjaan || permit.tipe_pekerjaan,
      pekerjaan: pekerjaan || permit.pekerjaan,
      lokasi: lokasi || permit.lokasi,
      rank: rank || permit.rank,
      tgl_mulai: tgl_mulai ? moment(tgl_mulai).format("YYYY-MM-DD") : permit.tgl_mulai,
      tgl_akhir: tgl_akhir ? moment(tgl_akhir).format("YYYY-MM-DD") : permit.tgl_akhir,
      jam_mulai: jam_mulai || permit.jam_mulai,
      jam_akhir: jam_akhir || permit.jam_akhir,
      pic_hse: typeof pic_hse === 'object' ? pic_hse?.nik : (pic_hse || permit.pic_hse),
      updated_at: moment().format("YYYY-MM-DD HH:mm:ss")
    }, { 
      where: { token: id },
      transaction 
    });

    if (Array.isArray(daftar_pekerja)) {
      await ContractorWorker.destroy({ where: { permit_token: id }, transaction });
      
      if (daftar_pekerja.length > 0) {
        await ContractorWorker.bulkCreate(
          daftar_pekerja.map((p) => ({
            permit_token: id,
            nama_pekerja: p.nama_pekerja,
            identitas_no: p.identitas_no || "KTP",
            jabatan: p.jabatan || "",
            status_absensi: "Alpha"
          })),
          { transaction }
        );
      }
    }

    if (req.files?.length) {
      await MPermitImage.destroy({ where: { token: id }, transaction });
      
      await MPermitImage.bulkCreate(
        req.files.map((f) => ({
          token: id,
          name: f.fieldname,
          files: f.buffer,
          mimeType: f.mimetype,
          originalName: f.originalname,
          file_size: f.size
        })),
        { transaction }
      );
    }

    await transaction.commit();

    if (io) {
      // Penambahan delay 500ms untuk memastikan sinkronisasi DB
      setTimeout(() => {
        io.emit('contractor-data-changed', { 
          token: id, 
          action: 'UPDATED',
          updatedBy: req.user?.nik || 'System'
        });
        
        io.emit('permitUpdated', { 
          token: id, 
          action: 'UPDATED'
        });
        
      }, 500); 
    }

    return res.status(200).json({ 
      success: true, 
      message: "Permit Berhasil Diperbarui" 
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error updatePermit:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Gagal memperbarui permit",
      error: error.message 
    });
  }
};