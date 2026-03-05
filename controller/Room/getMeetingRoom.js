import { Op } from "sequelize";
import MKategoriRoom from "../../model/room/MKategoriRoom.js";
import MMasterRoom from "../../model/room/MMasterRoom.js";

export const getMeetingRoom = async (req, res) => {
 const { ret } = req.body;
 try {
  const rooms = await MMasterRoom.findAll({
   raw: true,
   nest: true,
   // where: {
   //   SHOW: {
   //     [Op.ne]: null // Menggunakan operator Sequelize untuk "not equal to null"
   //   }
   // },
   include: [{
    model: MKategoriRoom,
    as: 'kategoriRoom'
   }]
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
