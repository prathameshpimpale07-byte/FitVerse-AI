import { motion } from 'framer-motion';
import { FaStar, FaCertificate, FaArrowRight } from 'react-icons/fa';

const TrainerCard = ({ trainer, onBook }) => {
  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="clean-card overflow-hidden group border border-slate-200 flex flex-col h-full rounded-3xl"
    >
      {/* Top Image Area */}
      <div className="h-64 bg-dark-800 relative overflow-hidden">
        <img 
          src={trainer.avatar || 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80'} 
          alt={trainer.name} 
          className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-90" />
        
        {trainer.rating > 0 && (
          <div className="absolute top-4 right-4 bg-dark-900/80 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1">
            <FaStar className="text-yellow-400 text-xs" />
            <span className="text-slate-900 text-xs font-bold">{trainer.rating.toFixed(1)}</span>
          </div>
        )}
      </div>

      <div className="p-6 relative -mt-10 flex-1 flex flex-col bg-gradient-to-t from-dark-900 to-transparent pt-10">
        <h3 className="text-2xl font-bold text-slate-900 mb-1">{trainer.name}</h3>
        <p className="text-primary-400 font-medium text-sm mb-4">{trainer.experience} years experience</p>

        {/* Specializations */}
        <div className="flex flex-wrap gap-2 mb-4">
          {trainer.specialization?.slice(0, 3).map((spec, i) => (
            <span key={i} className="px-3 py-1 text-[10px] uppercase font-bold tracking-wider rounded-full bg-slate-50 border border-slate-200 text-slate-500">
              {spec}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
          <span className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">
            ₹{trainer.pricePerSession} <span className="text-slate-900/30 text-xs font-normal">/ session</span>
          </span>
          <button onClick={() => onBook?.(trainer)} className="w-10 h-10 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:border-primary-500 group-hover:text-white transition-all">
            <FaArrowRight />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TrainerCard;
