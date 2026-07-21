import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { HiMenu, HiX, HiMoon, HiSun } from 'react-icons/hi';
import { FaDumbbell } from 'react-icons/fa';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/#about' },
  { name: 'Workouts', path: '/#workouts' },
  { name: 'Diet', path: '/#diet' },
  { name: 'AI Coach', path: '/#ai-coach' },
  { name: 'Trainers', path: '/#trainers' },
  { name: 'Contact', path: '/#contact' },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || 
             (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  // Apply dark mode globally when isDark changes
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => {
    const nextTheme = !isDark;
    setIsDark(nextTheme);
    localStorage.setItem('theme', nextTheme ? 'dark' : 'light');
    if (nextTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const sections = ['about', 'workouts', 'diet', 'ai-coach', 'trainers', 'contact'];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      
      let current = '';
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // Added a slightly higher threshold (e.g., 400 or center screen) to trigger section earlier
          if (rect.top <= 400) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // Smooth scroll to hash on load if present
  useEffect(() => {
    if (location.hash) {
      const element = document.querySelector(location.hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled 
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 shadow-sm py-2' 
            : 'bg-slate-50 dark:bg-slate-950 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            <Link to="/" className="flex items-center gap-2 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center transition-transform group-hover:scale-105 shadow-lg shadow-primary-500/20">
                <FaDumbbell className="text-white text-xl" />
              </div>
              <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                FitVerse AI
              </span>
            </Link>

            <nav className="hidden lg:flex items-center justify-center flex-1 px-8 gap-8">
              {navLinks.map((link) => {
                const isHash = link.path.startsWith('/#');
                if (isHash) {
                  const sectionId = link.path.replace('/#', '');
                  const isActive = activeSection === sectionId || (location.pathname === '/' && location.hash === link.path.replace('/', ''));
                  return (
                    <a
                      key={link.path}
                      href={link.path}
                      className={`text-[15px] font-medium transition-colors duration-200 ${
                        isActive ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400'
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                }
                const isHomeActive = link.path === '/' && activeSection === '';
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => {
                      if (link.path === '/' && location.pathname === '/') {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }}
                    className={`text-[15px] font-medium transition-colors duration-200 ${
                      isHomeActive
                        ? 'text-primary-600'
                        : 'text-slate-600 hover:text-primary-600 dark:text-slate-300 dark:hover:text-primary-400'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>

            <div className="hidden lg:flex items-center gap-4 shrink-0">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
              >
                {isDark ? <HiSun size={22} /> : <HiMoon size={22} />}
              </button>
              
              {user ? (
                <div className="flex items-center gap-4">
                  <Link to="/dashboard" className="text-[15px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
                    Dashboard
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="text-[15px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-full hover:bg-slate-200 transition-colors text-[15px]">
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link to="/login" className="text-[15px] font-bold text-slate-600 hover:text-slate-900 transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="px-6 py-2.5 bg-primary-600 text-white font-bold rounded-full hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/20 text-[15px]">
                    Signup
                  </Link>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 lg:hidden">
              <button 
                onClick={toggleTheme}
                className="p-2 text-slate-500 hover:text-primary-600 dark:text-slate-400 dark:hover:text-primary-400 transition-colors"
              >
                {isDark ? <HiSun size={24} /> : <HiMoon size={24} />}
              </button>
              <button 
                className="p-2 -mr-2 text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
              >
                {isOpen ? <HiX size={28} /> : <HiMenu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white/90 backdrop-blur-2xl border-b border-slate-200 shadow-2xl lg:hidden max-h-[calc(100vh-72px)] overflow-y-auto"
          >
            <div className="px-4 py-6 space-y-2 max-w-7xl mx-auto">
              {navLinks.map((link) => {
                const isHash = link.path.startsWith('/#');
                if (isHash) {
                  const sectionId = link.path.replace('/#', '');
                  const isActive = activeSection === sectionId || (location.pathname === '/' && location.hash === link.path.replace('/', ''));
                  return (
                    <a
                      key={link.path}
                      href={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                        isActive ? 'text-primary-600 bg-primary-50' : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                      }`}
                    >
                      {link.name}
                    </a>
                  );
                }
                const isHomeActive = link.path === '/' && activeSection === '';
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      isHomeActive 
                        ? 'text-primary-600 bg-primary-50' 
                        : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                    }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
              
              <div className="pt-6 mt-4 border-t border-slate-100 flex flex-col gap-3">
                {user ? (
                  <>
                    <Link to="/dashboard" onClick={() => setIsOpen(false)} className="w-full py-3 bg-primary-50 text-primary-700 text-center font-bold rounded-xl">
                      Dashboard
                    </Link>
                    <button onClick={handleLogout} className="w-full py-3 bg-slate-100 text-slate-700 text-center font-bold rounded-xl hover:bg-slate-200">
                      Logout
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full py-3 bg-slate-100 text-slate-700 text-center font-bold rounded-xl hover:bg-slate-200 transition-colors">
                      Login
                    </Link>
                    <Link to="/register" onClick={() => setIsOpen(false)} className="w-full py-3 bg-primary-600 text-white text-center font-bold rounded-xl hover:bg-primary-500 transition-colors shadow-md">
                      Signup
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
