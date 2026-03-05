import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";
import MRoomStandard from "../../model/room/MRoomStandard.js";
import { getMeetingRoom } from "./getMeetingRoom.js";

export const findMeetingStandardByIdRoom = async (req, res) => {
 const { ret, roomId } = req.body;

 try {
  const rooms = await getMeetingRoom({ body: { ret: 'ret' } });
  
  const roomWithStandards = await Promise.all(
   rooms.map(async (room) => {
    const standards = await MRoomStandard.findAll({
     raw: true,
     nest: true,
     where: {
      idrom: roomId,
     },
     include: [
      {
       model: MMasterRoomStandard,
       as: "standardDetail",
       attributes: ['kategori']
      },
     ],
    });

    return {
     ...room,
     facility: standards,
    };
   })
  );

  if (ret === 'ret') {
   return roomWithStandards; // kirim array objek room + facility
  } else {
   return res.json(roomWithStandards); // bungkus dalam response JSON
  }
 } catch (error) {
  if (ret === 'ret') {
   return error;
  } else {
   return res.status(500).json({ error: "Internal server error" });
  }
 }
};
