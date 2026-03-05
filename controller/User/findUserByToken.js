import MUser from "../../model/MUser.js";

export const findUserByToken = async (req, res) => {
  try {
    const user = await MUser.findOne({
      attributes: ['nik', 'nama', 'dept'],
      where: { nik: req.user.nik },
      raw: true
    });

    if (!user) {
      return res.status(404).json({ status: 0, msg: "User tidak ditemukan" });
    }

    user.nik = Number(user.nik);
    
    if (req.body?.ret === 'ret') {
      return user;
    } else {
      res.status(200).json(user);
    }
  } catch (err) {
   
   
    return res.status(500).json({ status: 0, msg: "Internal Server Error" });
  }
};