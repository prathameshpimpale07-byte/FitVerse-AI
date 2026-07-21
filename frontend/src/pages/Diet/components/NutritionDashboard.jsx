import { FaFire, FaRegCircle, FaDumbbell, FaBreadSlice, FaAppleAlt } from 'react-icons/fa';

const NutritionDashboard = ({ plan }) => {
  if (!plan) return null;

  // Calculate consumed macros from completed meals
  const today = new Date().getFullYear() + '-' + 
                String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                String(new Date().getDate()).padStart(2, '0');
  
  const completedMealNames = plan.completedMealsLog
    ? plan.completedMealsLog.filter(log => log.date === today && log.status === 'Completed').map(log => log.meal)
    : [];

  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFat = 0;

  plan.meals.forEach(m => {
    if (completedMealNames.includes(m.meal)) {
      consumedCalories += m.calories || 0;
      consumedProtein += m.protein || 0;
      consumedCarbs += m.carbs || 0;
      consumedFat += m.fat || 0;
    }
  });

  const targetCal = plan.dailyCalories || 2000;
  const targetProt = parseInt(plan.protein) || 120;
  const targetCarb = parseInt(plan.carbs) || 250;
  const targetFat = parseInt(plan.fat) || 70;

  const calRemaining = Math.max(targetCal - consumedCalories, 0);

  return (
    <div className="space-y-8">
      {/* Target and Consumed Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Calories Card */}
        <div className="md:col-span-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-3">
            <span className="px-3.5 py-1.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
              Calorie Balance
            </span>
            <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
              {calRemaining} kcal <span className="text-xs text-slate-400 dark:text-slate-500 font-bold lowercase">remaining</span>
            </h3>
            <div className="flex gap-4 text-xs font-bold text-slate-500">
              <span>Goal: <b className="text-slate-800 dark:text-white">{targetCal}</b></span>
              <span>•</span>
              <span>Consumed: <b className="text-slate-800 dark:text-white">{consumedCalories}</b></span>
            </div>
          </div>

          <div className="relative w-28 h-28 flex items-center justify-center shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="56" cy="56" r="48" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
              <circle cx="56" cy="56" r="48" className="stroke-orange-500 transition-all duration-500" strokeWidth="8" fill="transparent"
                strokeDasharray={2 * Math.PI * 48}
                strokeDashoffset={(2 * Math.PI * 48) * (1 - Math.min(consumedCalories / targetCal, 1))}
              />
            </svg>
            <FaFire className="absolute text-orange-500 text-2xl animate-pulse" />
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] text-slate-400 dark:text-slate-550 font-black uppercase tracking-wider block">Nutrition Score</span>
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-slate-950 dark:text-white">Active Plan</h4>
            <p className="text-slate-500 dark:text-slate-450 text-xs font-semibold">Your diet is calibrated specifically for target: <b>{plan.goal.replace('_', ' ')}</b></p>
          </div>
          <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden mt-3">
            <div className="h-full bg-emerald-500" style={{ width: `${Math.round((consumedProtein / targetProt) * 100)}%` }} />
          </div>
        </div>
      </div>

      {/* Macronutrient Bars */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6">
        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">Macronutrient Targets</h3>

        <div className="space-y-5">
          {/* Protein */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5"><FaDumbbell className="text-emerald-500" /> Protein</span>
              <span className="text-slate-500 font-bold">{consumedProtein}g / {targetProt}g</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((consumedProtein / targetProt) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Carbs */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5"><FaBreadSlice className="text-yellow-500" /> Carbohydrates</span>
              <span className="text-slate-500 font-bold">{consumedCarbs}g / {targetCarb}g</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((consumedCarbs / targetCarb) * 100, 100)}%` }} />
            </div>
          </div>

          {/* Fat */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5"><FaAppleAlt className="text-red-500" /> Healthy Fats</span>
              <span className="text-slate-500 font-bold">{consumedFat}g / {targetFat}g</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full transition-all duration-500" style={{ width: `${Math.min((consumedFat / targetFat) * 100, 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NutritionDashboard;
