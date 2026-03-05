import MKategoriLoker from "../../model/locker/MKategoriLocker.js";

export const getKategoriLoker = async (req, res) => {
  try {
    const data = await MKategoriLoker.findAll({ raw: true, nest: true });

    // Optimasi: langsung kembalikan data jika dipanggil secara internal (ret=true)
    if (req.query.ret === 'true') {
      return data;
    }

    // Kembalikan response sukses dengan data
    res.status(200).json(data);
  } catch (error) {
    // Penanganan error yang lebih informatif
    res.status(500).json({ msg: error?.message || 'Terjadi kesalahan pada server.' });
  }
};