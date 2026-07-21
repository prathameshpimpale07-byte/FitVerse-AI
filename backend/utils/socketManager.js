// utils/socketManager.js
// Global socket.io instance — import this to emit to users from anywhere in the backend.

let _io = null;

// key: userId string → Set of socket IDs
const userSockets = new Map();

const initSocket = (io) => {
  _io = io;

  io.on('connection', (socket) => {
    console.log(`[Socket] Client connected: ${socket.id}`);

    // Client sends their userId after connecting
    socket.on('register', (userId) => {
      if (!userId) return;
      socket.userId = userId;

      if (!userSockets.has(userId)) userSockets.set(userId, new Set());
      userSockets.get(userId).add(socket.id);

      console.log(`[Socket] User registered: ${userId} → ${socket.id}`);
      socket.emit('registered', { socketId: socket.id });
    });

    socket.on('disconnect', () => {
      const { userId } = socket;
      if (userId && userSockets.has(userId)) {
        userSockets.get(userId).delete(socket.id);
        if (userSockets.get(userId).size === 0) userSockets.delete(userId);
      }
      console.log(`[Socket] Client disconnected: ${socket.id}`);
    });
  });
};

/**
 * Emit a notification event to a specific user across all their open tabs.
 * @param {string} userId - MongoDB ObjectId as string
 * @param {object} notification - the saved Notification document
 */
const emitNotification = (userId, notification) => {
  if (!_io) return;
  const sockets = userSockets.get(userId?.toString());
  if (sockets && sockets.size > 0) {
    sockets.forEach((socketId) => {
      _io.to(socketId).emit('notification:new', notification);
    });
  }
};

module.exports = { initSocket, emitNotification };
