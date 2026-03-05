// controller/Room/findMeetingRoomById.js
import db from "../../model/index.js";
const { MMasterRoom, MRoomStandard } = db;

export const findMeetingRoomById = async (req, res) => {
  const { ROOMID } = req.body;

  try {
    const room = await MMasterRoom.findOne({
      where: { roomId: ROOMID }, // Merujuk ke field 'ROOMID'
      attributes: ['roomId', 'nama', 'location', 'kapasitas', 'status'],
      include: [{
        model: MRoomStandard,
        as: "facilities",
        attributes: ['ID', 'ITEM', 'QTY']
      }]
    });

    if (!room) {
      return res.status(404).json({ message: "Data ruangan tidak ditemukan" });
    }

    // Kembalikan objek sesuai ekspektasi frontend (res.data)
    return res.status(200).json(room);

  } catch (error) {
    console.error("Error finding meeting room:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};