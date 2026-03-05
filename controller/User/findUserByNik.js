import MUser from "../../model/MUser.js";

export const findUserByNik = async (req, res) => {
 const { ret, nik } = req.body;

 // Validasi awal NIK
 if (!nik || nik.trim() === "" || isNaN(nik)) {
  const msg = "Format NIK tidak valid";
  if (ret === "ret") {
   return msg;
  } else {
   return res.status(400).json({ status: 0, msg });
  }
 }

 try {
  const user = await MUser.findOne({
   raw: true,
   nest: true,
   attributes: ["nik", "nama", "dept"],
   where: { nik },
  });
  
  if (!user) {
   if (ret === "ret") {
    return "kosong";
   } else {
    return res.status(404).json({ status: 0, msg: "User tidak ditemukan" });
   }
  }

  // Konversi nik ke number jika perlu
  user.nik = Number(user.nik);

  if (ret === "ret") {
   return user;
  } else {
   return res.status(200).json(user);
  }
 } catch (err) {
  if (ret === "ret") {
   return err;
  } else {
   return res.status(500).json({ msg: "Terjadi kesalahan pada server", err: err.message });
  }
 }
};