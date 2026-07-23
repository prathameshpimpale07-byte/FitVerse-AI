import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import api from '../services/api';

const NotificationContext = createContext(null);

const getSocketUrl = () => {
  const envUrl = import.meta.env.VITE_SOCKET_URL;
  if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    if (!envUrl || envUrl.includes('onrender.com')) {
      return 'http://localhost:5000';
    }
  }
  return envUrl || 'https://fitverse-ai-2.onrender.com';
};

const SOCKET_URL = getSocketUrl();

// ── Category emoji map ───────────────────────────────────────────────────────
const CATEGORY_EMOJI = {
  Workout: '🏋️', Diet: '🥗', Trainer: '👨‍🏫',
  AI: '🤖', System: '🌐',
};

const CATEGORY_COLOR = {
  Workout: '#7c3aed', Diet: '#059669', Trainer: '#2563eb',
  AI: '#9333ea', System: '#64748b',
};

export const NotificationProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const socketRef = useRef(null);

  // ── Fetch from DB on login ─────────────────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await api.get('/notifications');
      if (res?.success) {
        setNotifications(res.notifications || []);
        setUnreadCount(res.unreadCount || 0);
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => {
    if (user) fetchNotifications();
    else {
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [user, fetchNotifications]);

  // ── Socket.io connection ───────────────────────────────────────────────────
  useEffect(() => {
    if (!user || !token) {
      socketRef.current?.disconnect();
      socketRef.current = null;
      return;
    }

    const socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      auth: { token },
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id);
      socket.emit('register', user._id);
    });

    socket.on('registered', () => {
      console.log('[Socket] Registered for user:', user._id);
    });

    // 🔔 Real-time notification received
    socket.on('notification:new', (notif) => {
      console.log('[Socket] New notification:', notif);

      // Add to state
      setNotifications(prev => [notif, ...prev]);
      setUnreadCount(prev => prev + 1);

      // Show a premium in-app toast
      const emoji = CATEGORY_EMOJI[notif.category] || '🔔';
      const color = CATEGORY_COLOR[notif.category] || '#7c3aed';

      toast.custom(
        (t) => (
          <div
            onClick={() => toast.dismiss(t.id)}
            style={{ borderLeft: `4px solid ${color}` }}
            className={`bg-white dark:bg-slate-900 shadow-2xl rounded-2xl p-4 flex items-start gap-3 max-w-sm w-full cursor-pointer transition-all ${t.visible ? 'animate-enter' : 'animate-leave'}`}
          >
            <span className="text-2xl shrink-0">{emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-900 dark:text-white truncate">{notif.title}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{notif.description}</p>
            </div>
            <button className="text-slate-300 hover:text-slate-500 text-lg shrink-0" onClick={() => toast.dismiss(t.id)}>✕</button>
          </div>
        ),
        { duration: 5000, position: 'top-right' }
      );
    });

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected');
    });

    socket.on('connect_error', (err) => {
      console.warn('[Socket] Connection error:', err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, [user, token]);

  // ── Actions ────────────────────────────────────────────────────────────────
  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  };

  const markAllAsRead = async () => {
    try {
      await api.post('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch { /* silent */ }
  };

  const deleteNotification = async (id) => {
    const notif = notifications.find(n => n._id === id);
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
      if (notif && !notif.isRead) setUnreadCount(prev => Math.max(0, prev - 1));
    } catch { /* silent */ }
  };

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      fetchNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used inside NotificationProvider');
  return ctx;
};
