// be/controllers/room/RoomController.js
import db from "../../model/index.js"; // Import dari index.js agar relasi aktif
const { MMasterRoom, MKategoriRoom } = db;

export const getMasterMeetingRoom = async (req, res) => {
  // Gunakan default value agar tidak error jika req.body kosong
  const { ret } = req.body || {}; 
  
  
  try {
    const rooms = await MMasterRoom.findAll({
      include: [{
        model: MKategoriRoom,
        as: 'kategoriRoom',
        attributes: ['id', 'kat', 'tabs']
      }],
      order: [['nama', 'ASC']],
      nest: true,
      raw: true
    });

    if (ret === 'ret') return rooms;
    return res.status(200).json(rooms);

  } catch (error) {
    console.error("Error getMasterMeetingRoom:", error);
    const errorResponse = { 
        error: "Gagal mengambil data ruangan", 
        message: error.message 
    };
    
    if (ret === 'ret') return errorResponse;
    return res.status(500).json(errorResponse);
  }
};