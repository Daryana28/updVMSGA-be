import { Op } from "sequelize";
import MReqVisitor from "../../model/visitor/MReqVisitor.js";
import { getMeetingMasterStandard } from "../Room/getMeetingMasterStandard.js";
import MVisitorFacility from "../../model/visitor/MVisitorFacility.js";
import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";
import moment from "moment";
import MApprovals from "../../model/approval/MApproval.js";

export const getFacilityByDate = async (req, res) => {
 const { startDate, endDate, pic, kategori } = req.body;
 const start = moment(startDate).startOf("day").toDate();
 const end = moment(endDate).endOf("day").toDate();

 // Validasi input
 if (!startDate || !endDate) {
  return res.status(400).json({ error: "startDate, endDate, dan pic wajib diisi." });
 }

 try {
  const daftarStandar = await getMeetingMasterStandard({ body: { ret: 'ret', kategori } });
  const fasilitasCount = {};
  const findReq = await MReqVisitor.findAll({
   where: {
    [Op.or]: [
     { startDate: { [Op.between]: [start, end] } },
     { endDate: { [Op.between]: [start, end] } },
     { startDate: { [Op.lte]: start }, endDate: { [Op.gte]: end } },
    ]
   },
   include: [
    {
     model: MApprovals,
     as: 'approvals',
     where: {
      approver_name: 'HR GA DEPT',
      status: 'approve'
     },
     required: true
    }
   ]
  });

  const tokens = findReq && findReq.length > 0
   ? findReq.map(rq => rq.token.trim())
   : [];

  // Query semua fasilitas visitor yang terkait dengan token di atas
  let fasilitas = [];
  if (tokens.length > 0) {
   fasilitas = await MVisitorFacility.findAll({
    where: {
     token: {
      [Op.in]: tokens
     }
    },
    include: [
     {
      model: MMasterRoomStandard,
      as: 'roomStandard',
      attributes: ['stdId', 'standard'],
      required: false
     }
    ],
    raw: true,
    nest: true
   });
  }

  // Hitung total fasilitas per standard
  fasilitas.forEach(fac => {
   const namaStandard = fac.roomStandard?.standard || "-";
   if (!fasilitasCount[namaStandard]) {
    fasilitasCount[namaStandard] = 0;
   }
   fasilitasCount[namaStandard] += 1;
  });

  // Susun output: tampilkan semua standard dari daftarStandar, walau tidak ditemukan di fasilitas
  let daftarStandardArr = [];
  if (Array.isArray(daftarStandar)) {
   // Jika getMeetingMasterStandard mengembalikan array of object dengan field 'standard'
   daftarStandardArr = daftarStandar.map(ds => typeof ds === "string" ? ds : ds.standard);
  }

  // Jika daftarStandar kosong, fallback ke semua key yang ditemukan di fasilitasCount
  if (daftarStandardArr.length === 0) {
   daftarStandardArr = Object.keys(fasilitasCount);
  }

  const result = daftarStandardArr.map(standard => ({
   standard,
   total: fasilitasCount[standard] || 0
  }));

  return res.status(200).json(result);

 } catch (error) {
  console.error(error);
  return res.status(500).json({ error: "Terjadi kesalahan pada server." });
 }
};