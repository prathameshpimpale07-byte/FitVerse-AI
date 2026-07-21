import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaAppleAlt, FaTint, FaChartBar, FaShoppingCart,
  FaUtensils, FaPlus, FaChevronRight, FaFire, FaTrash, FaExclamationTriangle
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';

import AIDietGenerator from './components/AIDietGenerator';
import MyDietPlan from './components/MyDietPlan';
import RecipeLibrary from './components/RecipeLibrary';
import WaterTracker from './components/WaterTracker';
import NutritionDashboard from './components/NutritionDashboard';
import GroceryList from './components/GroceryList';

const DietPage = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  const fetchPlan = async () => {
    try {
      const res = await api.get('/diets/my-plan');
      if (res.success && res.plan && res.plan.meals && res.plan.meals.length > 0) {
        setPlan(res.plan);
      } else {
        setPlan(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlan();
  }, []);

  const handlePlanGenerated = (newPlan) => {
    setPlan(newPlan);
    setActiveTab('home');
  };

  const handleLogUpdate = (updatedPlan) => {
    setPlan(updatedPlan);
  };

  const handleResetPlan = async () => {
    setResetting(true);
    try {
      await api.delete('/diets/my-plan');
      setPlan(null);
      setShowResetModal(false);
      setActiveTab('home');
      toast.success('Diet plan reset! You can now generate a fresh plan.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to reset plan. Please try again.');
    } finally {
      setResetting(false);
    }
  };

  // Today's Date formatting
  const getTodayDateStr = () => {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  // Quick stats values for Home tab
  const getHomeStats = () => {
    if (!plan) return { calories: 0, targetCal: 2000, water: 0, targetWater: 3500 };
    const today = getTodayDateStr();
    const waterLog = plan.waterLogs ? plan.waterLogs.find(l => l.date === today) : null;
    const waterIntake = waterLog ? waterLog.intake : 0;
    const completedMeals = plan.completedMealsLog 
      ? plan.completedMealsLog.filter(l => l.date === today && l.status === 'Completed').map(l => l.meal)
      : [];
    let consumedCalories = 0;
    plan.meals.forEach(m => {
      if (completedMeals.includes(m.meal)) consumedCalories += m.calories || 0;
    });
    return {
      calories: consumedCalories,
      targetCal: plan.dailyCalories || 2000,
      water: waterIntake,
      targetWater: 3500
    };
  };

  const stats = getHomeStats();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  const tabsList = [
    { id: 'home',      label: 'Diet Home', icon: <FaAppleAlt /> },
    { id: 'generator', label: 'AI Planner', icon: <FaPlus /> },
    { id: 'recipes',   label: 'Recipes',   icon: <FaUtensils /> },
    { id: 'water',     label: 'Water',     icon: <FaTint /> },
    { id: 'dashboard', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'grocery',   label: 'Groceries', icon: <FaShoppingCart /> },
  ];

  return (
    <div className="space-y-6 pb-10">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
              🍏 Nutrition &amp; Diet Center
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mt-1">
              Track daily macros, log hydration, browse recipes, and design custom meal plans using AI.
            </p>
          </div>

          {/* Reset Plan button — only shown when a plan exists */}
          {plan && (
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-500/10 hover:bg-red-500/20 border border-red-400/20 text-red-500 font-black text-xs uppercase tracking-wider transition-all cursor-pointer shrink-0"
            >
              <FaTrash size={11} /> Reset Plan
            </button>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/60 dark:border-white/5 rounded-2xl shadow-sm">
          {tabsList.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'home' && (
                <>
                  {!plan ? (
                    <div className="max-w-xl mx-auto text-center p-8 sm:p-12 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-2xl space-y-6">
                      <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center mx-auto text-4xl">🥗</div>
                      <div className="space-y-2">
                        <h3 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-wide">No Active Diet Plan</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold max-w-sm mx-auto">
                          Get a weekly meal plan calibrated exactly for your target weight, routines, and cooking skills.
                        </p>
                      </div>
                      <button
                        onClick={() => setActiveTab('generator')}
                        className="px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 mx-auto cursor-pointer"
                      >
                        Launch AI Diet Planner <FaChevronRight size={10} />
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      <div className="lg:col-span-2 space-y-5">
                        {/* Calories & Water summary */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Calories */}
                          <div className="p-5 bg-white dark:bg-slate-900 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Calories Today</span>
                              <h4 className="text-xl font-black text-slate-900 dark:text-white">{stats.calories} <span className="text-sm font-semibold text-slate-400">/ {stats.targetCal}</span></h4>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">{stats.targetCal - stats.calories} kcal left</span>
                            </div>
                            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="22" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="5" fill="transparent" />
                                <circle cx="28" cy="28" r="22" className="stroke-orange-500 transition-all" strokeWidth="5" fill="transparent"
                                  strokeDasharray={2 * Math.PI * 22}
                                  strokeDashoffset={(2 * Math.PI * 22) * (1 - Math.min(stats.calories / stats.targetCal, 1))}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <FaFire className="absolute text-orange-500 text-sm" />
                            </div>
                          </div>

                          {/* Water */}
                          <div className="p-5 bg-white dark:bg-slate-900 backdrop-blur-xl border border-slate-100 dark:border-white/5 rounded-2xl shadow-sm flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-wider block">Water Intake</span>
                              <h4 className="text-xl font-black text-slate-900 dark:text-white">{stats.water} <span className="text-sm font-semibold text-slate-400">/ {stats.targetWater}ml</span></h4>
                              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-bold block">{stats.targetWater - stats.water > 0 ? stats.targetWater - stats.water : 0}ml left</span>
                            </div>
                            <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 56 56">
                                <circle cx="28" cy="28" r="22" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="5" fill="transparent" />
                                <circle cx="28" cy="28" r="22" className="stroke-blue-500 transition-all" strokeWidth="5" fill="transparent"
                                  strokeDasharray={2 * Math.PI * 22}
                                  strokeDashoffset={(2 * Math.PI * 22) * (1 - Math.min(stats.water / stats.targetWater, 1))}
                                  strokeLinecap="round"
                                />
                              </svg>
                              <FaTint className="absolute text-blue-500 text-sm" />
                            </div>
                          </div>
                        </div>

                        <MyDietPlan 
                          plan={plan}
                          onRegenerate={() => setActiveTab('generator')}
                          onMealLogged={handleLogUpdate}
                        />
                      </div>

                      {/* Right sidebar */}
                      <div className="space-y-6">
                        {/* Quick Water panel */}
                        <WaterTracker plan={plan} onWaterLogged={handleLogUpdate} />
                      </div>
                    </div>
                  )}
                </>
              )}

              {activeTab === 'generator' && (
                <AIDietGenerator onPlanGenerated={handlePlanGenerated} />
              )}

              {activeTab === 'recipes' && <RecipeLibrary />}

              {activeTab === 'water' && (
                <div className="max-w-md mx-auto">
                  <WaterTracker plan={plan} onWaterLogged={handleLogUpdate} />
                </div>
              )}

              {activeTab === 'dashboard' && <NutritionDashboard plan={plan} />}

              {activeTab === 'grocery' && <GroceryList plan={plan} />}

            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => !resetting && setShowResetModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-[2rem] p-8 shadow-2xl max-w-sm w-full border border-slate-200 dark:border-slate-800 space-y-6"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-red-100 dark:bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto text-red-500">
                <FaExclamationTriangle size={28} />
              </div>

              {/* Text */}
              <div className="text-center space-y-2">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide">Reset Diet Plan?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  This will permanently delete your current meal plan, water logs, and meal completion history. This action cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetModal(false)}
                  disabled={resetting}
                  className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResetPlan}
                  disabled={resetting}
                  className="flex-1 py-3 rounded-2xl bg-red-500 hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 disabled:opacity-50"
                >
                  {resetting ? (
                    <div className="w-4 h-4 border-t-2 border-b-2 border-white rounded-full animate-spin" />
                  ) : (
                    <><FaTrash size={10} /> Yes, Reset</>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DietPage;
