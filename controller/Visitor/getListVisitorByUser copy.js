import MUser from "../../model/MUser.js";
import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";
import MReqVisitor from "../../model/visitor/MReqVisitor.js";
import MVisitorAttendance from "../../model/visitor/MVisitorAttendance.js";
import MVisitorFacility from "../../model/visitor/MVisitorFacility.js";

export const getListVisitorByUser = async (req, res) => {
 const { pic } = req.body;
 if (!pic) {
  return res.status(400).json({ error: "PIC wajib diisi dan harus berupa string yang valid." });
 }
 try {
  // Ambil data visitor beserta relasi user
  const visitors = await MReqVisitor.findAll({
   where: { pic },
   attributes: { exclude: ['updatedAt'] },
   include: [
    {
     model: MUser,
     as: 'user',
     attributes: ['nik', 'nama', 'dept'],
     required: false
    }
   ],
   order: [['startDate', 'DESC']]
  });

  // Mapping hasil visitor ke format yang lebih rapi, sertakan attendance & facility
  const result = await Promise.all(visitors.map(async (v) => {
   let token = v.token ? v.token.replace(/\s+/g, '') : null;
   let attendance = [];
   let facility = [];

   if (token && token.length > 0) {
    try {
     const attendance = await MVisitorAttendance.findAll({
      raw: true,
      nest: true,
      where: { token }
     });
     if (attendance) {
      try {
       facility = await MVisitorFacility.findAll({
        raw: true,
        nest: true,
        where: { token }
       });
      } catch (err) {
       console.error(`Gagal mengambil facility untuk token: ${token}`, err);
       facility = [];
      }
     }
    } catch (err) {
     console.error(`Gagal mengambil attendance untuk token: ${token}`, err);
     attendance = [];
    }
   }

   return {
    token: token || '',
    startDate: v.startDate,
    endDate: v.endDate,
    startTime: v.startTime,
    endTime: v.endTime,
    area_kerja: v.area_kerja,
    jumlahTamu: v.jumlahTamu,
    nama: v.user?.nama || null,
    perusahaan: v.perusahaan,
    pic: v.pic,
    user: v.user ? {
     nik: v.user.nik,
     nama: v.user.nama,
     dept: v.user.dept
    } : null,
    attendance,
    facility
   };
  }));

  // Kirim response ke client
  return res.json(result);
 } catch (error) {
  return res.status(500).json({ error: `Terjadi kesalahan pada server ${error}` });
 }
}