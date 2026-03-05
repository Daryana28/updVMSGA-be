import MMasterTime from "../../model/time/MMasterTime.js";

export const getMasterTime = async (req, res) => {
 const { ret } = req.body; // atau req.query jika dikirim via URL
 
 try {
  const data = await MMasterTime.findAll({
   raw: true,
   nest: true,
   order: [['timeid', 'ASC']], // gunakan nama field sesuai model
  });

  // Jika digunakan secara internal
  if (ret === 'ret') {
   return data;
  }

  // Jika digunakan sebagai response API
  return res.status(200).json(data);

 } catch (error) {
  console.error('Error fetching master time:', error);
  return res.status(500).json({
   success: false,
   message: 'Terjadi kesalahan saat mengambil data master time',
   error: error.message,
  });
 }
};
