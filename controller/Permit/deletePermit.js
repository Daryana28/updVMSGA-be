// PATH: backend/src/controllers/permit/deletePermit.js

export const deletePermit = async (req, res) => {
  try {
    const { id } = req.params;
    
    const permit = await req.db.Permit.findOne({ where: { id: parseInt(id) } });
    if (!permit) {
      return res.status(404).json({ success: false, msg: 'Permit tidak ditemukan' });
    }

    await permit.destroy();
    req.io.emit('permit_update', { action: 'deleted', id: parseInt(id) });

    res.json({
      success: true,
      msg: 'Permit berhasil dihapus'
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      msg: 'Gagal menghapus permit',
      error: error.message 
    });
  }
};