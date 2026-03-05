import { Op } from "sequelize";
import MBoardVisitor from "../../model/visitor/MBoardVisitor.js";
import MBoardDetail from "../../model/visitor/MBoardDetail.js";

export const getListBoard = async (req, res) => {
 const { dateStart, dateEnd } = req.body;

 try {
  const find = await MBoardVisitor.findAll({
   where: {
    dateStart: {
     [Op.between]: [dateStart, dateEnd], // ✅ perbaikan rentang tanggal
    },
   },
   include: [
    {
     model: MBoardDetail,
     as: "BoardDetails",
    }
   ],
   order: [
    ["dateStart", "ASC"],
   ],
  });

  // Surgical Fix: Bungkus dalam objek data agar konsisten dengan pengecekan frontend
  res.status(200).json({
   status: 200,
   data: find
  });
 } catch (error) {
  console.error(error);
  res.status(500).json({
   status: 0,
   msg: "Terjadi kesalahan saat mengambil data",
   error: error.message,
  });
 }
};