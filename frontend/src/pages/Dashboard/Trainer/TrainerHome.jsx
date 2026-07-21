import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaStar, FaArrowRight, FaCalendarCheck, FaDumbbell } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const TrainerHome = () => {
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/trainers');
        if (res?.success) setTrainers(res.trainers);
      } catch (err) {
        toast.error('Failed to load trainers');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = ['Strength Training', 'Yoga', 'Weight Loss', 'CrossFit'];
  
  const featured = trainers.slice(0, 3); // Take top 3 for featured

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-12">
      {/* ── Hero Section ── */}
      <div className="bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl p-8 sm:p-12 relative overflow-hidden text-white shadow-xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl sm:text-5xl font-black mb-4">Find Your Perfect Fitness Coach</h1>
          <p className="text-violet-100 mb-8 text-lg font-medium">Book 1-on-1 sessions, get personalized plans, and achieve your goals with certified experts.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/dashboard/trainers/browse" className="px-6 py-3 bg-white text-violet-600 font-bold rounded-xl shadow-lg hover:bg-slate-50 transition-all flex items-center gap-2">
              Browse All Trainers <FaArrowRight />
            </Link>
            <Link to="/dashboard/trainers/bookings" className="px-6 py-3 bg-violet-700/50 hover:bg-violet-700 text-white font-bold rounded-xl border border-violet-500/50 transition-all flex items-center gap-2">
              <FaCalendarCheck /> My Bookings
            </Link>
          </div>
        </div>
      </div>

      {/* ── Popular Categories ── */}
      <div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2">
          <FaDumbbell className="text-violet-500" /> Popular Categories
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat, i) => (
            <button key={i} onClick={() => navigate(`/dashboard/trainers/browse?spec=${cat}`)}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center hover:border-violet-500 dark:hover:border-violet-500 hover:shadow-lg transition-all group">
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300 group-hover:text-violet-600 dark:group-hover:text-violet-400">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Featured Trainers ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FaStar className="text-orange-400" /> Featured Trainers
          </h2>
          <Link to="/dashboard/trainers/browse" className="text-sm font-bold text-violet-600 hover:text-violet-700 dark:text-violet-400">View All</Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" /></div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map(t => (
              <motion.div key={t._id} whileHover={{ y: -5 }} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all">
                <div className="h-32 bg-slate-200 dark:bg-slate-800 relative">
                  {t.avatar && <img src={t.avatar} alt={t.name} className="w-full h-full object-cover opacity-50 mix-blend-overlay" />}
                  <div className="absolute -bottom-10 left-6">
                    <img src={t.avatar || 'https://via.placeholder.com/150'} alt={t.name} className="w-20 h-20 rounded-2xl border-4 border-white dark:border-slate-900 object-cover bg-white" />
                  </div>
                  <div className="absolute top-4 right-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                    <FaStar className="text-orange-400 text-xs" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">{t.rating}</span>
                  </div>
                </div>
                <div className="pt-14 p-6">
                  <h3 className="text-lg font-black text-slate-900 dark:text-white mb-1">{t.name}</h3>
                  <p className="text-violet-600 dark:text-violet-400 text-xs font-bold uppercase tracking-wider mb-4">
                    {t.specialization?.[0] || 'Fitness Coach'}
                  </p>
                  
                  <div className="flex items-center justify-between mb-6">
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      <span className="text-slate-900 dark:text-white font-bold">₹{t.pricePerSession}</span> / session
                    </div>
                    <div className="text-xs font-bold px-2 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-md">
                      {t.experience} Yrs Exp
                    </div>
                  </div>
                  
                  <Link to={`/dashboard/trainers/${t._id}`} className="block w-full py-3 text-center bg-slate-50 dark:bg-slate-800 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 text-slate-900 dark:text-white text-sm font-black rounded-xl transition-colors">
                    View Profile
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerHome;
