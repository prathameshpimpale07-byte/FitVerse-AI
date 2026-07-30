import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import api from '../../services/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import isToday from 'dayjs/plugin/isToday';
import isYesterday from 'dayjs/plugin/isYesterday';

dayjs.extend(relativeTime);
dayjs.extend(isToday);
dayjs.extend(isYesterday);

// ── Category Config ──────────────────────────────────────────────────────────
const CATEGORIES = {
  Workout: {
    emoji: '🏋️',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-500/10',
    border: 'border-violet-200 dark:border-violet-500/30',
    dot: 'bg-violet-500',
    badge: 'bg-violet-100 text-violet-700 dark:bg-violet-500/20 dark:text-violet-300',
    glow: 'shadow-violet-500/10',
  },
  Diet: {
    emoji: '🥗',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-500/10',
    border: 'border-emerald-200 dark:border-emerald-500/30',
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    glow: 'shadow-emerald-500/10',
  },
  Trainer: {
    emoji: '👨‍🏫',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-500/10',
    border: 'border-blue-200 dark:border-blue-500/30',
    dot: 'bg-blue-500',
    badge: 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-300',
    glow: 'shadow-blue-500/10',
  },
  AI: {
    emoji: '🤖',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-500/10',
    border: 'border-purple-200 dark:border-purple-500/30',
    dot: 'bg-purple-500',
    badge: 'bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-300',
    glow: 'shadow-purple-500/10',
  },
  System: {
    emoji: '🌐',
    color: 'text-slate-600 dark:text-slate-400',
    bg: 'bg-slate-50 dark:bg-slate-800',
    border: 'border-slate-200 dark:border-slate-700',
    dot: 'bg-slate-400',
    badge: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
    glow: 'shadow-slate-500/10',
  },
};

