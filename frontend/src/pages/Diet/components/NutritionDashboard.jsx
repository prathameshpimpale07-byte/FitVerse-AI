import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaFire, FaDumbbell, FaBreadSlice, FaAppleAlt, FaCheckCircle, FaChartPie, FaUtensils, FaInfoCircle } from 'react-icons/fa';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const NutritionDashboard = ({ plan, activeDay: propActiveDay, setActiveDay: propSetActiveDay }) => {
  const [internalActiveDay, setInternalActiveDay] = useState(1);

  if (!plan) return null;

  const activeDay = propActiveDay !== undefined ? propActiveDay : internalActiveDay;
  const setActiveDay = propSetActiveDay || setInternalActiveDay;

  const hasDailyPlans = plan && plan.dailyPlans && plan.dailyPlans.length > 0;

  // Calculate today date string
  const today = new Date().getFullYear() + '-' + 
                String(new Date().getMonth() + 1).padStart(2, '0') + '-' + 
                String(new Date().getDate()).padStart(2, '0');
  
  const completedMealNames = plan.completedMealsLog
    ? plan.completedMealsLog
        .filter(log => log.date === today && (log.dayNumber || 1) === activeDay && log.status === 'Completed')
        .map(log => log.meal)
    : [];

  let consumedCalories = 0;
  let consumedProtein = 0;
  let consumedCarbs = 0;
  let consumedFat = 0;

  const mealsList = hasDailyPlans 
    ? (plan.dailyPlans.find(d => d.dayNumber === activeDay)?.meals || [])
    : (plan.meals || []);

  mealsList.forEach(m => {
    if (completedMealNames.includes(m.meal)) {
      consumedCalories += m.calories || 0;
      consumedProtein += m.protein || 0;
      consumedCarbs += m.carbs || 0;
      consumedFat += m.fat || 0;
    }
  });

  const dayTargetCal = mealsList.reduce((acc, m) => acc + (m.calories || 0), 0);
  const targetCal = dayTargetCal || plan.dailyCalories || 2000;
  const targetProt = parseInt(plan.protein) || 140;
  const targetCarb = parseInt(plan.carbs) || 220;
  const targetFat = parseInt(plan.fat) || 65;

  const calRemaining = Math.max(targetCal - consumedCalories, 0);
  const calPercent = Math.min(Math.round((consumedCalories / targetCal) * 100), 100);

  const protPercent = Math.min(Math.round((consumedProtein / targetProt) * 100), 100);
  const carbPercent = Math.min(Math.round((consumedCarbs / targetCarb) * 100), 100);
  const fatPercent = Math.min(Math.round((consumedFat / targetFat) * 100), 100);

  // Doughnut Chart Data for Macro Ratios
  const macroChartData = {
    labels: ['Protein (g)', 'Carbs (g)', 'Fats (g)'],
    datasets: [{
      data: [consumedProtein || targetProt * 0.3, consumedCarbs || targetCarb * 0.5, consumedFat || targetFat * 0.2],
      backgroundColor: ['#10b981', '#f59e0b', '#f43f5e'],
      borderColor: ['#059669', '#d97706', '#e11d48'],
      borderWidth: 2,
      hoverOffset: 6
    }]
  };

  const macroChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#94a3b8',
          font: { family: 'Inter', size: 11, weight: '700' },
          padding: 12,
          usePointStyle: true,
          pointStyle: 'circle'
        }
      },
      tooltip: {
        backgroundColor: '#0f172a',
        titleFont: { size: 12, weight: '800' },
        bodyFont: { size: 12 },
        padding: 10,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed}g`
        }
      }
    },
    cutout: '70%'
  };

  return (
    <div className="space-y-6">

      {/* ── Sleek Day Selector Tabs ── */}
      {hasDailyPlans && (
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          <div className="flex gap-2">
            {plan.dailyPlans.map(d => (
              <button
                key={d.dayNumber}
                onClick={() => setActiveDay(d.dayNumber)}
                className={`px-4 py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                  activeDay === d.dayNumber
                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 scale-105'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {d.dayName}
              </button>
            ))}
          </div>
          <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] rounded-full uppercase tracking-wider border border-emerald-500/20 shrink-0">
            Goal: {plan.goal ? plan.goal.replace('_', ' ') : 'Fitness'}
          </span>
        </div>
      )}

      {/* ── Top Hero Analytics Grid (3 Cards) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Card 1: Calorie Balance & Circular Gauge */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] font-black uppercase tracking-wider text-orange-500 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
              Calorie Balance
            </span>
            <span className="text-xs font-bold text-slate-400">Day {activeDay}</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">Remaining</span>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white leading-none mb-2">
                {calRemaining} <span className="text-xs font-bold text-slate-400">kcal</span>
              </h3>
              <div className="space-y-1 text-xs font-bold">
                <p className="text-slate-500">Target: <span className="text-slate-900 dark:text-white font-extrabold">{targetCal} kcal</span></p>
                <p className="text-emerald-500">Consumed: <span className="font-extrabold">{consumedCalories} kcal</span></p>
              </div>
            </div>

            <div className="relative w-24 h-24 flex items-center justify-center shrink-0">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" className="stroke-slate-100 dark:stroke-slate-800" strokeWidth="8" fill="transparent" />
                <circle 
                  cx="48" cy="48" r="40" 
                  className="stroke-orange-500 transition-all duration-700 ease-out" 
                  strokeWidth="8" fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={(2 * Math.PI * 40) * (1 - Math.min(consumedCalories / targetCal, 1))}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-sm font-black text-slate-900 dark:text-white block">{calPercent}%</span>
                <span className="text-[8px] font-extrabold text-slate-400 uppercase">Goal</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Macro Distribution Donut Chart */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white flex items-center gap-1.5">
              <FaChartPie className="text-emerald-500" /> Macro Split
            </h4>
            <span className="text-[10px] font-bold text-slate-400">Ratio</span>
          </div>

          <div className="h-36 relative flex items-center justify-center">
            <Doughnut data={macroChartData} options={macroChartOptions} />
          </div>
        </div>

        {/* Card 3: Meal Completion & Score */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                Meal Tracker
              </span>
              <FaCheckCircle className="text-emerald-500 text-sm" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-1">
              {completedMealNames.length} / {mealsList.length} <span className="text-xs font-bold text-slate-400">Meals Logged</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-4">
              {completedMealNames.length === mealsList.length && mealsList.length > 0
                ? '🎉 Excellent! All day meals completed.'
                : 'Log remaining meals to hit your daily nutrition targets.'}
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
              <span>Completion Rate</span>
              <span className="text-emerald-500 font-extrabold">{mealsList.length > 0 ? Math.round((completedMealNames.length / mealsList.length) * 100) : 0}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${mealsList.length > 0 ? (completedMealNames.length / mealsList.length) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

      </div>

      {/* ── Macronutrient Deep Dive Cards ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
          <FaUtensils className="text-emerald-500" /> Day {activeDay} Macro Targets Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Protein Card */}
          <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center text-sm font-black">
                  <FaDumbbell />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Protein</h4>
                  <span className="text-[9px] text-slate-400 font-bold">4 kcal / g</span>
                </div>
              </div>
              <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">{protPercent}%</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{consumedProtein}<span className="text-xs text-slate-400 font-bold">g</span></span>
              <span className="text-xs font-bold text-slate-400">Target: {targetProt}g</span>
            </div>

            <div className="w-full h-2.5 bg-emerald-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${protPercent}%` }} />
            </div>
          </div>

          {/* Carbs Card */}
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-sm font-black">
                  <FaBreadSlice />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Carbohydrates</h4>
                  <span className="text-[9px] text-slate-400 font-bold">4 kcal / g</span>
                </div>
              </div>
              <span className="text-xs font-black text-amber-600 dark:text-amber-400">{carbPercent}%</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{consumedCarbs}<span className="text-xs text-slate-400 font-bold">g</span></span>
              <span className="text-xs font-bold text-slate-400">Target: {targetCarb}g</span>
            </div>

            <div className="w-full h-2.5 bg-amber-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${carbPercent}%` }} />
            </div>
          </div>

          {/* Fat Card */}
          <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center text-sm font-black">
                  <FaAppleAlt />
                </div>
                <div>
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase">Healthy Fats</h4>
                  <span className="text-[9px] text-slate-400 font-bold">9 kcal / g</span>
                </div>
              </div>
              <span className="text-xs font-black text-rose-600 dark:text-rose-400">{fatPercent}%</span>
            </div>

            <div className="flex justify-between items-baseline">
              <span className="text-2xl font-black text-slate-900 dark:text-white">{consumedFat}<span className="text-xs text-slate-400 font-bold">g</span></span>
              <span className="text-xs font-bold text-slate-400">Target: {targetFat}g</span>
            </div>

            <div className="w-full h-2.5 bg-rose-500/10 rounded-full overflow-hidden">
              <div className="h-full bg-rose-500 rounded-full transition-all duration-500" style={{ width: `${fatPercent}%` }} />
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default NutritionDashboard;
