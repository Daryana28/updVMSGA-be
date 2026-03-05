import MMasterCar from "../../model/car/MMasterCar.js"
import { getDriverById } from "../Driver/getDriverById.js";

export const getCarById = async (req, res) => {
 const { ret, carId } = req.body;

 try {
  const find = await MMasterCar.findOne({
   raw: true, nest: true,
   where: {
    carId
   }
  })
  if (find && find.driver) {
   try {
    const driverIds = JSON.parse(find.driver);
    const driverPromises = driverIds.map(async (dr) => {
     return await getDriverById({ body: { ret: 'ret', driverId: dr } });
    });
    find.driver = await Promise.all(driverPromises);
   } catch (err) {
    
    find.driver = null;
   }
  }

  if (ret === 'ret') {
   return find
  } else {
   return res.status(200).json(find)
  }
 } catch (error) {
  if (ret === 'ret') {
   return error
  } else {
   return res.status(400).json(error)
  }
 }
} 