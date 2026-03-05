import MMasterTime from "../../model/time/MMasterTime.js";

export const findTimeByHour = async (req, res) => {
 const { ret, time_start } = req.body;
 
 try {
  const find = await MMasterTime.findOne({
   raw: true,
   nest: true,
   where: { time_start }
  });

  if (!find) {
   const notFoundResponse = { message: "Time not found" };
   return ret ? notFoundResponse : res.status(404).json(notFoundResponse);
  }

  return ret ? find : res.status(200).json(find);
 } catch (error) {
  console.error("Error finding time by ID:", error);
  const errorResponse = { message: "Internal server error" };
  return ret ? errorResponse : res.status(500).json(errorResponse);
 }
};
