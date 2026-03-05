import axios from 'axios';
import moment from 'moment';
import MReqCar from "../../model/car/MReqCar.js";
import { getCarById } from './getCarById.js';
import { findTimeByHour } from '../time/findTimeByHour.js';
import { findUserByNik } from '../User/findUserByNIK.js';
import { findTimeById } from '../time/findTimeById.js';
import { getCarByToken } from './getCarByTNKB.js';

const formatTime = (time) => time ? moment(time, 'HH:mm:ss').format('HH:00:00') : null;
const formatDate = (date) => date ? moment(date).format('YYYY-MM-DD') : null;


// Optimasi: parallel request, error handling lebih baik, dan mapping lebih jelas
const getCarAndUser = async (carId, user, timeStart, timeEnd) => {
 try {
  // Jalankan request secara paralel untuk efisiensi
  const [car, timeStartObj, timeEndObj] = await Promise.all([
   getCarById({ body: { ret: 'ret', carId } }).catch(() => null),
   findTimeById({ body: { ret: 'ret', timeid: timeStart } }).catch(() => null),
   findTimeById({ body: { ret: 'ret', timeid: timeEnd } }).catch(() => null),
  ]);

  return {
   car: car || {},
   user: user || {},
   timeStart: timeStartObj || {},
   timeEnd: timeEndObj || {},
  };
 } catch (err) {
  // Jika error, kembalikan objek kosong agar tidak crash
  return { car: {}, user: user || {}, timeStart: {}, timeEnd: {} };
 }
};

const mapLocalSchedule = async (item) => {
 // Ambil data car, user, timeStart, timeEnd secara paralel & aman
 const { car, user, timeStart, timeEnd } = await getCarAndUser(item.carId, item.user, item.min, item.max);

 return {
  requestToken: item?.requestToken ?? item?.id ?? null,
  tokenKomo: item?.tokenKomo ?? null,
  date: formatDate(item?.date),
  carId: car?.carId ? Number(car.carId) : (item?.carId ? Number(item.carId) : null),
  penumpang: item?.penumpang ?? null,
  min: item?.min ? Number(item.min) : (timeStart?.timeid ? Number(timeStart.timeid) : null),
  timeStart: moment(timeStart?.time_start).utc().format('HH:mm') ?? null,
  max: item?.max ? Number(item.max) : (timeEnd?.timeid ? Number(timeEnd.timeid) : null),
  timeEnd: moment(timeEnd?.time_end).utc().format('HH:mm') ?? null,
  perihal: item?.perihal ?? item?.notes ?? null,
  tujuan: item?.tujuan ?? item?.destination ?? null,
  nik: item?.nik ?? user?.nik ?? null,
  nama: user?.nama ?? null,
  dept: user?.dept ?? null,
  status: item?.status ?? null,
  car
 };
};

const mapKomoSchedule = async (item) => {
 try {
  // Optimasi: formatTime hanya dipanggil sekali untuk masing-masing waktu
  const startTime = moment(item?.startDate).format('HH:00:00');
  const endTime = moment(item?.endDate).format('HH:00:00');
  // 
  
  // Promise.all untuk parallel request, error handling lebih spesifik
  const [min, max, car, user] = await Promise.all([
   findTimeByHour({ body: { ret: 'ret', time_start: startTime } }).catch(() => null),
   findTimeByHour({ body: { ret: 'ret', time_start: endTime } }).catch(() => null),
   getCarByToken({ body: { ret: 'ret', tnkb: item?.vehicleNumber } }).catch(() => null),
   findUserByNik({ body: { ret: 'ret', nik: item?.nik } }).catch(() => null),
  ]);
  
  // Cek apakah requestToken sudah ada di database lokal
  const existingReq = await MReqCar.findOne({ where: { requestToken: item?.id } });

  // Jika belum ada, mapping data komo
  if (!existingReq) {
   return {
    requestToken: item?.id ?? null,
    tokenKomo: item?.id ?? null,
    date: formatDate(item?.startDate),
    carId: car?.carId ? Number(car.carId) : null,
    penumpang: null,
    min: min?.timeid ? Number(min.timeid) : null,
    timeStart: moment(min?.time_start).utc().format('HH:mm') ?? null,
    max: max?.timeid ? Number(max.timeid) : null,
    timeEnd: moment(max?.time_start).utc().format('HH:mm') ?? null,
    perihal: item?.notes ?? null,
    tujuan: item?.destination ?? null,
    nik: item?.nik ?? null,
    nama: user?.nama ?? null,
    dept: user?.dept ?? null,
    status: item?.status ?? null,
    car
   };
  }
  // Jika sudah ada, return null agar bisa difilter di pemanggil
  return null;
 } catch (error) {
  // Logging error untuk debugging
  console.error('Gagal memetakan data Komo:', error);
  return {};
 }
};

export const getScheduleCar = async (req, res) => {
 const { date } = req.body;

 if (!date) {
  return res.status(400).json({ msg: 'Tanggal wajib diisi' });
 }

 try {
  const localRaw = await MReqCar.findAll({
   raw: true,
   nest: true,
   where: { date },
   include: [{ association: 'user', required: false }]
  });

  const localScheduleCar = await Promise.all(localRaw.map(mapLocalSchedule));

  let komoScheduleCar = [];
  try {
   const { data } = await axios.post(
    // 'https://sikomo.ragdalion.com:61524/api/koito/sync-official-travel/get',
    'https://sikomo.ragdalion.com:61524/api/koito/sync-official-travel/get',
    { date }
   );

   if (Array.isArray(data?.data)) {
    komoScheduleCar = await Promise.all(data.data.map(mapKomoSchedule));
   }
  } catch (err) {
   console.error('Gagal mengambil data dari Komo:', err.message);
  }

  return res.status(200).json({
   date,
   localScheduleCar,
   komoScheduleCar
  });

 } catch (error) {
  console.error('Terjadi kesalahan pada server:', error);
  return res.status(500).json({ msg: 'Terjadi kesalahan pada server' });
 }
};
