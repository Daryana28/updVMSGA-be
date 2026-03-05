import MJabatan from "../../model/approval/MJabatan.js";
import MJabatanDetail from "../../model/approval/MJabatanDetail.js";

export const getApproverByJabatan = async (req, res) => {
 try {
  const { jabatan } = req.body;
  if (!jabatan) {
   return res.status(400).json({ message: "Jabatan wajib diisi" });
  }

  const approvers = await MJabatan.findAll({
   include: [
    {
     association: "JabatanDetails",
     where: { jabatan }, // filter JabatanDetails sesuai jabatan
     required: false, // agar MJabatan tetap muncul meski tidak ada JabatanDetails yg match
     include: [
      {
       association: "userDetailJabat",
       attributes: ['nik', 'nama', 'dept']
      }
     ],
    }
   ],
  });

  return res.json({
   message: `Success get approver by ${jabatan}`,
   data: approvers,
  });

 } catch (error) {
  console.error("Error getApproverByJabatan:", error);
  return res.status(500).json({
   message: "Terjadi kesalahan pada server",
   error: error.message,
  });
 }
};
