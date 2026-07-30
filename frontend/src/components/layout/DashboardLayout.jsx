import { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';
import {
  HiHome, HiUser, HiChartBar,
  HiLogout, HiBell, HiMenu, HiX, HiSearch,
  HiMoon, HiSun, HiCheckCircle, HiArrowRight,
  HiMail, HiPhone, HiScale, HiSparkles, HiChevronUp,
} from 'react-icons/hi';
import { FaDumbbell, FaAppleAlt, FaUsers, FaRobot, FaTrash, FaFire, FaTrophy, FaRunning, FaEdit } from 'react-icons/fa';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const CATEGORY_EMOJI = {
  Workout: '🏋️', Diet: '🥗', Trainer: '👨‍🏫',
  AI: '🤖', System: '🌐',
};
const CATEGORY_COLOR = {
  Workout: 'bg-violet-500', Diet: 'bg-emerald-500',
  Trainer: 'bg-blue-500', AI: 'bg-purple-500', System: 'bg-slate-400',
};

const sidebarLinks = [
  { name: 'Dashboard', path: '/dashboard', icon: HiHome },
  { name: 'Workout', path: '/dashboard/workouts', icon: FaDumbbell },
  { name: 'Diet', path: '/dashboard/diets', icon: FaAppleAlt },
  { name: 'AI Coach', path: '/dashboard/ai', icon: FaRobot },
  { name: 'Progress', path: '/dashboard/progress', icon: HiChartBar },
  { name: 'Trainers', path: '/dashboard/trainers', icon: FaUsers },
  { name: 'Notifications', path: '/dashboard/notifications', icon: HiBell },
  { name: 'Profile', path: '/dashboard/profile', icon: HiUser },
];

// ── Notification Dropdown ──────────────────────────────────────────────────────
const NotificationDropdown = ({ onClose }) => {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const recent = notifications.slice(0, 8);

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden"
      style={{ maxHeight: '85vh' }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-800/40">
        <div className="flex items-center gap-2">
          <span className="font-black text-slate-900 dark:text-white text-sm">Notifications</span>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">{unreadCount}</span>
          )}
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllAsRead} className="text-[11px] font-bold text-primary-600 dark:text-primary-400 hover:underline">Mark all read</button>
        )}
      </div>

      <div className="overflow-y-auto" style={{ maxHeight: '60vh' }}>
        {recent.length === 0 ? (
          <div className="py-12 text-center">
            <div className="text-4xl mb-3">🔔</div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400">No notifications yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-50 dark:divide-white/5">
            {recent.map(n => (
              <div key={n._id} className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group ${!n.isRead ? 'bg-primary-50/40 dark:bg-primary-500/5' : ''}`}>
                <div className="relative shrink-0 mt-0.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/10 flex items-center justify-center text-lg">{CATEGORY_EMOJI[n.category] || '🔔'}</div>
                  {!n.isRead && <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-slate-900 ${CATEGORY_COLOR[n.category] || 'bg-primary-500'}`} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black leading-snug mb-0.5 truncate ${n.isRead ? 'text-slate-500 dark:text-slate-400' : 'text-slate-900 dark:text-white'}`}>{n.title}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{n.description}</p>
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 mt-1">{dayjs(n.createdAt).fromNow()}</p>
                </div>
                <div className="flex flex-col gap-1 items-end shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!n.isRead && (
                    <button onClick={() => markAsRead(n._id)} className="p-1 text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/30 rounded-lg transition-colors" title="Mark as read">
                      <HiCheckCircle size={16} />
                    </button>
                  )}
                  <button onClick={() => deleteNotification(n._id)} className="p-1 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-lg transition-colors" title="Delete">
                    <FaTrash size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="px-4 py-3 border-t border-slate-100 dark:border-white/5 bg-slate-50/80 dark:bg-slate-800/30">
        <Link to="/dashboard/notifications" onClick={onClose}
          className="flex items-center justify-center gap-2 text-xs font-black text-primary-600 dark:text-primary-400 hover:text-primary-700 transition-colors">
          See all notifications <HiArrowRight />
        </Link>
      </div>
    </motion.div>
  );
};

// ── Sidebar Profile Popover ────────────────────────────────────────────────────
const SidebarProfilePanel = ({ user, onClose, onNavigate }) => {
  // BMI Calc
  let bmi = null, bmiStatus = '', bmiColor = 'text-emerald-400';
  if (user?.height && user?.weight) {
    const h = user.height / 100;
    bmi = (user.weight / (h * h)).toFixed(1);
    if (bmi < 18.5) { bmiStatus = 'Underweight'; bmiColor = 'text-sky-400'; }
    else if (bmi < 24.9) { bmiStatus = 'Healthy'; bmiColor = 'text-emerald-400'; }
    else if (bmi < 29.9) { bmiStatus = 'Overweight'; bmiColor = 'text-amber-400'; }
    else { bmiStatus = 'Obese'; bmiColor = 'text-red-400'; }
  }

  const xpInLevel = (user?.xp || 0) % 1000;
  const currentLevel = Math.floor((user?.xp || 0) / 1000) + 1;
  const xpProgress = (xpInLevel / 1000) * 100;

  const goalLabel = (user?.fitnessGoal || 'general_fitness').replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30 }}
      className="relative mt-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border border-slate-200/60 dark:border-white/10 rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Close */}
      <button onClick={onClose} className="absolute top-3 right-3 w-7 h-7 flex items-center justify-center rounded-full bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/20 transition-colors z-10">
        <HiX size={14} />
      </button>

      {/* Header */}
      <div className="p-5 pb-4 bg-gradient-to-r from-primary-600 to-secondary-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-2 right-8 w-16 h-16 rounded-full bg-white blur-xl" />
        </div>
        <div className="relative flex items-center gap-3">
          {user?.avatar ? (
            <img src={user.avatar} alt={user?.name} className="w-14 h-14 rounded-xl object-cover border-2 border-white/30 shadow-md shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-xl bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-black text-white text-base leading-tight truncate">{user?.name || 'User'}</p>
            <p className="text-white/70 text-[11px] truncate">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">{user?.role || 'user'}</span>
              <span className="px-2 py-0.5 rounded-md bg-white/20 text-white text-[10px] font-black uppercase tracking-wider">{goalLabel}</span>
            </div>
          </div>
        </div>

        {/* XP Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-[10px] font-bold text-white/80 mb-1">
            <span>🏆 Level {currentLevel}</span>
            <span>{xpInLevel} / 1000 XP</span>
          </div>
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-700" style={{ width: `${xpProgress}%` }} />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 divide-x divide-slate-100 dark:divide-white/5 border-b border-slate-100 dark:border-white/5">
        {[
          { label: 'Streak', value: `${user?.streak || 0}🔥`, sub: 'days' },
          { label: 'Weight', value: user?.weight ? `${user.weight}kg` : '--' },
          { label: 'BMI', value: bmi || '--', sub: bmiStatus, subColor: bmiColor },
        ].map((s, i) => (
          <div key={i} className="px-3 py-3 text-center">
            <p className="text-base font-black text-slate-900 dark:text-white leading-none">{s.value}</p>
            {s.sub && <p className={`text-[10px] font-bold mt-0.5 ${s.subColor || 'text-slate-400'}`}>{s.sub}</p>}
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Details List */}
      <div className="p-3 space-y-1">
        {[
          { icon: HiPhone, label: 'Phone', value: user?.phone || 'Not set' },
          { icon: HiSparkles, label: 'Height', value: user?.height ? `${user.height} cm` : 'Not set' },
          { icon: HiScale, label: 'Age', value: user?.age ? `${user.age} years` : 'Not set' },
          { icon: FaRunning, label: 'Gender', value: user?.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : 'Not set' },
        ].map((item, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-white/5">
            <item.icon className="text-slate-400 dark:text-slate-500 text-sm shrink-0" />
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 w-12 shrink-0">{item.label}</span>
            <span className="text-[11px] font-black text-slate-800 dark:text-slate-200 truncate">{item.value}</span>
          </div>
        ))}
      </div>

      {/* Edit Profile Button */}
      <div className="px-3 pb-3">
        <button
          onClick={() => { onNavigate('/dashboard/profile'); onClose(); }}
          className="w-full py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-black flex items-center justify-center gap-2 transition-colors shadow-md shadow-primary-600/20"
        >
          <FaEdit /> Edit Profile
        </button>
      </div>
    </motion.div>
  );
};

// ── Main DashboardLayout ────────────────────────────────────────────────────────
const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const bellRef = useRef(null);
  const profileRef = useRef(null);
  const searchRef = useRef(null);

  const searchItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HiHome },
    { name: 'Notifications', path: '/dashboard/notifications', icon: HiBell },
    { name: 'Workouts & Exercises', path: '/dashboard/workouts', icon: FaDumbbell },
    { name: 'Diet & Nutrition', path: '/dashboard/diets', icon: FaAppleAlt },
    { name: 'AI Coach & Assistant', path: '/dashboard/ai', icon: FaRobot },
    { name: 'Progress & Analytics', path: '/dashboard/progress', icon: HiChartBar },
    { name: 'Personal Trainers', path: '/dashboard/trainers', icon: FaUsers },
    { name: 'Profile & Settings', path: '/dashboard/profile', icon: HiUser },
  ];

  const filteredSearch = searchQuery.trim() === '' ? [] : searchItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(prev => {
      localStorage.setItem('theme', !prev ? 'dark' : 'light');
      return !prev;
    });
  };

  const handleLogout = () => { logout(); navigate('/'); };

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target)) setIsSearchOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // ── Avatar Display ──
  const AvatarDisplay = ({ sizeClass = 'w-9 h-9', textSize = 'text-sm' }) => {
    if (user?.avatar) {
      return <img src={user.avatar} alt={user?.name || 'User'} className={`${sizeClass} rounded-xl object-cover border-2 border-white dark:border-slate-800 shadow-sm shrink-0`} />;
    }
    return (
      <div className={`${sizeClass} ${textSize} rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 text-white flex items-center justify-center font-black shrink-0 shadow-sm`}>
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    );
  };

  // ── Nav link class ──
  const navLinkClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
      isActive
        ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-700 dark:text-primary-400 shadow-sm'
        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
    }`;

  const SidebarContent = () => (
    <div className="flex flex-col h-full sidebar-root bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl">
      {/* Logo Header */}
      <Link to="/" className="h-20 px-6 flex items-center gap-3.5 transition-colors group shrink-0 border-b border-slate-100 dark:border-white/5">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary-600 to-violet-600 flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-primary-500/20 shrink-0">
          <FaDumbbell className="text-white text-xl" />
        </div>
        <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">FitVerse <span className="text-primary-500">AI</span></span>
      </Link>

      {/* Nav Links (Enlarged prominent font and icons) */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2" style={{ scrollbarWidth: 'none' }}>
        {sidebarLinks.map((link) => (
          <NavLink key={link.path} to={link.path} end={link.path === '/dashboard'}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-black tracking-wide transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-violet-600 text-white shadow-lg shadow-primary-500/25 scale-[1.02]'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/10 hover:text-slate-900 dark:hover:text-white hover:translate-x-1'
              }`
            }>
            <div className="flex items-center gap-3.5">
              <link.icon className="text-xl flex-shrink-0" />
              <span>{link.name}</span>
            </div>
            {link.path === '/dashboard/notifications' && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm">{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom — Logout */}
      <div className="p-4 border-t border-slate-100 dark:border-white/5 relative">
        <button onClick={handleLogout}
          className="flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider w-full text-rose-500 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 transition-all cursor-pointer">
          <HiLogout className="text-xl shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50/50 dark:bg-[#0b0f19] relative">
      {/* Background Ambient Glow Orbs for Glassmorphism */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary-500/15 dark:bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-violet-500/15 dark:bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-72 fixed left-0 top-0 bottom-0 z-50 border-r border-slate-200/60 dark:border-white/10 shadow-lg backdrop-blur-2xl">
        <div className="w-full"><SidebarContent /></div>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50"
              onClick={() => setSidebarOpen(false)} />
            <motion.aside initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 bottom-0 w-80 z-50">
              <button onClick={() => setSidebarOpen(false)}
                className="absolute top-5 right-4 z-10 text-slate-400 hover:text-slate-800 dark:hover:text-white p-1.5 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full shadow-sm">
                <HiX size={18} />
              </button>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Mobile FAB */}
      <button onClick={() => setSidebarOpen(true)}
        className="lg:hidden fixed bottom-5 left-4 z-30 w-11 h-11 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-600/30">
        <HiMenu size={20} />
      </button>

      {/* Main Content */}
      <div className="flex-1 lg:ml-72 flex flex-col min-h-screen w-full max-w-full overflow-x-clip z-10">

        {/* ── Top Navbar (Glassmorphism Header) ── */}
        <header className="fixed top-0 right-0 left-0 lg:left-72 z-40 h-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-2xl border-b border-slate-200/60 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.04)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]">

          {/* Mobile Brand / Mobile Hamburger */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-xl bg-white/40 dark:bg-white/5 backdrop-blur-xl text-slate-700 dark:text-slate-200 hover:bg-white/60 dark:hover:bg-white/10 transition-all border border-slate-200/50 dark:border-white/10"
            >
              <HiMenu size={20} />
            </button>
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-violet-600 flex items-center justify-center shadow-md shadow-primary-500/20">
                <FaDumbbell className="text-white text-base" />
              </div>
              <span className="text-lg font-black text-slate-900 dark:text-white tracking-tight">FitVerse <span className="text-primary-500">AI</span></span>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex items-center flex-1 max-w-md">
            <div className="relative w-full" ref={searchRef}>
              <HiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" size={18} />
              <input 
                type="text" 
                placeholder="Search Dashboard, Notifications, Workouts..." 
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && filteredSearch.length > 0) {
                    navigate(filteredSearch[0].path);
                    setSearchQuery('');
                    setIsSearchOpen(false);
                  }
                }}
                className="w-full bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-slate-200/60 dark:border-white/10 rounded-2xl pl-10 pr-4 py-2 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 dark:focus:border-primary-500 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-inner"
              />

              <AnimatePresence>
                {isSearchOpen && searchQuery.trim() && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    {filteredSearch.length > 0 ? (
                      <div className="py-2 divide-y divide-slate-100 dark:divide-white/5">
                        {filteredSearch.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              navigate(item.path);
                              setIsSearchOpen(false);
                              setSearchQuery('');
                            }}
                            className="w-full flex items-center justify-between px-4 py-2.5 text-xs text-left hover:bg-primary-50/60 dark:hover:bg-primary-500/10 text-slate-700 dark:text-slate-200 transition-all font-semibold group cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-500/20 text-primary-600 dark:text-primary-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <item.icon size={14} />
                              </div>
                              <span className="font-bold">{item.name}</span>
                            </div>
                            <span className="text-[10px] font-black text-primary-500 group-hover:translate-x-1 transition-transform">Open &rarr;</span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="py-4 text-center text-xs font-semibold text-slate-500 dark:text-slate-400">
                        No pages found matching &quot;{searchQuery}&quot;
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Controls & User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 bg-white/40 dark:bg-white/5 backdrop-blur-xl hover:bg-white/60 dark:hover:bg-white/10 transition-all border border-slate-200/50 dark:border-white/10 shadow-xs"
              title="Toggle theme"
            >
              {isDark ? <HiSun size={19} className="text-amber-400" /> : <HiMoon size={19} className="text-indigo-600" />}
            </button>

            {/* Bell Notification */}
            <div className="relative" ref={bellRef}>
              <button
                onClick={() => setBellOpen(prev => !prev)}
                className={`relative p-2 rounded-xl backdrop-blur-xl transition-all border ${
                  bellOpen
                    ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400 border-primary-200 dark:border-primary-500/30'
                    : 'bg-white/40 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white/60 dark:hover:bg-white/10 border-slate-200/50 dark:border-white/10 shadow-xs'
                }`}
                title="Notifications"
              >
                <HiBell size={19} />
                {unreadCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 min-w-[17px] h-[17px] bg-rose-500 text-white text-[9px] font-black rounded-full flex items-center justify-center px-1 border-2 border-white dark:border-slate-900 shadow-md animate-pulse"
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </motion.span>
                )}
              </button>
              <AnimatePresence>
                {bellOpen && <NotificationDropdown onClose={() => setBellOpen(false)} />}
              </AnimatePresence>
            </div>

            {/* Divider */}
            <div className="w-px h-6 bg-slate-200/60 dark:bg-white/10 mx-1 hidden sm:block" />

            {/* ── User Profile Pill ── */}
            <Link
              to="/dashboard/profile"
              className="flex items-center gap-2.5 p-1 sm:pr-3.5 bg-white/40 dark:bg-white/5 backdrop-blur-xl hover:bg-primary-50/60 dark:hover:bg-primary-500/10 border border-slate-200/60 dark:border-white/10 hover:border-primary-300 dark:hover:border-primary-500/30 rounded-2xl transition-all shadow-xs group cursor-pointer"
            >
              <div className="relative shrink-0">
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user?.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-primary-500/40 group-hover:ring-primary-500 transition-all shadow-xs"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-primary-600 to-violet-600 text-white flex items-center justify-center text-xs font-black shadow-xs ring-2 ring-primary-500/40 group-hover:ring-primary-500 transition-all">
                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                {/* Online status indicator */}
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-slate-900" />
              </div>

              <div className="hidden sm:block text-left pr-1">
                <p className="text-xs font-black text-slate-900 dark:text-white leading-tight group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors truncate max-w-[110px]">
                  {user?.name || 'User'}
                </p>
                <p className="text-[9px] font-extrabold uppercase tracking-wider text-primary-600 dark:text-primary-400 mt-0.5">
                  {user?.role === 'admin' ? '⚡ Admin' : user?.role === 'trainer' ? '🏋️ Trainer' : 'PRO Member'}
                </p>
              </div>
            </Link>

          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-2.5 sm:p-6 lg:p-8 pt-20 sm:pt-22 lg:pt-24 max-w-[1400px] mx-auto w-full box-border overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
