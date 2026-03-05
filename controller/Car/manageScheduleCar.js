import axios from "axios";
import MReqCar from "../../model/car/MReqCar.js";

export const manageScheduleCar = async (req, res) => {
 const {
  requestToken,
  item,
  action,
  dari,
  date,
  perihal,
  tujuan,
  nik,
  min,
  max
 } = req.body;

 // DEBUGGING: Log incoming request
 console.log(`[DEBUG] Action: ${action}, Token: ${requestToken}`);
 console.log(req.body);

 if (!requestToken || !action) {
  return res.status(400).json({ message: "Data tidak lengkap" });
 }

 try {
  let result;

  switch (action) {
   /**
    * ==========================
    * TAMBAH REQUEST MOBIL BARU
    * ==========================
    */
   case "add":
    try {
     const newReq = await MReqCar.create({
      requestToken,
      tokenKomo: null,
      date,
      carId: null,
      penumpang: null,
      min,
      max,
      perihal,
      tujuan,
      nik,
      status: "WAITING",
      userNIK: null,
     });

     return res.status(201).json({
      message: "Request mobil berhasil dibuat",
      data: newReq,
     });
    } catch (err) {
     console.error("❌ Gagal membuat request mobil:", err);
     return res
      .status(500)
      .json({ message: "Terjadi kesalahan saat membuat request mobil" });
    }

   /**
    * ==========================
    * HAPUS REQUEST MOBIL
    * ==========================
    */
   case "delete":
    result = await MReqCar.destroy({ where: { requestToken } });
    if (result) {
     return res
      .status(200)
      .json({ message: "Request mobil berhasil dihapus" });
    }
    return res
     .status(404)
     .json({ message: "Request token tidak ditemukan" });

   /**
    * ==========================
    * CANCEL BOOKING MOBIL
    * ==========================
    */
   case "cancel":
    result = await MReqCar.update(
     { carId: null, status: "WAITING" },
     { where: { requestToken } }
    );

    if (result[0] > 0) {
     await syncToKomo(requestToken, {
      driverName: "null",
      driverPhone: "null",
      vehicleNumber: "null",
      passengers: "null",
      syncScheduleDriver: "null",
     });
     return res
      .status(200)
      .json({ message: "Jadwal mobil berhasil dibatalkan" });
    }
    return res
     .status(404)
     .json({ message: "Request token tidak ditemukan atau tidak ada perubahan" });

   /**
    * ==========================
    * DROP (BOOKING) MOBIL
    * ==========================
    */
   case "drop":
    if (!item?.carId) {
     return res.status(400).json({ message: "carId tidak ditemukan" });
    }

    const existingReq = await MReqCar.findOne({ where: { requestToken } });
    let updateSuccess = false;

    if (!existingReq) {
     const created = await MReqCar.create({
      requestToken,
      tokenKomo: null,
      date,
      carId: item.carId,
      min,
      max,
      perihal,
      tujuan,
      nik,
      status: "BOOKED",
     });
     if (created) updateSuccess = true;
    } else {
     const [rowsUpdated] = await MReqCar.update(
      { carId: item.carId, status: "BOOKED" },
      { where: { requestToken } }
     );
     if (rowsUpdated > 0) updateSuccess = true;
    }

    if (!updateSuccess) {
     return res
      .status(404)
      .json({ message: "Gagal update jadwal mobil atau request tidak ditemukan" });
    }

    // Validasi data driver dan kendaraan menggunakan driverDetail
    const driver = item?.driverDetail;
    if (!driver?.nama || !driver?.tlp || !item?.tnkb) {
     console.error("[DEBUG] Validation Failed:", { driver, tnkb: item?.tnkb });
     return res
      .status(400)
      .json({ message: "Data driver atau kendaraan tidak lengkap" });
    }

    const syncPayload = {
     driverName: driver.nama || "",
     driverPhone: driver.tlp || "",
     vehicleNumber: item.tnkb || "",
     passengers: "",
     syncScheduleDriver: "",
    };

    // DEBUGGING: Log before sync
    console.log(`[DEBUG] Syncing to Komo with payload:`, syncPayload);
    await syncToKomo(requestToken, syncPayload);

    return res
     .status(200)
     .json({ message: "Jadwal mobil berhasil diupdate" });

   /**
    * ==========================
    * DEFAULT: AKSI TIDAK DIKENALI
    * ==========================
    */
   default:
    return res.status(400).json({ message: "Aksi tidak dikenali" });
  }
 } catch (error) {
  console.error("💥 Terjadi error di manageScheduleCar:", error);
  return res.status(500).json({ message: "Terjadi kesalahan pada server" });
 }
};

/**
 * ==========================
 * FUNGSI HELPER UNTUK SYNC KE KOMO
 * ==========================
 */
async function syncToKomo(requestToken, payload) {
 try {
  const response = await axios.post(
   `https://sikomo.ragdalion.com:61524/api/koito/sync-official-travel/${requestToken}`,
   payload
  );
  console.log(`[DEBUG] Komo Sync Response:`, response.data);
 } catch (err) {
  console.warn("⚠️ Gagal sync ke Komo:", err.response?.data || err.message);
 }
}