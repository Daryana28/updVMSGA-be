import MMasterDriver from "../../model/driver/MMasterDriver.js";

export default async function getMasterDriver(req, res) {
 const { ret } = req.body

 try {
  const driver = await MMasterDriver.findAll();

  if (ret === 'ret') {
   return (driver)
  } else {
   res.status(200).json(driver);
  }
 } catch (error) {
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
 }
}
