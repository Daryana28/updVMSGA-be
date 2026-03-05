import MMasterCar from "../../model/car/MMasterCar.js";

export const manageMasterCar = async (req, res) => {
  try {
    const { action, carId, supplier, tnkb, merk, kapasitas, driver, status } = req.body;

    if (!action) {
      return res.status(400).json({ success: false, message: "Parameter 'action' wajib diisi" });
    }

    let result;

    switch (action) {
      case "add":
        if (!tnkb || !merk) {
          return res.status(400).json({
            success: false,
            message: "tnkb, dan merk wajib diisi",
          });
        }

        result = await MMasterCar.create({
          carId,
          supplier,
          tnkb,
          merk,
          kapasitas,
          driver,
          status,
        });
        break;

      case "edit":
        if (!carId) {
          return res.status(400).json({
            success: false,
            message: "carId wajib diisi untuk edit",
          });
        }

        result = await MMasterCar.update(
          {
            supplier,
            tnkb,
            merk,
            kapasitas,
            driver,
            status,
          },
          { where: { carId } }
        );
        break;

      case "delete":
        if (!carId) {
          return res.status(400).json({
            success: false,
            message: "carId wajib diisi untuk delete",
          });
        }

        result = await MMasterCar.destroy({ where: { carId } });
        break;

      default:
        return res.status(400).json({ success: false, message: "Aksi tidak dikenali." });
    }

    res.json({
      success: true,
      message: `Aksi '${action}' berhasil dijalankan.`,
      data: result,
    });
  } catch (error) {
    console.error("manageMasterCar Error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};