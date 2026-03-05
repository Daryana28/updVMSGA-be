// PATH: be/controller/Contractor/createPermit.js
import db from "../../model/index.js";
import moment from "moment";
import { sendPushNotif } from "../Notification/sendNotif.js"; // Pastikan helper ini tersedia

export const createPermit = async (req, res) => {
  const { 
    ContractorPermit, 
    ContractorWorker, 
    MPermitImage, 
    MApprovalSteps, 
    MApprovals,
    MUser
  } = db;
  
  let transaction;
  const io = req.app.get('io');

  try {
    if (!req.body?.data) {
      return res.status(400).json({ success: false, message: "Payload 'data' tidak ditemukan." });
    }

    const payload = typeof req.body.data === "string" ? JSON.parse(req.body.data) : req.body.data;
    transaction = await db.sequelize.transaction();

    const { 
      token, 
      daftar_pekerja, 
      tgl_mulai, 
      tgl_akhir,
      pic_user,
      pic_hse,
      pekerjaan,
      lokasi,
      no_permit,
      tipe_pekerjaan
    } = payload;

    // 1. Simpan Permit dengan status UPPERCASE
    const permit = await ContractorPermit.create({
      token,
      no_permit: no_permit,
      bulan: moment().format("MMMM").toUpperCase(),
      perusahaan: payload.perusahaan,
      tipe_pekerjaan: tipe_pekerjaan || "REGULER",
      pekerjaan: pekerjaan || null,
      lokasi: lokasi || null,
      tgl_mulai: tgl_mulai ? moment(tgl_mulai).format("YYYY-MM-DD") : null,
      tgl_akhir: tgl_akhir ? moment(tgl_akhir).format("YYYY-MM-DD") : null,
      jam_mulai: payload.jam_mulai || "08:00:00",
      jam_akhir: payload.jam_akhir || "17:00:00",
      pic_user: pic_user || null, 
      pic_hse: pic_hse || null,
      created_by: req.user.nik || null,
      is_security_committed: payload.is_security_committed ? 1 : 0,
      needs_special_qualification: payload.needs_special_qualification ? 1 : 0,
      status_approval: "WAITING" 
    }, { transaction });

    // 2. Simpan daftar pekerja dengan status UPPERCASE
    let workersMap = {};
    if (Array.isArray(daftar_pekerja) && daftar_pekerja.length) {
      const workers = await ContractorWorker.bulkCreate(
        daftar_pekerja.map((p) => ({
          permit_token: token,
          nama_pekerja: p.nama_pekerja?.toUpperCase(),
          identitas_no: p.identitas_no || "KTP",
          status_absensi: "ALPHA" // Sesuai standar integrasi
        })),
        { transaction } 
      );

      workers.forEach((w, idx) => { workersMap[idx] = w.id; });
    }

    // 3. Simpan file dokumen
    const workerCount = Array.isArray(daftar_pekerja) ? daftar_pekerja.length : 0;
    if (req.files?.length) {
      await MPermitImage.bulkCreate(
        req.files.map((f, idx) => ({
          token,
          name: f.fieldname,
          files: f.buffer,
          mimeType: f.mimetype,
          originalName: f.originalname,
          file_size: f.size,
          worker_index: idx < workerCount ? idx : null,
          worker_id: idx < workerCount ? workersMap[idx] : null
        })),
        { transaction }
      );
    }

    // 4. Logic Approvals dengan status UPPERCASE
    const masterSteps = await MApprovalSteps.findAll({
      where: { category: "Contractor" },
      order: [["step_order", "ASC"]],
      transaction
    });
    
    const approvals = masterSteps.map(step => ({
      token,
      step_id: step.id,
      step_order: step.step_order,
      category: "Contractor",
      role: step.jabatan,
      approver_name: step.step_order === 1 ? String(req.user.nik) : step.dept,
      status: step.step_order === 1 ? "APPROVED" : "WAITING", 
      createdAt: new Date(),
      updatedAt: new Date()
    }));

    await MApprovals.bulkCreate(approvals, { transaction });
    await transaction.commit();

    // 5. Notifikasi Real-time & Push ke user HSE DEPT
    if (io) {
      const hseUsers = await MUser.findAll({
        attributes: ['nik'],
        where: db.Sequelize.where(
          db.Sequelize.fn(
            'UPPER',
            db.Sequelize.fn('RTRIM', db.Sequelize.fn('LTRIM', db.Sequelize.col('dept')))
          ),
          'HSE DEPT'
        ),
        raw: true
      });

      const targetNikSet = new Set(
        (hseUsers || [])
          .map((u) => String(u?.nik || '').trim())
          .filter(Boolean)
      );

      // fallback tambahan agar PIC HSE/User juga tetap ikut dapat notifikasi
      if (pic_hse) targetNikSet.add(String(pic_hse).trim());
      if (pic_user) targetNikSet.add(String(pic_user).trim());

      const targets = Array.from(targetNikSet);
      const notifPayload = {
        title: 'PERMIT BARU',
        message: `Permit ${no_permit} berhasil diajukan dan menunggu approval HSE.`,
        type: 'success'
      };

      for (const nikTarget of targets) {
        io.to(`user:${nikTarget}`).emit('notification', notifPayload);
        sendPushNotif(nikTarget, {
          title: "APPROVAL PERMIT",
          body: `Permit ${no_permit} menunggu persetujuan Anda.`,
          url: `/contractor-list` 
        }).catch(err => console.error("WebPush Error:", err.message));
      }
    }

    return res.status(201).json({ success: true, message: "PERMIT_SAVED_SUCCESSFULLY" });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error createPermit:", error);
    return res.status(500).json({ 
        success: false, 
        message: "GAGAL_SIMPAN_PERMIT", 
        details: error.message 
    });
  }
};

export default createPermit;
