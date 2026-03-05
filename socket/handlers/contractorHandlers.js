// socket/handlers/contractorHandlers.js

export const setupContractorHandlers = (io, socket) => {
  // Handler untuk mendengarkan permintaan refresh manual dari client
  socket.on('contractor:request:refresh', () => {
    
    // Broadcast ke semua client agar melakukan fetch ulang
    io.emit('contractor-data-changed', { 
      type: 'MANUAL_REFRESH', 
      timestamp: Date.now() 
    });
  });

  // Client bisa bergabung ke room khusus kontraktor untuk segmentasi pesan
  socket.on('contractor:join', () => {
    socket.join('contractor-room');
    
  });
};