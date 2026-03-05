import { Op, Sequelize } from "sequelize";
import db from "../../model/index.js";
import moment from "moment";

const {
 ContractorPermit,
 ContractorWorker,
 MPermitImage,
 MApprovals,
 MApprovalSteps,
 MJabatanDetail,
 MUser,
} = db;

const mapApprovalStatus = (approvals = []) => {
 const norm = v => (v ? String(v).toUpperCase() : null);
 const byStep = (order) =>
  norm(approvals.find(a => a.step_order === order)?.status);

 return {
  status_dept_head: byStep(2),
  status_ga: byStep(3),
  status_hrga: byStep(4),
  status_approval: approvals.some(a => norm(a.status) === "REJECTED")
   ? "REJECTED"
   : approvals.every(a => norm(a.status) === "APPROVED")
    ? "APPROVED"
    : "WAITING",
 };
};

export const getPermitList = async (req, res) => {
 const nik = String(req.user.nik || "").trim();
 const { dept } = req.user;
 const { startDate, endDate } = req.body;

 const start = moment(startDate).startOf("day").toDate();
 const end = moment(endDate).endOf("day").toDate();

 try {
  const userRoles = await MJabatanDetail.findAll({
   where: { nik },
   attributes: ["nik", "jabatan", "dept"],
   raw: true,
  });

  const identities = [
   dept,
   ...userRoles.map(r => r.jabatan),
   ...userRoles.map(r => r.dept),
  ].filter(Boolean);

  const uniqueIdentities = [...new Set(identities)];

  let permits = await ContractorPermit.findAll({
   where: {
    [Op.or]: [
     { tgl_mulai: { [Op.between]: [start, end] } },
     { tgl_akhir: { [Op.between]: [start, end] } },
     { tgl_mulai: { [Op.lte]: start }, tgl_akhir: { [Op.gte]: end } },
    ],
   },
   attributes: { exclude: ["updated_at"] },
   include: [
    {
     model: MUser,
     as: "user",
     attributes: ["nik", "nama", "dept"]
    },
    {
     model: MUser,
     as: "picUserDetail",
     attributes: ["nik", "nama", "dept"]
    },
    {
     model: MUser,
     as: "picHseDetail",
     attributes: ["nik", "nama", "dept"]
    },
    {
     model: ContractorWorker,
     as: "workers",
     attributes: ["id", "nama_pekerja", "identitas_no", "status_absensi"],
     include: [
      {
       model: MPermitImage,
       as: "images",
       attributes: ["id", "name", "originalName", "mimeType", "file_size"],
      },
     ],
    },
    {
     model: MApprovals,
     as: "approvals",
     include: [
      { model: MApprovalSteps, as: "approvalStep" },
      { 
        model: MUser, 
        as: "approver", 
        attributes: ["nama", "dept", "nik"],
        required: false 
      },
      {
       model: MJabatanDetail,
       as: "jabatanDetails",
       required: false,
       on: {
        [Op.and]: [
         Sequelize.where(
          Sequelize.fn("RTRIM", Sequelize.fn("LTRIM", Sequelize.cast(Sequelize.col("approvals.approver_name"), 'NVARCHAR'))),
          Op.eq,
          Sequelize.fn("RTRIM", Sequelize.fn("LTRIM", Sequelize.col("approvals->jabatanDetails.dept")))
         ),
         Sequelize.where(
          Sequelize.fn("RTRIM", Sequelize.fn("LTRIM", Sequelize.col("approvals.role"))),
          Op.eq,
          Sequelize.fn("RTRIM", Sequelize.fn("LTRIM", Sequelize.col("approvals->jabatanDetails.jabatan")))
         ),
        ],
       },
      },
     ],
    },
   ],
   order: [["tgl_mulai", "DESC"]],
  });

  permits = permits.filter(p => {
   if (!p?.approvals) return true;
   return !p.approvals.some(a => String(a.status || "").toUpperCase() === "REJECTED");
  });

  if (dept && !["HR GA DEPT", "GA DEPT"].includes(dept)) {
   permits = permits.filter(p => {
    const creatorNik = String(p.created_by || "").trim();
    const isOwner = creatorNik === nik || p.user?.dept === dept;
    const isInFlow = p.approvals && p.approvals.some(
      a => uniqueIdentities.includes(a.approver_name) || uniqueIdentities.includes(a.role)
     );
    return isOwner || isInFlow;
   });
  }

  const response = permits.map(p => {
   const json = p.toJSON();
   json.pic_user = json.picUserDetail || json.pic_user;
   json.pic_hse = json.picHseDetail || json.pic_hse;

   if (json.user) json.user.nik = String(json.user.nik || "").trim();

   if (json.approvals) {
    json.approvals = json.approvals.map(app => ({
     ...app,
     approver_real_name: app.approver?.nama || app.approver_name,
     approver_real_dept: app.approver?.dept || null
    }));
   }

   return { ...json, ...mapApprovalStatus(json.approvals) };
  });

  return res.json(response);
 } catch (error) {
  console.error("Error getPermitList:", error);
  return res.status(500).json({ error: `Internal Server Error: ${error.message}` });
 }
};

export default { getPermitList };