import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronRight } from 'react-icons/fa';
import api from '../../../services/api';

const WorkoutCategories = ({ onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/categories');
        // api interceptor returns res.data directly, but if it returns res, handle both
        const data = res.categories ? res : res.data;
        if (res.success && res.categories) {
          setCategories(res.categories);
        } else if (data && data.categories) {
          setCategories(data.categories);
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider">Workout Categories</h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold">Select a muscle group or category to explore specific exercises</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <motion.div
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: idx * 0.05 }}
            whileHover={{ y: -6, scale: 1.02 }}
            onClick={() => onSelectCategory(cat)}
            className="group relative aspect-square w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md flex flex-col justify-end cursor-pointer"
          >
            {/* Background Image */}
            <img 
              src={cat.image} 
              alt={cat.name} 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
            />
            {/* Glassmorphic Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

            {/* Glowing borders */}
            <div className="absolute inset-0 border border-white/10 group-hover:border-primary-500/30 rounded-3xl z-20 pointer-events-none transition-all duration-300" />

            {/* Card Content */}
            <div className="relative z-20 p-6 space-y-3 text-white">
              <div>
                <span className="bg-primary-500/85 backdrop-blur-sm text-white font-black text-[9px] tracking-wider uppercase px-2.5 py-1 rounded-full">
                  {cat.difficulty}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-2 tracking-wide text-white group-hover:text-primary-300 transition-colors uppercase">
                  {cat.name}
                </h3>
              </div>

              {/* Quick Specs */}
              <p className="text-slate-300 text-[10px] font-black tracking-wider flex items-center justify-between pt-2 border-t border-white/10 w-full uppercase whitespace-nowrap">
                <span>{cat.totalExercises} EX</span>
                <span className="text-slate-500">•</span>
                <span>{cat.estimatedTime.split(' ')[0]} MIN</span>
                <span className="text-slate-500">•</span>
                <span className="text-primary-400">STRENGTH</span>
              </p>

              {/* Action Indicator */}
              <div className="text-xs text-primary-400 font-extrabold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest pt-1">
                Explore Exercises &rarr;
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutCategories;
