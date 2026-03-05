import { Op } from "sequelize";
import MRoomStandard from "../../model/room/MRoomStandard.js";

export const manageStandardRoom = async (req, res) => {
 const { mode, roomid, facilities } = req.body;

 if (!mode || !roomid || !Array.isArray(facilities)) {
  return res.status(400).json({ message: 'Data tidak lengkap' });
 }

 try {
  const getCurrent = await MRoomStandard.findAll({
   raw: true,
   nest: true,
   where: { idRom: roomid }
  });

  const currentMap = new Map(getCurrent.map(item => [item.item, item.qty]));
  const incomingMap = new Map(facilities.map(item => [item.item, item.qty ?? 0]));

  const toAdd = [];
  const toUpdate = [];
  const toDeleteItems = [];

  // Cek untuk tambah dan update
  for (const { item, qty = 0 } of facilities) {
   const existingQty = currentMap.get(item);
   if (existingQty === undefined) {
    toAdd.push({ idRom: roomid, item, qty });
   } else if (existingQty !== qty) {
    toUpdate.push({ item, qty });
   }
  }

  // Cek untuk delete
  const incomingItemsSet = new Set(facilities.map(f => f.item));
  for (const { item } of getCurrent) {
   if (!incomingItemsSet.has(item)) {
    toDeleteItems.push(item);
   }
  }

  // Eksekusi Tambah
  if (toAdd.length > 0) {
   await MRoomStandard.bulkCreate(toAdd);
  }

  // Eksekusi Update (paralel)
  await Promise.all(
   toUpdate.map(({ item, qty }) =>
    MRoomStandard.update(
     { qty },
     { where: { idRom: roomid, item } }
    )
   )
  );

  // Eksekusi Hapus
  if (toDeleteItems.length > 0) {
   await MRoomStandard.destroy({
    where: {
     idRom: roomid,
     item: { [Op.in]: toDeleteItems }
    }
   });
  }

  return res.json({
   message: 'Berhasil memproses data fasilitas',
   added: toAdd.length,
   updated: toUpdate.length,
   deleted: toDeleteItems.length
  });

 } catch (error) {
  console.error('Gagal memproses fasilitas:', error);
  return res.status(500).json({
   message: 'Terjadi kesalahan saat memproses data',
   error: error.message || error
  });
 }
};