const PRIORITY_CONFIG = {
  High: { label: '🔴 High', class: 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300' },
  Medium: { label: '🟡 Medium', class: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300' },
  Low: { label: '⚪ Low', class: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400' },
};

const FILTER_TABS = ['All', 'Unread', 'Workout', 'Diet', 'AI', 'Trainer', 'System'];

// ── Date Group Label ─────────────────────────────────────────────────────────
const getDateLabel = (date) => {
  const d = dayjs(date);
  if (d.isToday()) return 'Today';
  if (d.isYesterday()) return 'Yesterday';
  if (dayjs().diff(d, 'day') <= 7) return 'This Week';
  return 'Older';
};

const DATE_ORDER = ['Today', 'Yesterday', 'This Week', 'Older'];

// ── Notification Card ─────────────────────────────────────────────────────────
const NotificationCard = ({ notif, onMarkRead, onDelete }) => {
  const cfg = CATEGORIES[notif.category] || CATEGORIES.System;
  const priorityCfg = PRIORITY_CONFIG[notif.priority] || PRIORITY_CONFIG.Medium;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 50, transition: { duration: 0.2 } }}
      className={`group relative flex flex-col sm:flex-row gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border transition-all duration-200 shadow-sm ${
        notif.isRead
          ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 opacity-75 hover:opacity-100'
          : `bg-white dark:bg-slate-900 border-l-4 ${cfg.border.replace('border-', 'border-l-')} border-t border-r border-b border-slate-100 dark:border-slate-800 shadow-md ${cfg.glow}`
      }`}
    >
      {/* Unread Indicator */}
      {!notif.isRead && (
        <span className={`absolute top-4 right-4 w-2.5 h-2.5 rounded-full ${cfg.dot} ring-2 ring-white dark:ring-slate-900`} />
      )}

      {/* Header Row on Mobile / Left Column on Desktop */}
      <div className="flex items-center gap-3 sm:block">
        <div className={`shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center text-xl sm:text-2xl ${cfg.bg} border ${cfg.border}`}>
          {cfg.emoji}
        </div>
        <div className="flex items-center gap-2 sm:hidden flex-wrap pr-4">
          <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${cfg.badge}`}>
            {notif.category}
          </span>
          <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${priorityCfg.class}`}>
            {priorityCfg.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="hidden sm:flex flex-wrap items-start gap-2 mb-1">
          <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${cfg.badge}`}>
            {notif.category}
          </span>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${priorityCfg.class}`}>
            {priorityCfg.label}
          </span>
        </div>

        <h3 className={`text-sm font-black mb-1 leading-snug ${notif.isRead ? 'text-slate-600 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>
          {notif.title}
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium leading-relaxed mb-3">
          {notif.description}
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2 pt-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 dark:text-slate-600">
              {dayjs(notif.createdAt).fromNow()}
            </span>
            {!notif.isRead && (
              <>
                <span className="text-slate-200 dark:text-slate-700">·</span>
                <button
                  onClick={() => onMarkRead(notif._id)}
                  className={`text-[10px] sm:text-[11px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition-colors ${cfg.color} ${cfg.bg} border ${cfg.border} hover:opacity-80`}
                >
                  ✓ Mark Read
                </button>
              </>
            )}
            {notif.actionUrl && (
              <>
                <span className="text-slate-200 dark:text-slate-700">·</span>
                <Link
                  to={notif.actionUrl}
                  className={`text-[10px] sm:text-[11px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg transition-colors ${cfg.color} ${cfg.bg} border ${cfg.border} hover:opacity-80`}
                >
                  {notif.actionText || 'View →'}
                </Link>
              </>
            )}
          </div>
          <button
            onClick={() => onDelete(notif._id)}
            className="text-[10px] sm:text-[11px] font-bold px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg text-slate-400 dark:text-slate-600 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 border border-transparent hover:border-rose-200 dark:hover:border-rose-500/20 transition-all opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:ml-auto"
          >
            🗑 Delete
          </button>
        </div>
      </div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const NotificationsPage = () => {
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settings, setSettings] = useState({
    workoutReminder: true,
    dietReminder: true,
    trainerReminder: true,
    aiNotifications: true,
    emailNotifications: true,
    pushNotifications: true,
    quietHoursStart: '22:00',
    quietHoursEnd: '07:00',
  });

  // Load notification settings from backend
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await api.get('/notifications/settings');
        if (res?.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err) {
        console.error('Failed to load notification settings:', err);
      }
    };
    fetchSettings();
  }, []);

  const handleMarkRead = (id) => markAsRead(id);
  const handleMarkAllRead = () => markAllAsRead();
  const handleDelete = (id) => { deleteNotification(id); toast.success('Notification deleted'); };

  const handleSaveSettings = async () => {
    setSavingSettings(true);
    try {
      const res = await api.put('/notifications/settings', settings);
      if (res?.success) {
        toast.success('Notification preferences saved!');
        if (res.settings) setSettings(res.settings);
        setShowSettings(false);
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save settings');
    } finally {
      setSavingSettings(false);
    }
  };

  const filtered = useMemo(() => {
    return notifications.filter(n => {
      const matchFilter = filter === 'All' ? true : filter === 'Unread' ? !n.isRead : n.category === filter;
      const matchSearch = search === '' || n.title.toLowerCase().includes(search.toLowerCase()) || n.description.toLowerCase().includes(search.toLowerCase());
      return matchFilter && matchSearch;
    });
  }, [notifications, filter, search]);

  // Group by date
  const grouped = useMemo(() => {
    const groups = {};
    filtered.forEach(n => {
      const label = getDateLabel(n.createdAt);
      if (!groups[label]) groups[label] = [];
      groups[label].push(n);
    });
    return groups;
  }, [filtered]);

  return (
    <div className="max-w-3xl mx-auto pb-20 space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3 mb-1">
            🔔 Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full animate-pulse">
                {unreadCount} new
              </span>
            )}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Your personal fitness assistant (Synced with Email 📧)</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="px-4 py-2 text-xs font-black bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-200 dark:border-primary-500/20 rounded-xl hover:bg-primary-100 dark:hover:bg-primary-500/20 transition-all"
            >
              ✓✓ Mark All Read
            </button>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-4 py-2 text-xs font-black bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            ⚙ Settings
          </button>
        </div>
      </div>

      {/* ── Stats Strip ── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total', value: notifications.length, color: 'text-slate-900 dark:text-white', bg: 'bg-white dark:bg-slate-900' },
          { label: 'Unread', value: unreadCount, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-50 dark:bg-red-500/5' },
          { label: 'Read', value: notifications.length - unreadCount, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/5' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} border border-slate-100 dark:border-slate-800 rounded-2xl p-4 text-center shadow-sm`}>
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Search ── */}
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
        <input
          type="text"
          placeholder="Search notifications..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all shadow-sm"
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`shrink-0 px-4 py-2 rounded-xl text-xs font-black transition-all border whitespace-nowrap ${
              filter === tab
                ? 'bg-primary-600 text-white border-primary-600 shadow-lg shadow-primary-500/25'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-primary-300 dark:hover:border-primary-700'
            }`}
          >
            {tab === 'All' && `All (${notifications.length})`}
            {tab === 'Unread' && `🔴 Unread (${unreadCount})`}
            {tab !== 'All' && tab !== 'Unread' && `${CATEGORIES[tab]?.emoji || ''} ${tab}`}
          </button>
        ))}
      </div>

      {/* ── Notification Settings Panel ── */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                ⚙ Notification Preferences
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { key: 'workoutReminder', label: '🏋️ Workout Reminders' },
                  { key: 'dietReminder', label: '🥗 Diet Reminders' },
                  { key: 'trainerReminder', label: '👨‍🏫 Trainer Notifications' },
                  { key: 'aiNotifications', label: '🤖 AI Insights' },
                  { key: 'emailNotifications', label: '📧 Email Notifications' },
                  { key: 'pushNotifications', label: '📱 Push Notifications' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{label}</span>
                    <div
                      onClick={() => setSettings(prev => ({ ...prev, [key]: !prev[key] }))}
                      className={`w-11 h-6 rounded-full transition-colors cursor-pointer relative flex-shrink-0 ${settings[key] ? 'bg-primary-600' : 'bg-slate-300 dark:bg-slate-600'}`}
                    >
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[key] ? 'left-5' : 'left-0.5'}`} />
                    </div>
                  </label>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">🌙 Quiet Hours Start</label>
                  <input type="time" value={settings.quietHoursStart} onChange={e => setSettings(prev => ({ ...prev, quietHoursStart: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                </div>
                <div>
                  <label className="text-xs font-black text-slate-500 uppercase tracking-wider block mb-1">☀️ Quiet Hours End</label>
                  <input type="time" value={settings.quietHoursEnd} onChange={e => setSettings(prev => ({ ...prev, quietHoursEnd: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary-500/30" />
                </div>
              </div>
              <button
                onClick={handleSaveSettings}
                disabled={savingSettings}
                className="w-full py-3 bg-primary-600 hover:bg-primary-500 text-white font-black rounded-xl transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50"
              >
                {savingSettings ? 'Saving Preferences...' : 'Save Preferences'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Notification List ── */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center shadow-sm"
        >
          <div className="text-6xl mb-4">🔔</div>
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">
            {search ? 'No Results Found' : 'All Caught Up!'}
          </h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {search ? `No notifications matching "${search}"` : 'You have no notifications in this category.'}
          </p>
        </motion.div>
      ) : (
        <div className="space-y-8">
          {DATE_ORDER.filter(label => grouped[label]).map(label => (
            <div key={label} className="space-y-3">
              {/* Date Group Header */}
              <div className="flex items-center gap-3">
                <span className="text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest whitespace-nowrap">{label}</span>
                <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800" />
                <span className="text-xs font-bold text-slate-400 dark:text-slate-600 shrink-0">{grouped[label].length}</span>
              </div>
              <AnimatePresence>
                {grouped[label].map(notif => (
                  <NotificationCard
                    key={notif._id}
                    notif={notif}
                    onMarkRead={handleMarkRead}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          ))}
        </div>
      )}

      {/* ── Motivational Footer ── */}
      {!loading && filtered.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="relative overflow-hidden bg-gradient-to-r from-primary-600 via-violet-600 to-purple-700 rounded-3xl p-6 text-white text-center shadow-2xl shadow-primary-500/25"
        >
          <div className="absolute top-0 right-0 text-8xl opacity-10 select-none">💪</div>
          <p className="text-lg font-black mb-1">Stay Consistent, Stay Fit!</p>
          <p className="text-sm text-white/70 font-medium">Every notification is a step closer to your goal 🚀</p>
        </motion.div>
      )}
    </div>
  );
};

export default NotificationsPage;
