// socket/handlers/index.js
import jwt from 'jsonwebtoken';
import { setupRoomHandlers } from './roomHandlers.js.js';
import { setupContractorHandlers } from './contractorHandlers.js'; // Impor handler baru

export const setupSocketHandlers = (io) => {
  // Middleware autentikasi tetap sama
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) return next(new Error('Authentication error'));
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = { ...decoded, nik: String(decoded.nik) };
      next();
    } catch (err) {
      console.error('Socket auth error:', err.message);
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    // Logic join room berdasarkan NIK tetap dipertahankan
    const userNik = socket.user?.nik;
    if (userNik && typeof userNik === 'string' && userNik.trim()) {
      socket.join(`user:${userNik.trim()}`);
    }

    // Setup handlers yang sudah ada
    setupRoomHandlers(io, socket);

    // INTEGRASI BARU: Setup contractor handlers
    setupContractorHandlers(io, socket);

    socket.on('disconnect', () => {
      
    });
  });
};