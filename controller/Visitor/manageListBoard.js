import MBoardDetail from "../../model/visitor/MBoardDetail.js";
import MBoardVisitor from "../../model/visitor/MBoardVisitor.js";

export const manageListBoard = async (req, res) => {
 const { mode, dateStart, waktuStart, dateEnd, waktuEnd, details } = req.body
 console.log(req.body);
 
 // try {
 //  if (mode === "add") {
 //   const board = await MBoardVisitor.create({
 //    token: Math.random().toString(36).substring(2, 15),
 //    dateStart,
 //    waktuStart,
 //    dateEnd,
 //    waktuEnd,
 //    status: "Active"
 //   });
 //   const detail = await MBoardDetail.bulkCreate(
 //    details.map(item => ({
 //     token: Math.random().toString(36).substring(2, 15),
 //     name: item.name,
 //     company: item.company
 //    }))
 //   );
 //   return res.status(200).json({ action: "add", board, detail });
 //  }
 // } catch (error) {
 //  console.log(error);

 // }
}