import MApprovals from "../../model/approval/MApproval.js";
import MVisitorAttendance from "../../model/visitor/MVisitorAttendance.js";

export const getVisitorAttendanceByToken = async (req, res) => {
 try {
  const { token } = req.body;

  // Validasi input
  if (!token || typeof token !== "string" || token.trim() === "") {
   return res.status(400).json({
    status: "error",
    message: "Token wajib diisi dan harus berupa string yang valid.",
   });
  }

  const visitor = await MVisitorAttendance.findOne({
   where: { tokenAttn: token.trim() },
   attributes: [
    "tokenAttn",
    "token",
    "nama",
    "kewarganegaraan",
    "no_paspor",
    "tempat_tinggal",
   ],
   include: [
    {
     association: "requestVisitor",
     include: [
      { association: "user", attributes: ["nik", "nama", "dept"] },
      {
       model: MApprovals,
       as: "approvals",
       attributes: [
        "id",
        "token",
        "step_id",
        "step_order",
        "approver_name",
        "status",
       ],
      },
     ],
    },
    {
     association: "images",
    },
    {
     association: "requestVisitor",
    }
   ],
  });

  if (!visitor) {
   return res.status(404).json({
    status: "error",
    message: "Data visitor tidak ditemukan.",
   });
  }

  return res.status(200).json(visitor);
 } catch (error) {
  console.error("getVisitorAttendanceByToken error:", error);
  return res.status(500).json({
   status: "error",
   message: "Terjadi kesalahan pada server.",
   details: error.message,
  });
 }
};
