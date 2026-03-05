import MApprovals from "../../model/approval/MApproval.js";
import MApprovalSteps from "../../model/approval/MApprovalSteps.js";
import MJabatan from "../../model/approval/MJabatan.js";
import MUser from "../../model/MUser.js";
import { findUserByNik } from "../User/findUserByNIK.js";

export const getApprovalById = async (req, res) => {
 const { ret, token } = req.body;

 try {
  // Ambil semua langkah approval yang relevan dengan urutan
  const approvalSteps = await MApprovalSteps.findAll({
   order: [['step_order', 'ASC']],
   include: [{ model: MUser, as: 'approver', attributes: ['nik', 'nama', 'dept'] }],
   raw: true,
   nest: true
  });

  // Ambil semua approval yang terkait dengan token sekaligus
  const approvals = await MApprovals.findAll({
   where: { token },
   raw: true
  });

  const nikReq = approvals[0].approver_name
  const requester = await findUserByNik({
   body: { nik: nikReq, ret: "ret" }
  });

  // Gabungkan status approval ke setiap langkah
  const stepsWithStatus = await Promise.all(
   approvalSteps.map(async (step) => {
    const stepOrder = Number(step.step_order);
    const approval = approvals.find(
     (a) => Number(a.step_order) === stepOrder
    );

    let approverData = null;

    if (approval?.approver_name) {
     approverData = requester
    }

    if (stepOrder === 2) {
     try {
      const deptHeadData = await MJabatan.findOne({
       where: { dept: requester.dept },
       raw: true
      });

      if (deptHeadData) {
       approverData = await findUserByNik({
        body: { nik: deptHeadData.dept_head, ret: "ret" }
       });
       // approverData = deptHeadData;
      }
     } catch (error) {
      console.error("Error fetching dept head:", error);
     }
    }
    if (stepOrder === 5) {
     // 
     

    }


    return {
     ...step,
     status: approval?.status ?? false,
     approved_at: approval?.approved_at ?? null,
     notes: approval?.notes ?? null,
     approver: approverData ?? step.approver
    };
   })
  );
  // 

  if (ret === 'ret') {
   return stepsWithStatus;
  } else {
   // return res.status(200).json(stepsWithStatus);
  }
 } catch (error) {
  console.error("Error fetching approval steps:", error);
  return res.status(500).json({ message: `Internal server error: ${error}` });
 }
};
