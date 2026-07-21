import { useState, useEffect } from 'react';
import { FaTint, FaPlus, FaCheckCircle } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const WaterTracker = ({ plan, onWaterLogged }) => {
  const [currentIntake, setCurrentIntake] = useState(0);
  const targetGoal = 5000; // in ml (5L)

  // Get current date string (YYYY-MM-DD)
  const getTodayDateStr = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    if (plan && plan.waterLogs) {
      const today = getTodayDateStr();
      const log = plan.waterLogs.find(l => l.date === today);
      setCurrentIntake(log ? log.intake : 0);
    }
  }, [plan]);

  const handleAddWater = async (amount) => {
    const today = getTodayDateStr();
    try {
      const res = await api.post('/diets/water', {
        date: today,
        amount: Number(amount)
      });
      if (res.success) {
        setCurrentIntake(prev => prev + amount);
        toast.success(`Logged +${amount}ml of Water 💧`);
        if (onWaterLogged) onWaterLogged(res.plan);
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update water intake");
    }
  };

  const percentage = Math.min(Math.round((currentIntake / targetGoal) * 100), 100);

  return (
    <div className="max-w-md mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative space-y-8 text-center">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
          <FaTint className="text-blue-500 animate-pulse" /> Hydration Tracker
        </h3>
        <span className="px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
          Daily Tracker
        </span>
      </div>

      {/* Visual Progress Ring */}
      <div className="relative w-48 h-48 mx-auto flex flex-col items-center justify-center bg-blue-50/10 dark:bg-blue-950/10 rounded-full border border-blue-500/10 shadow-inner overflow-hidden">
        {/* Wave Animation Fill */}
        <div 
          className="absolute bottom-0 left-0 right-0 bg-blue-500/30 dark:bg-blue-500/20 transition-all duration-500 ease-out"
          style={{ height: `${percentage}%` }}
        />

        <div className="relative z-10 space-y-1">
          <span className="text-4xl font-black text-slate-900 dark:text-white">{currentIntake}</span>
          <span className="text-slate-400 dark:text-slate-500 text-[10px] font-black uppercase tracking-wider block">of {targetGoal}ml</span>
          <span className="px-2.5 py-0.5 bg-blue-500 text-white font-extrabold text-[9px] uppercase tracking-widest rounded-full">{percentage}% Goal</span>
        </div>
      </div>

      {/* Hydration target message */}
      {currentIntake >= targetGoal ? (
        <p className="text-xs text-emerald-500 font-black uppercase tracking-wide flex items-center justify-center gap-1.5 animate-bounce">
          <FaCheckCircle /> Daily Target Reached! Keep it up!
        </p>
      ) : (
        <p className="text-xs text-slate-500 font-bold">Recommended: drink water after workouts and meals.</p>
      )}

      {/* Log Buttons Grid */}
      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => handleAddWater(250)}
          className="py-3 px-2 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 rounded-2xl text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider transition-all flex flex-col items-center gap-1 cursor-pointer"
        >
          <FaPlus size={8} /> 250ml
          <span className="text-[8px] text-slate-400 font-normal lowercase">(Glass)</span>
        </button>
        <button
          onClick={() => handleAddWater(500)}
          className="py-3 px-2 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 rounded-2xl text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider transition-all flex flex-col items-center gap-1 cursor-pointer"
        >
          <FaPlus size={8} /> 500ml
          <span className="text-[8px] text-slate-400 font-normal lowercase">(Bottle)</span>
        </button>
        <button
          onClick={() => handleAddWater(1000)}
          className="py-3 px-2 bg-blue-500/10 hover:bg-blue-500/25 border border-blue-500/20 rounded-2xl text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider transition-all flex flex-col items-center gap-1 cursor-pointer"
        >
          <FaPlus size={8} /> 1.0 Liters
          <span className="text-[8px] text-slate-400 font-normal lowercase">(Shaker)</span>
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
