import MRequestRoom from "../../model/room/MRequestRoom.js";
import { getRoomAvail } from "./getRoomAvail.js";
import { Sequelize } from "sequelize";

export const manageRequestRoom = async (req, res) => {
 const transaction = await MRequestRoom.sequelize.transaction();
 
 try {
  const {
   request_token,
   roomid,
   tanggal,
   fasilitasRuangan,
   fasilitasMeeting,
   peserta,
   nama,
   nik,
   min,
   max,
   subject,
   perusahaan,
   qty,
   status,
   start_time,
   end_time,
   btn
  } = req.body;

  const existingRequest = await MRequestRoom.findOne({ 
   where: { request_token },
   transaction 
  });

  const facilitiesRuangan = Array.isArray(fasilitasRuangan)
   ? fasilitasRuangan.map(item => item.value).join(',')
   : '';
   
  const facilitiesMeeting = Array.isArray(fasilitasMeeting)
   ? fasilitasMeeting.map(item => item.value).join(',')
   : '';

  const facilities = facilitiesRuangan + (facilitiesMeeting ? (facilitiesRuangan ? ',' : '') + facilitiesMeeting : '');

  const attendance = Array.isArray(peserta)
   ? peserta.map(item => item.value).join(',')
   : '';

  const requestData = {
   request_token,
   roomid,
   tanggal,
   facility: facilities,
   peserta: attendance,
   nik,
   min: start_time?.value || min || null,
   max: end_time?.value || max || null,
   subject,
   perusahaan,
   qty,
   status,
  };

  if (!requestData.min || !requestData.max) {
   await transaction.rollback();
   return res.status(400).json({ 
    success: false, 
    message: "Waktu mulai dan selesai diperlukan" 
   });
  }

  const bookedRequests = await MRequestRoom.findAll({
   raw: true,
   nest: true,
   attributes: ['min', 'max'],
   where: {
    roomid,
    tanggal,
    status: 'BOOKED',
    request_token: { [Sequelize.Op.ne]: request_token }
   },
   transaction
  });

  const used = new Set();
  bookedRequests.forEach(req => {
   if (req.min && req.max) {
    for (let i = req.min; i <= req.max; i++) {
     used.add(Number(i));
    }
   }
  });

  const actTime = new Set();
  for (let i = requestData.min; i <= requestData.max; i++) {
   actTime.add(Number(i));
  }

  const intersection = [...used].filter(item => actTime.has(item));

  if (!existingRequest && btn === 'add') {
   if (intersection.length > 0) {
    await transaction.rollback();
    return res.status(400).json({ 
     success: false, 
     message: "Waktu sudah digunakan oleh booking lain",
     conflictTimes: intersection 
    });
   } else {
    await MRequestRoom.create(requestData, { transaction });
    await transaction.commit();
    return res.status(201).json({ 
     success: true, 
     message: "Data berhasil disimpan." 
    });
   }
  }

  if (existingRequest && (btn === 'edit' || btn === 'confirm')) {
   if (intersection.length > 0 && btn !== 'confirm') {
    await transaction.rollback();
    return res.status(400).json({ 
     success: false, 
     message: "Waktu sudah digunakan oleh booking lain",
     conflictTimes: intersection 
    });
   } else {
    await MRequestRoom.update(requestData, { 
     where: { request_token },
     transaction 
    });
    await transaction.commit();
    return res.status(200).json({ 
     success: true, 
     message: "Data berhasil diperbarui." 
    });
   }
  }
  
  if (existingRequest && btn === 'cancel') {
   await MRequestRoom.update(requestData, { 
    where: { request_token },
    transaction 
   });
   await transaction.commit();
   return res.status(200).json({ 
    success: true, 
    message: "Data berhasil diperbarui." 
   });
  }
  
  await transaction.rollback();
  return res.status(400).json({ 
   success: false, 
   message: "Invalid request" 
  });
  
 } catch (error) {
  await transaction.rollback();
  console.error('Error in manageRequestRoom:', error);
  return res.status(400).json({ 
   success: false, 
   message: 'Terjadi kesalahan pada server.',
   error: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
 }
};