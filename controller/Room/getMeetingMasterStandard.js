import { Op } from "sequelize";
import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";

export const getMeetingMasterStandard = async (req, res) => {
 const { ret, kategori } = req.body;

 try {
  let whereClause = {};
  if (kategori === 'all') {
   // Semua kategori KECUALI 'FASILITAS PESERTA'
   whereClause = {
    kategori: {
     [Op.ne]: 'FASILITAS PESERTA'
    }
   };
  } else if (kategori === 'FASILITAS PESERTA') {
   // Hanya kategori 'FASILITAS PESERTA'
   whereClause = {
    kategori: 'FASILITAS PESERTA'
   };
  } else {
   // Kategori lain, cari persis sesuai input
   whereClause = {
    kategori
   };
  }

  const rooms = await MMasterRoomStandard.findAll({
   raw: true,
   nest: true,
   where: whereClause
  });

  if (ret !== 'ret') {
   return res.status(200).json(rooms);
  } else {
   return rooms;
  }
 } catch (error) {
  if (ret !== 'ret') {
   return res.status(400).json({ error: error.message });
  } else {
   return { error: error.message };
  }
 }
};
