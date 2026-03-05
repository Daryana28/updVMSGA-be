import newHRGA from "../../config/db/newHRGA.js";
import MApprovals from "../../model/approval/MApproval.js";
import { Op } from "sequelize";
import moment from "moment";

export const manageApproval = async (req, res) => {
 const { token, step_order, action } = req.body;
 const { nik } = req.user;

 const approved_at = moment().format("YYYY-MM-DD HH:mm");

 try {
  const result = await newHRGA.transaction(async (transaction) => {
   // 1. Update current step
   const [updatedRows] = await MApprovals.update(
    {
     status: action === "reject" ? "rejected" : action, // ubah reject → rejected
     approved_at,
     notes: nik,
    },
    {
     where: {
      token,
      step_order,
     },
     transaction,
    }
   );

   if (updatedRows === 0) {
    throw new Error("Approval not found or already processed");
   }

   // 2. Jika approve → aktifkan step berikutnya
   if (action === "approve") {
    await MApprovals.update(
     { status: "active" },
     {
      where: {
       token,
       step_order: step_order + 1,
       status: "pending",
      },
      transaction,
     }
    );
   }

   // 3. Jika reject → hentikan semua step berikutnya
   if (action === "reject") {
    await MApprovals.update(
     { status: "rejected" },
     {
      where: {
       token,
       step_order: {
        [Op.gt]: step_order,
       },
       status: "pending",
      },
      transaction,
     }
    );
   }

   return updatedRows;
  });

  return res.status(200).json({
   success: true,
   message: `Approval ${action === "reject" ? "rejected" : action} berhasil`,
   updatedRows: result,
  });
 } catch (error) {
  console.error(error);
  return res.status(500).json({
   success: false,
   message: error.message || "Terjadi kesalahan saat memproses approval",
  });
 }
};
