// socket/handlers/roomHandlers.js
let roomsCache = null;
let cacheTimestamp = null;
const CACHE_TTL = 30000; // 30 seconds

export const setupRoomHandlers = (io, socket) => {
  socket.on('get:kategori:room', async (callback) => {
    try {
      if (!socket.user) {
        throw new Error('User not authenticated');
      }
      
      // Cache check
      const now = Date.now();
      if (roomsCache && cacheTimestamp && (now - cacheTimestamp) < CACHE_TTL) {
        socket.emit('kategori:room', {
          success: true,
          data: roomsCache,
          timestamp: new Date().toISOString(),
          cached: true
        });
        if (callback && typeof callback === 'function') {
          callback({ success: true, cached: true });
        }
        return;
      }
      
      // Deferred import untuk reduce startup time
      const { getKategoriRoomLogic } = await import('../../controller/Room/getCategoryRoom.js');
      const kategoriData = await getKategoriRoomLogic(socket.user);
      
      // Update cache
      roomsCache = kategoriData;
      cacheTimestamp = now;
      
      socket.emit('kategori:room', {
        success: true,
        data: kategoriData,
        timestamp: new Date().toISOString()
      });
      
      if (callback && typeof callback === 'function') {
        callback({ 
          success: true, 
          message: 'Room categories data sent successfully' 
        });
      }
    } catch (error) {
      console.error('[Socket] get:kategori:room error:', error.message);
      
      socket.emit('socket:error', {
        event: 'get:kategori:room',
        success: false,
        message: error.message || 'Failed to fetch room categories',
        timestamp: new Date().toISOString()
      });
      
      if (callback && typeof callback === 'function') {
        callback({ 
          success: false, 
          error: error.message || 'Internal server error' 
        });
      }
    }
  });

  socket.on('rooms:request:refresh', () => {
    // Invalidate cache
    roomsCache = null;
    cacheTimestamp = null;
    io.emit('rooms:refresh:required');
  });
};