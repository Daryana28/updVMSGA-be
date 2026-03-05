// controller/time/roomAvail.js
import moment from 'moment';
import MRequestRoom from "../../model/room/MRequestRoom.js";
import MMasterTime from "../../model/time/MMasterTime.js";

export const getRoomAvail = async (req, res) => {
 try {
  const { ret, roomid, tanggal } = req.body;

  if (!roomid || !tanggal) {
   return res.status(400).json({ 
    success: false, 
    message: "roomid dan tanggal diperlukan" 
   });
  }

  const bookedRequests = await MRequestRoom.findAll({
   raw: true,
   nest: true,
   attributes: ['min', 'max'],
   where: {
    roomid,
    tanggal,
    status: 'BOOKED'
   }
  });

  const masterTime = await MMasterTime.findAll({
   raw: true,
   nest: true,
   order: [['timeid', 'ASC']]
  });

  const allTimeIds = masterTime.map(mt => Number(mt.timeid));

  const notAvailableTimeIds = new Set();
  bookedRequests.forEach(req => {
   if (req.min && req.max) {
    for (let i = req.min; i <= req.max; i++) {
     notAvailableTimeIds.add(Number(i));
    }
   }
  });

  const availableTimeIds = allTimeIds.filter(id => !notAvailableTimeIds.has(id));

  const availableTimes = await MMasterTime.findAll({
   raw: true,
   nest: true,
   where: {
    timeid: availableTimeIds
   },
   order: [['timeid', 'ASC']]
  });

  const start = [];
  const end = [];

  availableTimes.forEach(time => {
   const timeid = Number(time.timeid);
   start.push({
    value: timeid,
    label: moment(time.time_start).utc().format('HH:mm')
   });
   end.push({
    value: timeid,
    label: moment(time.time_end).utc().format('HH:mm')
   });
  });

  if (ret === 'ret') {
   return { start, end };
  }

  return res.status(200).json({ start, end });
 } catch (error) {
  console.error("Error in getRoomAvail:", error);
  
  if (ret === 'ret') {
   throw error;
  }
  
  return res.status(500).json({ 
   success: false, 
   message: "Internal server error" 
  });
 }
};