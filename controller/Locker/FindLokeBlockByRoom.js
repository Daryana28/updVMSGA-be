import MLokerBlock from "../../model/locker/MLockerBlock.js";

export const FindLokeBlockByRoom = async (req, res) => {
  const { ret, ROOM } = req.body;
  try {
    if (!ROOM) {
      return res.status(400).json({ msg: 'ROOM tidak boleh kosong' });
    }
    const data = await MLokerBlock.findAll({
      raw: true,
      nest: true,
      where: { ROOM },
      order: [['BLOCKID', 'ASC']]
    });
    if (ret === 'ret') {
      return data;
    } else {
      return res.status(200).json(data);
    }
  } catch (err) {
    if (ret === 'ret') {
      return 'err';
    } else {
      return res.status(500).json({ msg: err.message || 'Terjadi kesalahan pada server' });
    }
  }
};