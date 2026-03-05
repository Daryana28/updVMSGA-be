import MMasterDriver from "../../model/driver/MMasterDriver.js"

export const getDriverById = async (req, res) => {
  try {
    const { ret, driverId } = req.body;

    if (!driverId) {
      return res.status(400).json({ message: "driverId wajib diisi" });
    }

    const driver = await MMasterDriver.findOne({
      raw: true,
      nest: true,
      where: { driverId }
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver tidak ditemukan" });
    }

    if (ret === 'ret') {
      return driver;
    }

    return res.status(200).json({ data: driver });
  } catch (error) {
    console.error("Error getDriverById:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server" });
  }
};