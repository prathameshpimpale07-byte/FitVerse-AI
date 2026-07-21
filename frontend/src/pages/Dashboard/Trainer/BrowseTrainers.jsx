import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaSearch, FaStar, FaFilter } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const BrowseTrainers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [specialization, setSpecialization] = useState(searchParams.get('spec') || '');

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append('search', search);
      if (specialization) query.append('specialization', specialization);
      
      const res = await api.get(`/trainers?${query.toString()}`);
      if (res?.success) setTrainers(res.trainers);
    } catch (err) {
      toast.error('Failed to load trainers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, [specialization]); // refetch when spec filter changes

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTrainers();
    setSearchParams(prev => {
      if (search) prev.set('search', search);
      else prev.delete('search');
      return prev;
    });
  };

  const specs = ['Strength Training', 'Yoga', 'Weight Loss', 'CrossFit', 'Bodybuilding', 'HIIT', 'Rehabilitation Support'];

  return (
    <div className="max-w-7xl mx-auto pb-16 space-y-8">
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Browse Trainers</h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Find the perfect coach to guide your fitness journey.</p>
      </div>

      {/* ── Search & Filters ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by trainer name..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
            />
          </div>
          <div className="sm:w-64 relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <select
              value={specialization}
              onChange={(e) => {
                setSpecialization(e.target.value);
                setSearchParams(prev => {
                  if (e.target.value) prev.set('spec', e.target.value);
                  else prev.delete('spec');
                  return prev;
                });
              }}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all appearance-none"
            >
              <option value="">All Specializations</option>
              {specs.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button type="submit" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm rounded-xl transition-colors">
            Search
          </button>
        </form>
      </div>

      {/* ── Results Grid ── */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" /></div>
      ) : trainers.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
          <p className="text-slate-500 dark:text-slate-400 font-bold">No trainers found matching your criteria.</p>
          <button onClick={() => {setSearch(''); setSpecialization(''); fetchTrainers();}} className="mt-4 text-violet-600 dark:text-violet-400 text-sm font-bold">Clear Filters</button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {trainers.map((t, i) => (
            <motion.div 
              key={t._id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col"
            >
              <div className="h-28 bg-slate-200 dark:bg-slate-800 relative shrink-0">
                {t.avatar && <img src={t.avatar} alt={t.name} className="w-full h-full object-cover opacity-60 mix-blend-overlay" />}
                <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                  <img src={t.avatar || 'https://via.placeholder.com/150'} alt={t.name} className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 object-cover bg-white" />
                </div>
              </div>
              <div className="pt-12 p-6 flex-1 flex flex-col text-center">
                <h3 className="text-lg font-black text-slate-900 dark:text-white">{t.name}</h3>
                <p className="text-violet-600 dark:text-violet-400 text-[10px] font-black uppercase tracking-widest mb-3">
                  {t.specialization?.[0] || 'Fitness Coach'}
                </p>
                
                <div className="flex items-center justify-center gap-1 text-sm font-bold text-slate-700 dark:text-slate-300 mb-4">
                  <FaStar className="text-orange-400" /> {t.rating} <span className="text-slate-400 dark:text-slate-500 font-medium">({t.totalReviews})</span>
                </div>

                <div className="mt-auto grid grid-cols-2 gap-2 mb-5 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Experience</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{t.experience} Yrs</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">Session Fee</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">₹{t.pricePerSession}</p>
                  </div>
                </div>
                
                <Link to={`/dashboard/trainers/${t._id}`} className="block w-full py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-violet-600 hover:text-white dark:hover:bg-violet-600 text-slate-900 dark:text-white text-xs font-black uppercase tracking-wider rounded-xl transition-colors">
                  View Profile
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BrowseTrainers;
