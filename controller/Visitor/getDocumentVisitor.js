import MVisitorImage from "../../model/visitor/MVisitorImage.js";

export const getDocumentVisitor = async (req, res) => {
 try {
  const { id } = req.params;
  const doc = await MVisitorImage.findOne({
   where: { id },
   raw: true, nest: true
  });

  if (!doc) {
   return res.status(404).json({ success: false, message: "File tidak ditemukan" });
  }


  const mimeType = doc.mimeType;
  const fileName = doc.name;

  // PDF & image → inline, selain itu download
  const isInline =
   mimeType === "application/pdf" || mimeType.startsWith("image/");
  

  res.setHeader("Content-Type", mimeType);
  res.setHeader(
   "Content-Disposition",
   `${isInline ? "inline" : "attachment"}; filename="${encodeURIComponent(fileName)}"`
  );

  // kirim buffer
  const buffer = Buffer.isBuffer(doc.files) ? doc.files : Buffer.from(doc.files);
  return res.end(buffer); // atau res.send(buffer)
 } catch (err) {
  console.error("Error getDocumentVisitor:", err);
  return res.status(500).json({ success: false, message: "Gagal mengambil file" });
 }
};
