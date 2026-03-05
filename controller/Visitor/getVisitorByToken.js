import { Op } from "sequelize";
import MJabatan from "../../model/approval/MJabatan.js";
import MUser from "../../model/MUser.js";
import MReqVisitor from "../../model/visitor/MReqVisitor.js";
import MVisitorAttendance from "../../model/visitor/MVisitorAttendance.js";
import MApprovals from "../../model/approval/MApproval.js";
import MApprovalSteps from "../../model/approval/MApprovalSteps.js";
import MMasterRoom from "../../model/room/MMasterRoom.js";
import MVisitorImage from "../../model/visitor/MVisitorImage.js";
import MVisitorFacility from "../../model/visitor/MVisitorFacility.js";
import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";

export const getVisitorByToken = async (req, res) => {
 try {
  const { token } = req.body;

  if (!token || typeof token !== "string" || token.trim() === "") {
   return res.status(400).json({
    error: "Token wajib diisi dan harus berupa string yang valid."
   });
  }

  // Ambil visitor by token
  const visitor = await MReqVisitor.findOne({
   where: { token: token.trim() },
   attributes: { exclude: ["updatedAt"] },
   include: [
    {
     model: MUser,
     as: "user",
     attributes: ["nik", "nama", "dept"],
     required: true,
    },
    {
     model: MMasterRoom,
     as: "room",
     attributes: ["roomId", "nama"],
    },
    {
     model: MVisitorAttendance,
     as: "attendances",
     include: [
      {
       model: MVisitorImage,
       as: "images",
      },
      {
       model: MVisitorFacility,
       as: "facilities",
       include: [
        {
         model: MMasterRoomStandard,
         as: "roomStandard",
        },
       ],
      },
     ],
    },
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
     include: [
      {
       model: MUser,
       as: "approver",
       attributes: ["nik", "nama"],
      },
      {
       model: MApprovalSteps,
       as: "approvalStep",
       attributes: ["id", "step_order", "approver_name", "description"],
      },
     ],
    },
   ],
   order: [[{ model: MApprovals, as: "approvals" }, "step_order", "ASC"]],
  });

  if (!visitor) {
   return res.status(404).json({ error: "Visitor tidak ditemukan." });
  }

  // ✅ Cek semua approvals status
  const allDone =
   visitor.approvals && visitor.approvals.every((a) => a.status === "done");

  if (!allDone) {
   return res.status(403).json({
    error: "Visitor belum mendapatkan semua persetujuan (status belum done).",
   });
  }

  return res.json(visitor);
 } catch (error) {
  console.error(error);
  return res.status(500).json({ error: "Internal server error." });
 }
};
