import { useState, useEffect } from 'react';
import { FaRegClock, FaCalendarCheck, FaRegCheckCircle, FaCheckCircle, FaTrash, FaUtensils, FaSyncAlt, FaSpinner, FaTimes } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import RecipeDetailsModal from './RecipeDetailsModal';

const MEAL_IMAGE_MAP = {
  oats: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=80",
  oatmeal: "https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=80",
  pancake: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800&auto=format&fit=crop&q=80",
  egg: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
  omelet: "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
  chicken: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=800&auto=format&fit=crop&q=80",
  salad: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
  rice: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?w=800&auto=format&fit=crop&q=80",
  paneer: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
  fish: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
  salmon: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
  smoothie: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80",
  shake: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80",
  yogurt: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80",
  fruit: "https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=800&auto=format&fit=crop&q=80",
  banana: "https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&auto=format&fit=crop&q=80",
  apple: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=800&auto=format&fit=crop&q=80",
  nuts: "https://images.unsplash.com/photo-1536591375315-1b836802e3a1?w=800&auto=format&fit=crop&q=80",
  almond: "https://images.unsplash.com/photo-1508061252966-177209772a80?w=800&auto=format&fit=crop&q=80",
  bread: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
  toast: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
  soup: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
  curry: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
  roti: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
  dal: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&auto=format&fit=crop&q=80"
};

const resolveFoodImage = (mealName, foodsArray, existingUrl) => {
  if (existingUrl && existingUrl.startsWith('http') && !existingUrl.includes('loremflickr')) {
    return existingUrl;
  }
  const text = ((mealName || '') + ' ' + (foodsArray ? foodsArray.join(' ') : '')).toLowerCase();
  for (const [key, url] of Object.entries(MEAL_IMAGE_MAP)) {
    if (text.includes(key)) {
      return url;
    }
  }
  return "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80";
};

