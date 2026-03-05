import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";

export const manageMasterStandard = async (req, res) => {
 const { standard, kategori, show, mode } = req.body
 try {
  switch (mode) {
   case "add": {
    const existingStd = await MMasterRoomStandard.findOne({ where: { standard } })
    if (existingStd) {
     return res.status(409).json({ message: "Standard dengan nama tersebut sudah ada." });
    }

    const newStd = await MMasterRoomStandard.create({
     standard,
     kategori,
    })

    return res.status(201).json(newStd)
   }
   case "edit": {
    const { id } = req.body;
    const stdToEdit = await MMasterRoomStandard.findByPk(id);
    if (!stdToEdit) {
     return res.status(404).json({ message: "Standard tidak ditemukan." });
    }
    
    // Cek jika standard baru sudah ada di data lain (kecuali dirinya sendiri)
    if (standard) {
     const existingStd = await MMasterRoomStandard.findOne({ 
      where: { 
       standard,
       id: { [MMasterRoomStandard.sequelize.Op.ne]: id }
      } 
     });
     if (existingStd) {
      return res.status(409).json({ message: "Standard dengan nama tersebut sudah ada." });
     }
    }
    
    await stdToEdit.update({
     standard: standard || stdToEdit.standard,
     kategori: kategori || stdToEdit.kategori,
     show: show !== undefined ? show : stdToEdit.show
    });
    
    return res.status(200).json(stdToEdit);
   }
   case "delete": {
    const { stdId } = req.body;
    const stdToDelete = await MMasterRoomStandard.findByPk(stdId);
    if (!stdToDelete) {
     return res.status(404).json({ message: "Standard tidak ditemukan." });
    }
    await stdToDelete.destroy();
    return res.status(200).json({ message: "Standard berhasil dihapus." });
   }
   
   default:
    return res.status(400).json({ message: "Mode tidak valid." });
  }
 } catch (error) {
  
  return res.status(500).json({ message: "Terjadi kesalahan server." });
 }
}