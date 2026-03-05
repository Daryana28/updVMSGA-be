import MMasterLoker from "../../model/locker/MMasterLocker.js";

export const manageLocker = async (req, res) => {
 const { LOCKERID, NAME, NIK, NAMA, DEPT, STATUS_KARYAWAN, STATUS_LOKER } = req.body;

 try {
  // Jika NIK diberikan, cek apakah sudah terdaftar
  if (NIK) {
   const existingLocker = await MMasterLoker.findOne({ where: { NIK } });

   if (existingLocker) {
    return res.status(400).json({
     message: `NIK sudah terdaftar di locker ${existingLocker.NAME}`,
    });
   }
  }
  
  console.log({
   NIK,
   NAMA,
   DEPT,
   STATUS_KARYAWAN,
   STATUS_LOKER,
  });

  const newLocker = await MMasterLoker.update(
   {
    NAME,
    NIK,
    NAMA,
    DEPT,
    STATUS_KARYAWAN,
    STATUS_LOKER,
   }, { where: { LOCKERID } }
  );

  return res.status(200).json({
   message: "Locker berhasil didaftarkan.",
   data: newLocker,
  });
 } catch (error) {
  

  // console.error("Terjadi kesalahan saat mengelola locker:", error);
  return res.status(500).json({
   message: "Terjadi kesalahan pada server.",
   error: error.message,
  });
 }
};