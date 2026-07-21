import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAppleAlt, FaTint, FaUtensils, FaListUl, FaPlus } from 'react-icons/fa';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const fadeIn = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5 } };

const NutritionCenter = () => {
  const [waterCups, setWaterCups] = useState(5);
  const maxWater = 8;

  const macroData = {
    labels: ['Protein', 'Carbs', 'Fats'],
    datasets: [{
      data: [150, 200, 65],
      backgroundColor: ['#6C63FF', '#00E5FF', '#22C55E'],
      borderWidth: 0,
      cutout: '75%',
    }],
  };

  const meals = [
    { type: 'Breakfast', name: 'Oatmeal & Protein Shake', cal: 450, time: '08:00 AM' },
    { type: 'Lunch', name: 'Grilled Chicken Salad', cal: 600, time: '01:00 PM' },
    { type: 'Snack', name: 'Greek Yogurt & Almonds', cal: 250, time: '04:30 PM' },
    { type: 'Dinner', name: 'Baked Salmon & Quinoa', cal: 550, time: '07:30 PM' },
  ];

  const groceries = ['Chicken Breast', 'Broccoli', 'Brown Rice', 'Almond Milk', 'Eggs', 'Spinach'];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3"><FaAppleAlt className="text-secondary-500" /> Nutrition Center</h1>
          <p className="text-slate-500 mt-1">Track your macros, meals, and hydration</p>
        </div>
        <button className="btn-primary py-2 px-4 rounded-lg flex items-center gap-2 text-sm"><FaPlus /> Log Meal</button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Macro Tracker */}
        <motion.div {...fadeIn} className="clean-card p-6 relative lg:col-span-2 overflow-hidden">
          <div className="orb-secondary w-40 h-40 -top-10 -right-10 opacity-30" />
          <h3 className="text-xl font-bold text-slate-900 mb-6">Daily Macros</h3>
          <div className="flex flex-col sm:flex-row items-center gap-8">
            <div className="w-48 h-48 relative">
              <Doughnut data={macroData} options={{ responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-slate-900">1,850</span>
                <span className="text-slate-500 text-xs">/ 2400 kcal</span>
              </div>
            </div>
            <div className="flex-1 space-y-4 w-full">
              {[
                { label: 'Protein', val: 150, max: 180, color: 'bg-primary-500' },
                { label: 'Carbs', val: 200, max: 250, color: 'bg-secondary-500' },
                { label: 'Fats', val: 65, max: 80, color: 'bg-accent-500' },
              ].map((m, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{m.label}</span>
                    <span className="text-slate-900 font-medium">{m.val}g <span className="text-slate-900/30">/ {m.max}g</span></span>
                  </div>
                  <div className="w-full bg-dark-700 rounded-full h-1.5 overflow-hidden">
                    <div className={`${m.color} h-1.5 rounded-full`} style={{ width: `${(m.val/m.max)*100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Water Intake */}
        <motion.div {...fadeIn} transition={{ delay: 0.1 }} className="clean-card p-6 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            <FaTint className="text-3xl text-slate-900" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Hydration</h3>
          <p className="text-slate-600 text-sm mb-6">Target: {maxWater} cups (2L)</p>
          
          <div className="flex gap-2 mb-6">
            {Array.from({ length: maxWater }).map((_, i) => (
              <div key={i} onClick={() => setWaterCups(i + 1)} className={`w-6 h-10 rounded-md cursor-pointer transition-all ${i < waterCups ? 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)] scale-110' : 'bg-dark-700 hover:bg-dark-600'}`} />
            ))}
          </div>
          <p className="text-cyan-400 font-bold">{waterCups} / {maxWater} Cups Logged</p>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Meal Planner */}
        <motion.div {...fadeIn} transition={{ delay: 0.2 }} className="clean-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><FaUtensils className="text-primary-500" /> Today's Meal Plan</h3>
          </div>
          <div className="space-y-4">
            {meals.map((meal, i) => (
              <div key={i} className="flex items-center gap-4 p-4 rounded-xl bg-slate-50 border border-white/5 hover:bg-slate-100 transition group">
                <div className="w-12 h-12 rounded-lg bg-dark-800 flex items-center justify-center text-xl group-hover:scale-110 transition">
                  {meal.type === 'Breakfast' ? '🍳' : meal.type === 'Lunch' ? '🥗' : meal.type === 'Snack' ? '🍎' : '🥩'}
                </div>
                <div className="flex-1">
                  <p className="text-primary-400 text-xs font-bold uppercase">{meal.type}</p>
                  <p className="text-slate-900 font-medium">{meal.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-slate-900 font-bold">{meal.cal} <span className="text-slate-500 text-xs font-normal">kcal</span></p>
                  <p className="text-slate-500 text-xs">{meal.time}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Grocery Checklist */}
        <motion.div {...fadeIn} transition={{ delay: 0.3 }} className="clean-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><FaListUl className="text-accent-500" /> Grocery Checklist</h3>
            <button className="text-primary-500 text-sm hover:text-primary-400">+ Add Item</button>
          </div>
          <div className="space-y-3">
            {groceries.map((item, i) => (
              <label key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-white/5 cursor-pointer hover:bg-slate-100 transition">
                <input type="checkbox" className="accent-accent-500 w-4 h-4 rounded border-slate-200" defaultChecked={i < 2} />
                <span className={`text-sm ${i < 2 ? 'text-slate-500 line-through' : 'text-slate-700'}`}>{item}</span>
              </label>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NutritionCenter;
