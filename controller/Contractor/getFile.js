// PATH: backend/src/controller/Contractor/getFile.js
import { MPermitImage } from "../../model/index.js";

export const getFile = async (req, res) => {
  try {
    const { id } = req.params;

    // Cari file by id atau name
    const fileRecord = await MPermitImage.findOne({
      where: { id: id }, // kalau pakai id
      // where: { name: filename }, // kalau pakai nama
    });

    if (!fileRecord) return res.status(404).json({ status: 404, msg: "File tidak ditemukan." });

    const { files, mimeType, originalName } = fileRecord;

    if (!files || !mimeType) return res.status(400).json({ status: 400, msg: "File tidak valid." });

    res.setHeader("Content-Type", mimeType);
    res.setHeader("Content-Disposition", `inline; filename="${originalName}"`);
    res.send(files);
  } catch (error) {
   
   
    console.error(error);
    res.status(500).json({ status: 500, msg: "Terjadi kesalahan server." });
  }
};
