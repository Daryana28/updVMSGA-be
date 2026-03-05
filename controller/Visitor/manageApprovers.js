import MJabatanDetail from "../../model/approval/MJabatanDetail.js";

export const manageApprovers = async (req, res) => {
 try {
  const { dept, jabatan, users } = req.body;

  if (!dept || !jabatan || !users) {
   return res.status(400).json({ message: "dept, jabatan.key, dan user.nik wajib diisi" });
  }

  const existing = await MJabatanDetail.findAll({
   where: { dept, jabatan: jabatan.key },
   raw: true,
   nest: true,
  });

  const existingNikList = existing.map(item => item.nik);
  const userNikList = users.map(user => user.nik);

  // ✅ Create: users yang belum ada di existing
  const toCreate = users.filter(user => !existingNikList.includes(user.nik));

  // ✅ Update: users yang sudah ada di existing
  const toUpdate = users.filter(user => existingNikList.includes(user.nik));

  // ✅ Delete: existing yang tidak ada di users
  const toDelete = existing.filter(item => !userNikList.includes(item.nik));

  // Eksekusi Create
  for (const user of toCreate) {
   await MJabatanDetail.create({
    dept,
    jabatan: jabatan.key,
    nik: user.nik,
   });
  }

  // Eksekusi Update
  for (const user of toUpdate) {
   await MJabatanDetail.update(
    { nik: user.nik }, // bisa tambahkan field lain jika perlu
    { where: { dept, jabatan: jabatan.key, nik: user.nik } }
   );
  }

  // Eksekusi Delete
  for (const item of toDelete) {
   await MJabatanDetail.destroy({
    where: { dept, jabatan: jabatan.key, nik: item.nik }
   });
  }

  return res.status(200).json({
   message: "Approvers berhasil disinkronisasi",
   created: toCreate.length,
   updated: toUpdate.length,
   deleted: toDelete.length,
  });

 } catch (error) {
  console.error("Error manageApprovers:", error);
  res.status(500).json({ message: "Terjadi kesalahan server", error: error.message });
 }
};
