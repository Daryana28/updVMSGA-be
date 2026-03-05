import MMasterRoomStandard from "../../model/room/MMasterRoomStandard.js";

export const findMeetingStandardByKat = async (req, res) => {
 const { ret, kategori } = req.body;

 if (!kategori) {
  return res.status(400).json({ error: "Kategori is required." });
 }

 try {
  const results = await MMasterRoomStandard.findAll({
   raw: true,
   nest: true,
   where: { kategori }
  });

  if (ret === 'ret') {
   return results; // Return directly if used internally
  }

  return res.status(200).json(results); // Return as JSON response
 } catch (error) {
  console.error("Error fetching meeting standards:", error);
  return res.status(500).json({ error: "Internal server error." });
 }
};
