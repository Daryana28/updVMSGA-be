import MMasterCar from "../../model/car/MMasterCar.js";
import { getDriverById } from "../Driver/getDriverById.js";

export const getMasterCar = async (req, res) => {
  const { ret } = req.body || {};

  try {
    const cars = await MMasterCar.findAll({ raw: true });

    // Mapping untuk mengambil detail driver bagi setiap mobil
    const carsWithDriver = await Promise.all(
      cars.map(async (car) => {
        let driverData = null;
        
        // Membersihkan format "[18]" menjadi 18
        if (car.driver) {
          const driverId = car.driver.replace(/[\[\]]/g, ''); 
          
          // Memanggil fungsi getDriverById secara internal
          driverData = await getDriverById({ 
            body: { driverId, ret: 'ret' } 
          });
        }

        return {
          ...car,
          driverDetail: driverData // Data lengkap driver masuk ke properti ini
        };
      })
    );

    if (ret === 'ret') return carsWithDriver;
    return res.status(200).json({ data: carsWithDriver });

  } catch (error) {
    console.error("Error getMasterCarWithDriver:", error);
    if (ret === 'ret') return { error: 'Gagal mengambil data.' };
    res.status(400).json({ error: 'Gagal mengambil data.' });
  }
};