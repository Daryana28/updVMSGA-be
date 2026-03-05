import db from "../../model/index.js";
import moment from "moment";

const { ContractorPermit, MApprovals, MUser, Sequelize } = db;
const { Op } = Sequelize;

export const approveContractorPermit = async (req, res) => {
  const token = String(req.body.token);
  const step_order = parseInt(req.body.step_order, 10);
  const { status, notes } = req.body;
  const { nik, nama } = req.user; 
  const io = req.app.get('io'); 

  let transaction;

  try {
    transaction = await db.sequelize.transaction();

    // 1. Cari step aktif
    const currentStep = await MApprovals.findOne({
      where: { 
        token: token, 
        step_order: step_order,
        status: { [Op.in]: ['Waiting', 'WAITING', 'Pending', 'PENDING', 'Approve', 'Approved'] }
      },
      transaction
    });

    if (!currentStep) {
      throw new Error(`Step ${step_order} tidak tersedia atau sudah diproses.`);
    }

    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    // MENGUBAH SEMUA STATUS KE UPPERCASE
    const targetStatus = status.toUpperCase() === 'APPROVED' ? 'APPROVED' : 'REJECTED';
    
    // 2. Update status step saat ini
    await currentStep.update({
      status: targetStatus, 
      approver_name: nik,
      approved_at: timestamp,
      notes: notes || null
    }, { transaction });

    // 3. Ambil data permit untuk pengecekan next step & socket
    const permit = await ContractorPermit.findOne({
      where: { token },
      include: [{ model: MUser, as: 'user', attributes: ['nik', 'nama', 'dept'] }],
      transaction
    });

    if (!permit) throw new Error("Data Permit tidak ditemukan.");

    const isApproved = targetStatus === 'APPROVED';

    if (isApproved) {
      const nextStep = await MApprovals.findOne({
        where: { token, step_order: step_order + 1 },
        transaction
      });

      if (nextStep) {
        // Aktifkan step berikutnya (WAITING) dan update status utama
        await nextStep.update({ status: 'WAITING' }, { transaction });
        await permit.update({ status_approval: 'WAITING' }, { transaction });
      } else {
        // Jika semua alur selesai (APPROVED)
        await permit.update({ status_approval: 'APPROVED' }, { transaction });
      }
    } else {
      // Jika salah satu menolak (REJECTED)
      await permit.update({ status_approval: 'REJECTED' }, { transaction });
    }

    /* Logic Notifikasi */
    if (db.Notif) {
      await db.Notif.create({
        DARI: nik,
        KEPADA: permit.created_by,
        MSG: `Permit ${permit.no_permit || token} telah di-${status.toLowerCase()} oleh ${nama}`,
        STATUS: 'UNREAD',
        TOKEN: token,
        createdAt: timestamp 
      }, { transaction });
    }

    await transaction.commit();

    // 4. Socket Real-time
    if (io) {
      io.emit('permitUpdated', { token, status: targetStatus });
      const roomName = `user:${String(permit.created_by).trim()}`;
      io.to(roomName).emit('newNotification', {
        title: 'Update Permit Kerja',
        message: `Izin Kerja ${permit.no_permit} Anda ${isApproved ? 'disetujui' : 'ditolak'} oleh ${nama}.`,
        type: isApproved ? 'success' : 'error',
        token: token
      });
    }

    return res.status(200).json({ 
      success: true, 
      message: `Berhasil melakukan ${status} pada permit ${permit.no_permit || ''}` 
    });

  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Approval Error Detail:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};