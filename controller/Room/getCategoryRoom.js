// controller/Room/getCategoryRoom.js - TAMBAH EXPORT LOGIC FUNCTION
import db from '../../model/index.js';

const getKategoriRoomLogic = async (user) => {
  try {
    const kategoriData = await db.MKategoriRoom.findAll({
      attributes: ['id', 'kat', 'show'],
      where: {
        show: { [db.Sequelize.Op.ne]: null }
      },
      include: [{
        model: db.MMasterRoom,
        as: 'rooms',
        attributes: ['roomId', 'nama', 'kapasitas', 'show'],
        where: {
          [db.Sequelize.Op.or]: [
            { show: null },
            { show: '1' }
          ]
        },
        required: false
      }],
      order: [
        ['kat', 'ASC'],
        [{ model: db.MMasterRoom, as: 'rooms' }, 'nama', 'ASC']
      ]
    });

    const data = kategoriData.map(kategori => ({
      id: kategori.id,
      kat: kategori.kat,
      show: kategori.show,
      rooms: (kategori.rooms || []).map(room => ({
        roomId: room.roomId,
        nama: room.nama,
        kapasitas: parseInt(room.kapasitas) || 0,
        show: room.show
      }))
    }));

    return data;
  } catch (error) {
    console.error('getKategoriRoomLogic error:', error);
    throw new Error(`Database error: ${error.message}`);
  }
};

export const getKategoriRoom = async (req, res) => {
  try {
    const data = await getKategoriRoomLogic(req.user);
    
    res.json({
      success: true,
      data: data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('getKategoriRoom API error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message || 'Internal server error',
      timestamp: new Date().toISOString()
    });
  }
};

// EXPORT LOGIC FUNCTION
export { getKategoriRoomLogic };