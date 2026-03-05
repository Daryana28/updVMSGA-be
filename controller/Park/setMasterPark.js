import MParkPerm from "../../model/park/MParkPerm.js";

export const setMasterPark = async (req, res) => {
 const {
   btn,
   PERMID,
   nik,
   nama,
   CARDID,
   TNKB,
   JENIS,
   STATUS,
   MULAI,
   AKHIR,
 } = req.body;

 try {
   let updateData = {};

   if (btn === 'upd') {
     updateData = {
       nik,
       nama,
       CARDID,
       TNKB,
       JENIS,
       STATUS,
       MULAI,
       AKHIR,
     };
   } else {
     updateData = {
       nik: 'KOSONG',
       nama: 'KOSONG',
       TNKB: '',
       JENIS: 'KOSONG',
       STATUS: 'KOSONG',
       MULAI: null,
       AKHIR: null,
     };
   }

   const save = await MParkPerm.update(updateData, {
     where: { PERMID },
   });

   if (save[0] > 0) {
     res.status(200).json({ msg: 'Success' });
   } else {
     res.status(400).json({ msg: 'No record updated' });
   }
 } catch (error) {
   console.error('Error updating master park:', error);
   res.status(500).json({ msg: 'Internal Server Error', error });
 }
};
