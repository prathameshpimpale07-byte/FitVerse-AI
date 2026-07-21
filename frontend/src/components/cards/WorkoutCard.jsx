import { motion } from 'framer-motion';
import { FaClock, FaFire, FaDumbbell, FaPlay } from 'react-icons/fa';

const categoryImages = {
  strength: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&q=80',
  cardio: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=800&q=80',
  flexibility: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  hiit: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  yoga: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  pilates: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
  crossfit: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?w=800&q=80',
  other: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80',
};

// Returns a visual difficulty meter (3 bars)
const DifficultyMeter = ({ level }) => {
  const levels = {
    beginner: { active: 1, color: 'bg-emerald-500' },
    intermediate: { active: 2, color: 'bg-orange-500' },
    advanced: { active: 3, color: 'bg-red-500' }
  };
  
  const config = levels[level?.toLowerCase()] || levels.beginner;

  return (
    <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white">
      <span className="text-[10px] font-bold text-slate-700 uppercase tracking-widest">{level || 'Beginner'}</span>
      <div className="flex gap-1">
        {[1, 2, 3].map((bar) => (
          <div 
            key={bar} 
            className={`w-1.5 h-3 rounded-full ${bar <= config.active ? `${config.color}` : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
};

const WorkoutCard = ({ workout, onClick, featured = false }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`group relative overflow-hidden rounded-[2rem] cursor-pointer clean-card shadow-sm hover:shadow-lg transition-all ${featured ? 'md:col-span-2 lg:col-span-2 h-[450px]' : 'h-[450px]'}`}
      onClick={() => onClick?.(workout)}
    >
      {/* Background Image & Overlay */}
      <img 
        src={categoryImages[workout.category?.toLowerCase()] || categoryImages.other} 
        alt={workout.title} 
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
      <div className="absolute inset-0 bg-slate-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Top Badges */}
      <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-20">
        <div className="px-4 py-1.5 bg-primary-600 rounded-full text-xs font-bold text-white shadow-sm uppercase tracking-wider">
          {workout.category}
        </div>
        <DifficultyMeter level={workout.level} />
      </div>

      {/* Play Button Overlay (Visible on Hover) */}
      <div className="absolute inset-0 flex items-center justify-center z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform group-hover:scale-100 scale-95">
        <div className="w-16 h-16 rounded-full bg-white backdrop-blur-md flex items-center justify-center text-primary-600 text-2xl shadow-lg">
          <FaPlay className="ml-1" />
        </div>
      </div>

      {/* Content Bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-20 flex flex-col justify-end h-full">
        <motion.div 
          initial={false}
          className="transform translate-y-6 group-hover:translate-y-0 transition-transform duration-300 ease-out"
        >
          <h3 className={`font-black text-white mb-2 leading-tight ${featured ? 'text-4xl lg:text-5xl' : 'text-2xl md:text-3xl'}`}>
            {workout.title}
          </h3>
          
          <p className="text-slate-300 text-sm mb-6 line-clamp-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-75">
            {workout.description || 'Get ready to crush your goals with this expertly designed routine. Push your limits and discover your true potential.'}
          </p>
          
          {/* Stats Bar */}
          <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary-300">
                <FaClock />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm leading-none">{workout.duration}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Min</p>
              </div>
            </div>
            
            <div className="w-px h-8 bg-slate-200" />
            
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-orange-400">
                <FaFire />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm leading-none">{workout.caloriesBurned}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Kcal</p>
              </div>
            </div>

            <div className="w-px h-8 bg-slate-200" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-emerald-400">
                <FaDumbbell />
              </div>
              <div>
                <p className="text-slate-900 font-bold text-sm leading-none">{workout.exercises?.length || 0}</p>
                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-wider mt-0.5">Moves</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default WorkoutCard;
