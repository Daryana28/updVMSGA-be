import MUser from "../../model/MUser.js";
import MParkPerm from "../../model/park/MParkPerm.js";

export const getParkListById = async (req, res) => {
 try {
  const { PARKID } = req.body;

  if (!PARKID) {
   return res.status(400).json({ message: 'PARKID wajib diisi' });
  }

  const parks = await MParkPerm.findAll({
   raw: true,
   nest: true,
   where: { PARKID }
  });

  if (!parks.length) {
   return res.status(404).json({ message: 'Data parkir tidak ditemukan' });
  }

  // Gantikan nik dan nama dari data user
  const enrichedParks = await Promise.all(parks.map(async (row) => {
   const user = await MUser.findOne({
    raw: true,
    where: { nama: row.nama }
   });

   return {
    ...row,
    nik: user?.nik || row.nik,
    nama: user?.nama || row.nama
   };
  }));

  return res.status(200).json(enrichedParks);
 } catch (error) {
  console.error('Error getParkListById:', error);
  return res.status(500).json({ message: 'Terjadi kesalahan pada server' });
 }
};
