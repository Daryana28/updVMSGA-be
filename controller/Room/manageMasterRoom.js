import MMasterRoom from "../../model/room/MMasterRoom.js";

export const manageMasterRoom = async (req, res) => {
 const { roomid, mode, nama, kapasitas, location, category, show } = req.body;
 
 try {
  // 1. Validasi dinamis: Nama hanya wajib jika bukan mode delete
  if (!mode || (mode !== "delete" && !nama)) {
   return res.status(400).json({ message: "Mode dan nama ruangan wajib diisi." });
  }

  // 2. Normalisasi nilai show ke string "1" atau "0" untuk konsistensi UI
  const statusValue = (show === "1" || show === 1 || show === true) ? "1" : "0";

  switch (mode) {
   case "add": {
    const existingRoom = await MMasterRoom.findOne({ where: { nama } });
    if (existingRoom) {
     return res.status(409).json({ message: "Ruangan dengan nama tersebut sudah ada." });
    }

    const newRoom = await MMasterRoom.create({
     nama,
     kapasitas,
     location,
     category: category || "", // DISESUAIKAN: Menggunakan field 'category' sesuai Index Model
     show: statusValue,
    });

    return res.status(201).json(newRoom);
   }

   case "edit": {
    const room = await MMasterRoom.findOne({ where: { roomId: roomid } });
    if (!room) {
     return res.status(404).json({ message: "Ruangan tidak ditemukan." });
    }

    await MMasterRoom.update(
     {
      nama,
      kapasitas,
      location,
      category: category || "", // DISESUAIKAN: Menggunakan field 'category' sesuai Index Model
      show: statusValue,
     },
     { where: { roomId: roomid } }
    );

    const updatedRoom = await MMasterRoom.findOne({ where: { roomId: roomid } });
    return res.status(200).json(updatedRoom);
   }

   case "delete": {
    const room = await MMasterRoom.findOne({ where: { roomId: roomid } });
    if (!room) {
     return res.status(404).json({ message: "Ruangan tidak ditemukan." });
    }

    await room.destroy();
    return res.status(200).json({ message: "Ruangan berhasil dihapus." });
   }

   default:
    return res.status(400).json({ message: "Mode tidak valid." });
  }
 } catch (error) {
  console.error("Error saat mengelola ruangan:", error);
  return res.status(500).json({ message: "Terjadi kesalahan pada server." });
 }
};