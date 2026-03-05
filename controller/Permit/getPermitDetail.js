// PATH: backend/src/controllers/permit/getPermitDetail.js
import db from "../../model/index.js";

export const getPermitDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const permit = await db.ContractorPermit.findOne({ where: { id: parseInt(id) } });
    
    if (!permit) {
      return res.status(404).json({ success: false, msg: 'Permit tidak ditemukan' });
    }

    res.json({ success: true, permit });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      msg: 'Gagal mengambil detail permit',
      error: error.message 
    });
  }
};