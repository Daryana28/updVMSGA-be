// backend/src/controllers/permit/getPermitList.js

import { Op } from "sequelize";
import WorkingPermit from "../../models/WorkingPermitModel.js";

export const getPermitList = async (req, res) => {
 

 try {
  const { startDate, endDate, bulan, perusahaan, type, dept, page = 1, limit = 50 } = req.body;
  const offset = (page - 1) * limit;
  const whereClause = {};

  // Sinkronisasi dengan kolom DB: MULAI dan AKHIR
  if (startDate && endDate) {
   whereClause.MULAI = { [Op.gte]: startDate };
   whereClause.AKHIR = { [Op.lte]: endDate };
  }

  // Sinkronisasi dengan kolom DB: BULAN, TYPE, PICUSER, PERUSAHAAN
  if (bulan) whereClause.BULAN = bulan;
  if (type && type !== "Pilih") whereClause.TYPE = type;
  if (dept) whereClause.PICUSER = { [Op.like]: `%${dept}%` };

  if (perusahaan) {
   whereClause.PERUSAHAAN = { [Op.like]: `%${perusahaan}%` };
  }

  // Menggunakan Model WorkingPermit secara langsung (bukan via req.db)
  const { count, rows: permits } = await WorkingPermit.findAndCountAll({
   where: whereClause,
   order: [['createdAt', 'DESC']],
   offset: parseInt(offset),
   limit: parseInt(limit),
  });
  console.log({
   success: true,
   permits,
   total: count,
   totalPages: Math.ceil(count / limit),
   currentPage: parseInt(page)
  });

  res.json({
   success: true,
   permits,
   total: count,
   totalPages: Math.ceil(count / limit),
   currentPage: parseInt(page)
  });
 } catch (error) {
  

  console.error("Error getPermitList:", error);

  res.status(500).json({
   success: false,
   msg: 'Gagal mengambil data permit',
   error: error.message
  });
 }
};