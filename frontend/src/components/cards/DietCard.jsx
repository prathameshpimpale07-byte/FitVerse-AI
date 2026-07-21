import { motion } from 'framer-motion';
import { FaUtensils, FaFire } from 'react-icons/fa';

const DietCard = ({ diet, onClick }) => {
  const goalColors = {
    weight_loss: 'bg-emerald-500',
    muscle_gain: 'bg-blue-500',
    maintenance: 'bg-purple-500',
    endurance: 'bg-orange-500',
  };

  const goalLabels = {
    weight_loss: '🏃 Weight Loss',
    muscle_gain: '💪 Muscle Gain',
    maintenance: '⚖️ Maintenance',
    endurance: '🏋️ Endurance',
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="clean-card cursor-pointer overflow-hidden flex flex-col"
      onClick={() => onClick?.(diet)}
    >
      <div className={`h-32 ${goalColors[diet.goal] || 'bg-primary-500'} relative`}>
        <span className="absolute top-4 right-4 bg-slate-200 backdrop-blur text-slate-900 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider">{diet.type}</span>
      </div>
      <div className="p-5 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-slate-900 mb-1">{diet.title}</h3>
        <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-1">{diet.description || 'A balanced diet plan for your goals.'}</p>
        
        <div className="flex items-center gap-2 text-sm mb-4">
          <span className="bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md text-xs font-semibold">{goalLabels[diet.goal] || diet.goal}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-1.5 font-medium">
            <FaFire className="text-orange-500" />
            <span>{diet.totalCalories} cal/day</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <FaUtensils className="text-primary-500" />
            <span>{diet.meals?.length || 0} meals</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DietCard;
