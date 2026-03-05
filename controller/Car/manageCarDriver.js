import MCarDriver from "../../model/car/MCarDriver.js";

export const manageCarDriver = async (req, res) => {
  try {
    const { action, id, carId, driverId, supplier, tnkb, merk, kapasitas, status, driverAlamat, driverTlp } = req.body;

    if (!action) {
      return res.status(400).json({ success: false, message: "Parameter 'action' wajib diisi" });
    }

    if (action !== "delete" && (!carId || !driverId)) {
      return res.status(400).json({ success: false, message: "carId dan driverId wajib diisi" });
    }

    let result;

    switch (action) {
      case "add":
        result = await MCarDriver.create({
          carId,
          driverId,
          supplier,
          tnkb,
          merk,
          kapasitas,
          status,
          driverAlamat,
          driverTlp,
        });
        break;

      case "edit":
        if (!id) return res.status(400).json({ success: false, message: "ID data wajib untuk edit" });

        result = await MCarDriver.update(
          {
            carId,
            driverId,
            supplier,
            tnkb,
            merk,
            kapasitas,
            status,
            driverAlamat,
            driverTlp,
          },
          { where: { id } }
        );
        break;

      case "delete":
        if (!id) return res.status(400).json({ success: false, message: "ID data wajib untuk delete" });

        result = await MCarDriver.destroy({ where: { id } });
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
    console.error("manageCarDriver Error:", error);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server.",
      error: error.message,
    });
  }
};