import MCarDriver from "../../model/car/MCarDriver.js";
import MMasterCar from "../../model/car/MMasterCar.js";
import { getDriverById } from "../Driver/getDriverById.js";

export const getMasterCarDriver = async (req, res) => {
 const { ret } = req.body;

 try {
  const Cars = await MCarDriver.findAll({
   include: [
    { association: 'carLinked' },
    { association: 'driverLinked' }
   ]
  });
  if (ret === 'ret') {
   return (Cars)
  } else {
   res.status(200).json(Cars);
  }
 } catch (error) {
  
  if (ret === 'ret') {
   return ({ error: 'Gagal mengambil data Car.' });
  } else {
   res.status(400).json({ error: 'Gagal mengambil data Car.' });
  }

 }
}