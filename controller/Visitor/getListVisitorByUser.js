import { Op, Sequelize } from "sequelize";
import MApprovals from "../../model/approval/MApproval.js";
import MJabatanDetail from "../../model/approval/MJabatanDetail.js";
import MUser from "../../model/MUser.js";
import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";
import MReqVisitor from "../../model/visitor/MReqVisitor.js";
import MVisitorAttendance from "../../model/visitor/MVisitorAttendance.js";
import MVisitorFacility from "../../model/visitor/MVisitorFacility.js";
import MApprovalSteps from "../../model/approval/MApprovalSteps.js";
import moment from "moment";
import MVisitorImage from "../../model/visitor/MVisitorImage.js";


export const getListVisitorByUser = async (req, res) => {
 const { nik, dept } = req.user;
 const { startDate, endDate } = req.body;
 const start = moment(startDate).startOf("day").toDate();
 const end = moment(endDate).endOf("day").toDate();

 try {
  let visitors = await MReqVisitor.findAll({
   where: {
    [Op.or]: [
     { startDate: { [Op.between]: [start, end] } },
     { endDate: { [Op.between]: [start, end] } },
     { startDate: { [Op.lte]: start }, endDate: { [Op.gte]: end } },
    ]
   },
   attributes: { exclude: ["updatedAt"] },
   include: [
    {
     model: MUser,
     as: "user",
     attributes: ["nik", "nama", "dept"],
    },
    {
     model: MVisitorAttendance,
     as: "attendances",
     include: [
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
      {
       model: MVisitorImage,
       as: "images",
       attributes: { exclude: ["files", "images"] },
      }
     ],
    },
    {
     model: MApprovals,
     as: "approvals",
     include: [
      {
       model: MJabatanDetail,
       as: "jabatanDetails",
       required: false,
       where: {
        dept: { [Op.eq]: Sequelize.col("approvals.approver_name") },
       },
      },
      {
       model: MApprovalSteps,
       as: "approvalStep",
       where: {
        [Op.or]: [
         { category: 'VISITOR' },
         { category: null } // Menangani step yang category-nya null
        ]
       },
      },
     ],
    },
   ],
   order: [["startDate", "DESC"]],
  });
  
  // 

  // Filter tambahan
  if (nik === 1008001) {
   // khusus nik 1008001, sembunyikan yang statusnya "rejected"
   visitors = visitors.filter(v =>
    !(v.approvals && v.approvals.some(a => a.status === "rejected"))
   );
  } else if (dept && dept !== "HR GA DEPT") {
   // kalau bukan HR GA, filter by dept
   visitors = visitors.filter(v => v.user?.dept === dept);
  }

  return res.json(visitors);
 } catch (error) {
  console.error(error);
  return res
   .status(500)
   .json({ error: `Terjadi kesalahan pada server ${error}` });
 }
};
