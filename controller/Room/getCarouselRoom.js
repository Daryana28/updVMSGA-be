import MCarousel from "../../model/room/MCarousel.js";

export const getCarouselRoom = async (req, res) => {
 const { ret, roomId } = req.body;

 if (!roomId) {
  const errorMsg = { error: "roomId is required" };
  return ret !== 'ret' ? res.status(400).json(errorMsg) : errorMsg;
 }

 try {
  const carousels = await MCarousel.findAll({
   raw: true,
   nest: true,
   where: { IDROM: roomId }
  });

  return ret !== 'ret' ? res.status(200).json(carousels) : carousels;

 } catch (error) {
  const errorMsg = { error: "Failed to fetch carousel data", details: error.message };
  return ret !== 'ret' ? res.status(500).json(errorMsg) : error;
 }
};
