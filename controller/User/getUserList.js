import MUser from "../../model/MUser.js"

export const getUserList = async (req, res) => {
 const { ret } = req.body;
 try {
  // Ambil hanya field yang diperlukan untuk optimasi
  const users = await MUser.findAll({
   raw: true,
   nest: true,
   attributes: ['nik', 'nama', 'dept'] // sesuaikan dengan kebutuhan
  });

  if (ret === 'ret') {
   return users;
  } else {
   return res.status(200).json(users);
  }
 } catch (error) {
  // Log error untuk debugging
  console.error("Gagal mengambil daftar user:", error);
  if (ret === 'ret') {
   return { status: 0, msg: "Gagal mengambil daftar user", error: error.message };
  } else {
   return res.status(500).json({ msg: "Gagal mengambil daftar user", error: error.message });
  }
 }
}