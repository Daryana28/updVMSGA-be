import { Op } from "sequelize";
import MRequestRoom from "../../model/room/MRequestRoom.js";
import moment from 'moment';
import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";
import MRoomStandard from "../../model/room/MRoomStandard.js";
import { findTimeById } from "../time/findTimeById.js";
import MUser from "../../model/MUser.js";

export const getScheduleRoom = async (req, res) => {
 const { ROOMID, startDate, endDate, nik, userDept } = req.body;

 if (!ROOMID || !startDate || !endDate) {
  return res.status(400).json({ message: "ROOMID, startDate, and endDate are required." });
 }

 const dateNow = moment().format('YYYY-MM-DD');

 try {
  const allRoomFacilities = await MRoomStandard.findAll({
   where: { idRom: ROOMID },
   raw: true
  });

  const cekLocking = await MRequestRoom.findAll({
   where: {
    status: 'BOOKED',
    tanggal: { [Op.lt]: dateNow }
   },
   include: [{
    model: MUser,
    as: 'user',
    attributes: ['nik', 'nama', 'dept']
   }],
   raw: true,
   nest: true
  });

  const getSchUserBooked = cekLocking.filter(item =>
   String(item.user?.dept) === String(userDept)
  );

  const result = {};

  // if (getSchUserBooked.length > 0) {
  //  for (const bk of getSchUserBooked) {
  //   const currentDate = bk.tanggal;

  //   const fac = bk.facility ? bk.facility.split(',').map(f => f.trim()).filter(f => f) : [];
  //   const pes = bk.peserta ? bk.peserta.split(',').map(p => p.trim()).filter(p => p) : [];

  //   const [facilityDetails, attnDetails, time_start, time_end] = await Promise.all([
  //    fac.length > 0 ? MMasterRoomStandard.findAll({ where: { stdId: { [Op.in]: fac } }, raw: true }) : [],
  //    pes.length > 0 ? MMasterRoomStandard.findAll({ where: { stdId: { [Op.in]: pes } }, raw: true }) : [],
  //    findTimeById({ body: { ret: 'ret', timeid: Number(bk.min) } }),
  //    findTimeById({ body: { ret: 'ret', timeid: Number(bk.max) } }),
  //   ]);

  //   const bookStatus = Number(bk.nik) === Number(nik) ? 'locked' : 'expired';

  //   const booking = {
  //    ...bk,
  //    nama: bk.user.nama,
  //    meetingFacility: facilityDetails,
  //    meetingAttn: attnDetails,
  //    roomFacility: allRoomFacilities,
  //    time_start: {
  //     value: time_start?.timeid || null,
  //     label: moment(time_start.time_start).format('HH:mm')
  //    },
  //    time_end: {
  //     value: time_end?.timeid || null,
  //     label: moment(time_end.time_start).format('HH:mm')
  //    },
  //    bookStatus
  //   };

  //   if (!result[currentDate]) {
  //    result[currentDate] = {
  //     bookStatus,
  //     data: [booking]
  //    };
  //   } else {
  //    result[currentDate].data.push(booking);
  //   }
  //  }

  //  return res.status(200).json(result);
  // } else {
   const dataToEnrich = await MRequestRoom.findAll({
    raw: true,
    nest: true,
    where: {
     tanggal: { [Op.between]: [startDate, endDate] },
     roomid: ROOMID,
     status: { [Op.not]: 'CANCEL' }
    },
    include: [{
     model: MUser,
     as: 'user',
     attributes: ['nik', 'nama', 'dept']
    }]
   });

   const start = moment(startDate);
   const end = moment(endDate);

   for (let d = start.clone(); d.isSameOrBefore(end); d.add(1, 'days')) {
    const currentDate = d.format('YYYY-MM-DD');
    const itemsForDate = dataToEnrich.filter(bk =>
     moment(bk.tanggal).format('YYYY-MM-DD') === currentDate
    );

    const bookings = await Promise.all(itemsForDate.map(async (bk) => {
     const fac = bk.facility ? bk.facility.split(',').map(f => f.trim()).filter(f => f) : [];
     const pes = bk.peserta ? bk.peserta.split(',').map(p => p.trim()).filter(p => p) : [];

     const [facilityDetails, attnDetails, time_start, time_end] = await Promise.all([
      fac.length > 0 ? MMasterRoomStandard.findAll({ where: { stdId: { [Op.in]: fac } }, raw: true }) : [],
      pes.length > 0 ? MMasterRoomStandard.findAll({ where: { stdId: { [Op.in]: pes } }, raw: true }) : [],
      findTimeById({ body: { ret: 'ret', timeid: Number(bk.min) } }),
      findTimeById({ body: { ret: 'ret', timeid: Number(bk.max) } }),
     ]);

     return {
      ...bk,
      nama: bk.user.nama,
      meetingFacility: facilityDetails,
      meetingAttn: attnDetails,
      roomFacility: allRoomFacilities,
      time_start: {
       value: time_start?.timeid || null,
       label: moment(time_start.time_start).utc().format('HH:mm')
      },
      time_end: {
       value: time_end?.timeid || null,
       label: moment(time_end.time_start).utc().format('HH:mm')
      },
      bookStatus: 'Available'
     };
    }));

    result[currentDate] = {
     bookStatus: bookings.length > 0 ? 'Available' : 'Empty',
     data: bookings
    };
   }

   return res.status(200).json(result);
  // }
 } catch (error) {
  console.error(error);
  return res.status(500).json({ message: "Internal server error.", error: error.message });
 }
};
