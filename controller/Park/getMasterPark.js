import MMasterPark from "../../model/park/MMasterPark.js";

export const getMasterPark = async (req, res) => {
  try {
    const data = await MMasterPark.findAll({
      raw: true,
      nest: true,
    });

    // Jika ingin mengembalikan data (misal untuk unit test), gunakan query param ?ret=true
    if (req.query.ret === 'true') {
      return data;
    }

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error getMasterPark:', error);
    return res.status(500).json({ message: 'Terjadi kesalahan pada server.' });
  }
};