const MyDietPlan = ({ plan, activeDay: propActiveDay, setActiveDay: propSetActiveDay, onRegenerate, onMealLogged }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [completedMeals, setCompletedMeals] = useState({}); // format: { 'Breakfast': 'Completed' }
  const [swappingMeal, setSwappingMeal] = useState(null);
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlts, setLoadingAlts] = useState(false);
  const [swapping, setSwapping] = useState(false);
  const [internalActiveDay, setInternalActiveDay] = useState(1);

  const activeDay = propActiveDay !== undefined ? propActiveDay : internalActiveDay;
  const setActiveDay = propSetActiveDay || setInternalActiveDay;

  const hasDailyPlans = plan && plan.dailyPlans && plan.dailyPlans.length > 0;
  const currentMeals = hasDailyPlans 
    ? (plan.dailyPlans.find(d => d.dayNumber === activeDay)?.meals || [])
    : (plan.meals || []);

  // Get current date string (YYYY-MM-DD)
  const getTodayDateStr = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    if (plan && plan.completedMealsLog) {
      const today = getTodayDateStr();
      const logsToday = plan.completedMealsLog.filter(
        log => log.date === today && (log.dayNumber || 1) === activeDay
      );
      const mealsMap = {};
      logsToday.forEach(log => {
        mealsMap[log.meal] = log.status;
      });
      setCompletedMeals(mealsMap);
    } else {
      setCompletedMeals({});
    }
  }, [plan, activeDay]);

  const handleToggleMeal = async (mealName, currentStatus) => {
    const today = getTodayDateStr();
    // Toggle Cycle: Pending -> Completed -> Missed -> Pending
    let newStatus = 'Completed';
    if (currentStatus === 'Completed') newStatus = 'Missed';
    else if (currentStatus === 'Missed') newStatus = 'Pending';

    try {
      const res = await api.post('/diets/complete-meal', {
        date: today,
        meal: mealName,
        status: newStatus,
        dayNumber: activeDay
      });
      if (res.success) {
        setCompletedMeals(prev => ({ ...prev, [mealName]: newStatus }));
        toast.success(`${mealName} marked as ${newStatus}`);
        if (onMealLogged) onMealLogged(res.plan);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to update meal status");
    }
  };

  const handleResetDayProgress = async () => {
    const today = getTodayDateStr();
    try {
      const res = await api.post('/diets/reset-day-progress', {
        date: today,
        dayNumber: activeDay
      });
      if (res.success) {
        setCompletedMeals({});
        toast.success(`Reset progress for Day ${activeDay}`);
        if (onMealLogged) onMealLogged(res.plan);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to reset day progress");
    }
  };

  const handleViewRecipe = (meal) => {
    // Construct a mock food object that looks like the Food model
    const mockFood = {
      foodName: meal.meal,
      calories: meal.calories || 0,
      protein: meal.protein || 0,
      carbs: meal.carbs || 0,
      fat: meal.fat || 0,
      servingSize: '1 serving',
      prepTime: meal.prepTime || 15,
      imageUrl: resolveFoodImage(meal.meal, meal.foods, meal.imageUrl),
      recipe: meal.recipe ? [meal.recipe] : ['Enjoy the fresh meal combinations.'],
      alternativeFoods: ['Fruit Salad', 'Boiled Eggs']
    };
    setSelectedRecipe(mockFood);
  };

  const handleRequestSwap = async (mealName, foodItem) => {
    setSwappingMeal({ mealName, foodItem, dayNumber: hasDailyPlans ? activeDay : null });
    setLoadingAlts(true);
    setAlternatives([]);
    try {
      const res = await api.post('/ai/get-food-alternatives', { mealType: mealName, foodToReplace: foodItem });
      if (res.success) {
        setAlternatives(res.alternatives);
      } else {
        toast.error(res.message || 'Failed to get alternatives.');
        setSwappingMeal(null);
      }
    } catch (err) {
      console.error(err);
      toast.error('Error fetching alternatives.');
      setSwappingMeal(null);
    } finally {
      setLoadingAlts(false);
    }
  };

  const handleSelectAlternative = async (altFood) => {
    if (!swappingMeal) return;
    setSwapping(true);
    try {
      const res = await api.post('/ai/swap-food', { 
        mealType: swappingMeal.mealName, 
        oldFood: swappingMeal.foodItem, 
        newFood: altFood,
        dayNumber: swappingMeal.dayNumber
      });
      if (res.success) {
        toast.success(`Swapped ${swappingMeal.foodItem} with ${altFood.name}`);
        setSwappingMeal(null);
        if (onMealLogged) onMealLogged(res.plan); // Update parent plan
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to swap food.');
    } finally {
      setSwapping(false);
    }
  };

  // Calculate completion percentage
  const totalMealsCount = currentMeals.length;
  const completedCount = Object.values(completedMeals).filter(s => s === 'Completed').length;
  const completionPercentage = totalMealsCount > 0 ? Math.round((completedCount / totalMealsCount) * 100) : 0;

  return (
    <div className="space-y-8">
      {/* Target Progress Card */}
      <div className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-widest block">Goal: {plan.goal.replace('_', ' ')}</span>
          <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wide">Today's Daily Target</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold">Track and check off your completed meals throughout the day</p>
        </div>

          <div className="flex items-center gap-4">
            {/* Progress Ring */}
            <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="40" cy="40" r="34" className="stroke-slate-200 dark:stroke-slate-800" strokeWidth="6" fill="transparent" />
                <circle cx="40" cy="40" r="34" className="stroke-emerald-500 transition-all duration-500" strokeWidth="6" fill="transparent"
                  strokeDasharray={2 * Math.PI * 34}
                  strokeDashoffset={(2 * Math.PI * 34) * (1 - completionPercentage / 100)}
                />
              </svg>
              <span className="absolute font-black text-sm text-slate-800 dark:text-white">{completionPercentage}%</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] text-slate-450 block font-bold uppercase">Meals Checklist</span>
              <span className="text-slate-900 dark:text-white font-extrabold text-sm">{completedCount} of {totalMealsCount} Completed</span>
              {completedCount > 0 && (
                <button
                  onClick={handleResetDayProgress}
                  className="mt-1 flex items-center gap-1 text-[10px] font-black text-slate-400 hover:text-red-500 transition-colors uppercase tracking-wider cursor-pointer"
                  title="Reset completed meals for this day"
                >
                  <FaSyncAlt size={9} /> Reset Day Progress
                </button>
              )}
            </div>
          </div>
      </div>

      {/* Day Tabs */}
      {hasDailyPlans && (
        <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
          {plan.dailyPlans.map(d => (
            <button
              key={d.dayNumber}
              onClick={() => setActiveDay(d.dayNumber)}
              className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap shrink-0 ${
                activeDay === d.dayNumber
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700'
              }`}
            >
              {d.dayName}
            </button>
          ))}
        </div>
      )}

      {/* Meals Timeline */}
      <div className="space-y-4">
        <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
          <FaCalendarCheck className="text-emerald-500" /> Meal Schedule & Tracker
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {currentMeals.map((m, idx) => {
            const status = completedMeals[m.meal] || 'Pending';
            return (
              <div 
                key={idx}
                className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between h-[230px] hover:shadow-md transition-all relative overflow-hidden group"
              >
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-start gap-3">
                      {(() => {
                        const foodImgSrc = resolveFoodImage(m.meal, m.foods, m.imageUrl);
                        return (
                          <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 shadow-sm border border-slate-200 dark:border-slate-700">
                            <img src={foodImgSrc} alt={m.meal} className="w-full h-full object-cover" />
                          </div>
                        );
                      })()}
                      
                      <div>
                        <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
                          {m.meal}
                        </h4>
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-bold flex items-center gap-1 mt-0.5">
                          <FaRegClock /> {m.time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="flex flex-wrap gap-1.5 mt-1 h-14 overflow-y-auto pr-1" style={{ scrollbarWidth: 'none' }}>
                      {m.foods.map((food, i) => (
                        <div key={i} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-2 py-1 rounded-lg text-xs font-extrabold text-slate-700 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700">
                          {food}
                          <button 
                            onClick={(e) => { e.stopPropagation(); handleRequestSwap(m.meal, food); }}
                            className="text-slate-400 hover:text-emerald-500 transition-colors p-1"
                            title="Find alternative for this food"
                          >
                            <FaSyncAlt size={10} />
                          </button>
                        </div>
                      ))}
                    </div>
                    <p className="text-slate-400 dark:text-slate-500 text-[10px] font-bold mt-2 uppercase">Ready in: {m.prepTime || 15} Mins</p>
                  </div>
                </div>

                {/* Footer: Macros & Complete Button */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between gap-4">
                  {/* Macros info */}
                  <div className="flex gap-2 text-[10px] font-extrabold text-slate-550 dark:text-slate-400 uppercase">
                    <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-150/40 dark:border-slate-700">{m.calories || 0} kcal</span>
                    <span className="px-2 py-1 bg-slate-50 dark:bg-slate-800 rounded border border-slate-150/40 dark:border-slate-700">{m.protein || 0}g P</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => handleViewRecipe(m)}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white text-[10px] font-black rounded-xl uppercase tracking-wider transition-all cursor-pointer"
                    >
                      Recipe
                    </button>
                    <button
                      onClick={() => handleToggleMeal(m.meal, status)}
                      className={`p-2 rounded-xl border transition-all cursor-pointer ${
                        status === 'Completed'
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : status === 'Missed'
                          ? 'bg-red-500 border-red-500 text-white'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-750 text-slate-400 hover:text-slate-650'
                      }`}
                      title={`Status: ${status}. Click to toggle.`}
                    >
                      {status === 'Completed' ? <FaCheckCircle size={14} /> : status === 'Missed' ? <FaCheckCircle className="rotate-45" size={14} /> : <FaRegCheckCircle size={14} />}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          onClick={onRegenerate}
          className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
        >
          ♻️ Regenerate / Setup New AI Diet
        </button>
      </div>

      {selectedRecipe && (
        <RecipeDetailsModal 
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}

      {/* Alternative Food Modal */}
      {swappingMeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => !swapping && setSwappingMeal(null)}>
          <div className="bg-white dark:bg-slate-900 rounded-[2rem] p-6 shadow-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 relative" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase">Swap: {swappingMeal.foodItem}</h3>
              <button onClick={() => setSwappingMeal(null)} disabled={swapping} className="text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors bg-slate-100 dark:bg-slate-800 p-2 rounded-full">
                <FaTimes size={14} />
              </button>
            </div>
            
            {loadingAlts ? (
              <div className="flex flex-col items-center justify-center py-12">
                <FaSpinner className="animate-spin text-emerald-500 text-3xl mb-4" />
                <p className="text-sm font-bold text-slate-500">AI is finding healthy alternatives...</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase text-slate-400 mb-3 tracking-wider">Select an alternative for {swappingMeal.mealName}</p>
                {alternatives.map((alt, idx) => (
                  <div 
                    key={idx} 
                    className={`p-4 border-2 rounded-xl transition-all cursor-pointer ${swapping ? 'opacity-50 pointer-events-none' : 'border-slate-100 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-500/5'}`}
                    onClick={() => handleSelectAlternative(alt)}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-black text-sm text-slate-900 dark:text-white">{alt.name}</span>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-black text-slate-500">{alt.calories} kcal</span>
                    </div>
                    <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">{alt.reason}</p>
                    <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                      <span>{alt.protein}g Protein</span> • 
                      <span>{alt.carbs}g Carbs</span> • 
                      <span>{alt.fat}g Fat</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MyDietPlan;
