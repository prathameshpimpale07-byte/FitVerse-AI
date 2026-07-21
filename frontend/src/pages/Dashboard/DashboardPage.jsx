import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/services';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaFire, FaDumbbell, FaTrophy, FaHeartbeat, FaBolt, 
  FaCrown, FaCalendarCheck, FaChartLine, FaArrowRight, FaPlay, FaUtensils, FaRobot, FaStar, FaRunning, FaMedal,
  FaWater, FaAppleAlt, FaWeight, FaUsers
} from 'react-icons/fa';
import { HiOutlineClock, HiLocationMarker, HiLightningBolt, HiSparkles } from 'react-icons/hi';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, Title, Tooltip, Legend, Filler 
} from 'chart.js';
import dayjs from 'dayjs';
import 'dayjs/locale/en';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

// SVG Circular Progress Ring Component
const ProgressRing = ({ radius, stroke, progress, color, bg }) => {
  const normalizedRadius = radius - stroke * 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;
  
  return (
    <svg height={radius * 2} width={radius * 2} className="-rotate-90">
      <circle stroke={bg} fill="transparent" strokeWidth={stroke} r={normalizedRadius} cx={radius} cy={radius} />
      <circle
        stroke={color} fill="transparent" strokeWidth={stroke} strokeDasharray={circumference + ' ' + circumference}
        style={{ strokeDashoffset, transition: 'stroke-dashoffset 1s ease-in-out' }}
        strokeLinecap="round" r={normalizedRadius} cx={radius} cy={radius}
      />
    </svg>
  );
};

const DashboardHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(dayjs());

  // ✅ Water tracker — MUST be before early return (Rules of Hooks)
  const [waterGlasses, setWaterGlasses] = useState(() => {
    const saved = localStorage.getItem('fitverse_water_' + dayjs().format('YYYY-MM-DD'));
    return saved ? parseInt(saved) : 0;
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await dashboardService.getSummary();
        setData(res.data);
      } catch (error) {
        console.error("Failed to load dashboard data", error);
      } finally { setLoading(false); }
    };
    fetchDashboard();
  }, []);

  const greeting = useMemo(() => {
    const hour = currentTime.hour();
    if (hour >= 5 && hour < 12) return { text: "Good Morning", emoji: "🌅", bg: "bg-gradient-to-r from-orange-500 to-amber-500", glow: "shadow-orange-500/20" };
    if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "☀️", bg: "bg-gradient-to-r from-blue-500 to-indigo-600", glow: "shadow-blue-500/20" };
    if (hour >= 17 && hour < 21) return { text: "Good Evening", emoji: "🌇", bg: "bg-gradient-to-r from-indigo-600 to-purple-600", glow: "shadow-purple-500/20" };
    return { text: "Good Night", emoji: "🌙", bg: "bg-gradient-to-r from-slate-800 to-slate-900", glow: "shadow-slate-900/20" };
  }, [currentTime]);

  // Week days — computed value (not a hook, safe anywhere)
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = dayjs().startOf('week').add(i, 'day');
    return { label: d.format('ddd'), date: d.format('D'), isToday: d.isSame(dayjs(), 'day'), isPast: d.isBefore(dayjs(), 'day') };
  });

  if (loading || !data) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] space-y-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-2 border-primary-200/20 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-primary-600 rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-slate-500 text-sm font-medium animate-pulse">Syncing data...</p>
      </div>
    );
  }

  const { progressHistory, todaysWorkout, todaysDiet, upcomingBooking } = data;
  const latestProgress = progressHistory[progressHistory.length - 1] || {};

  // BMI Calculation
  let bmi = 0;
  let bmiStatus = 'Unknown';
  let bmiColor = 'text-slate-500';
  if (user?.height && user?.weight) {
    const heightInMeters = user.height / 100;
    bmi = (user.weight / (heightInMeters * heightInMeters)).toFixed(1);
    if (bmi < 18.5) { bmiStatus = 'Underweight'; bmiColor = 'text-sky-500'; }
    else if (bmi >= 18.5 && bmi < 24.9) { bmiStatus = 'Healthy'; bmiColor = 'text-emerald-500'; }
    else if (bmi >= 25 && bmi < 29.9) { bmiStatus = 'Overweight'; bmiColor = 'text-amber-500'; }
    else { bmiStatus = 'Obese'; bmiColor = 'text-red-500'; }
  }

  // Level System
  const currentXP = user?.xp || 0;
  const currentLevel = Math.floor(currentXP / 1000) + 1;
  const xpInLevel = currentXP % 1000;
  const xpProgress = (xpInLevel / 1000) * 100;

  // Chart Setup
  const getDayLabel = (dateStr) => dayjs(dateStr).format('ddd');
  const weightLabels = progressHistory.map(p => getDayLabel(p.date));
  const weightValues = progressHistory.map(p => p.weight);
  
  const weightData = {
    labels: weightLabels.length ? weightLabels : ['No Data'],
    datasets: [{
      label: 'Weight (kg)', data: weightValues.length ? weightValues : [0],
      borderColor: '#6366f1', backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true, tension: 0.4, pointBackgroundColor: '#6366f1', pointBorderColor: '#fff', pointBorderWidth: 1.5, pointRadius: 3, pointHoverRadius: 5,
    }],
  };

  const chartOpts = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { mode: 'index', intersect: false, backgroundColor: 'rgba(15, 23, 42, 0.9)', titleColor: '#fff', bodyColor: '#cbd5e1', padding: 8, cornerRadius: 8, titleFont: { size: 11 }, bodyFont: { size: 11 } } },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10, family: 'Inter', weight: '500' } } },
      y: { grid: { color: 'rgba(148, 163, 184, 0.1)', borderDash: [4, 4] }, ticks: { color: '#94a3b8', font: { size: 10, family: 'Inter' }, padding: 6 } },
    },
    interaction: { mode: 'nearest', axis: 'x', intersect: false },
  };

  // Activity Rings Logic
  const calGoal = todaysDiet?.dailyCalories || 2000;
  const calBurned = latestProgress.caloriesBurned || 0;
  const calProgress = Math.min((calBurned / calGoal) * 100, 100);

  const workoutsDone = latestProgress.workoutsCompleted || 0;
  const workoutGoal = 5;
  const workoutProgress = Math.min((workoutsDone / workoutGoal) * 100, 100);

  // Water tracker helpers
  const waterGoal = 8;
  const addWater = () => {
    if (waterGlasses < waterGoal) {
      const next = waterGlasses + 1;
      setWaterGlasses(next);
      localStorage.setItem('fitverse_water_' + dayjs().format('YYYY-MM-DD'), next);
    }
  };
  const removeWater = () => {
    if (waterGlasses > 0) {
      const next = waterGlasses - 1;
      setWaterGlasses(next);
      localStorage.setItem('fitverse_water_' + dayjs().format('YYYY-MM-DD'), next);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="max-w-7xl mx-auto space-y-5 pb-10">
      
      {/* ── HERO BANNER ──────────────────────────────────────────────────────── */}
      <motion.div variants={itemVariants} className={`relative overflow-hidden rounded-2xl p-6 sm:p-8 text-white shadow-lg ${greeting.bg} ${greeting.glow}`}>
        <div className="absolute top-0 right-0 w-[20rem] h-[20rem] bg-white/5 blur-[60px] rounded-full -translate-y-1/2 translate-x-1/3" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-[10px] font-black tracking-widest uppercase mb-3 shadow-sm">
              <HiOutlineClock /> {currentTime.format('dddd, MMMM D')}
            </div>
            <h1 className="text-2xl sm:text-3xl font-black mb-1.5 tracking-tight">
              {greeting.text}, {user?.name?.split(' ')[0] || 'Champion'} {greeting.emoji}
            </h1>
            <p className="text-sm font-medium text-white/80 max-w-lg leading-relaxed mb-5">
              Ready to crush your goals today? Stay consistent and trust the process.
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => navigate('/dashboard/workouts')} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-black hover:bg-slate-50 transition-all shadow-md flex items-center gap-2">
                <FaPlay className="text-primary-600 text-xs" /> Start Workout
              </button>
              {user?.membership ? (
                <span className="px-4 py-2.5 rounded-xl bg-amber-400/20 text-amber-100 text-sm font-bold backdrop-blur-sm border border-amber-400/30 flex items-center gap-1.5">
                  <FaCrown className="text-amber-400" /> Premium
                </span>
              ) : (
                <button onClick={() => navigate('/dashboard/profile')} className="px-4 py-2.5 rounded-xl bg-white/10 text-white text-sm font-bold backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-all">
                  Upgrade
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-lg min-w-[240px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white/60 text-[10px] font-black uppercase tracking-wider mb-0.5">Status</h3>
                <div className="flex items-center gap-1.5">
                  <FaTrophy className="text-yellow-400 text-sm" />
                  <span className="text-lg font-black text-white">Level {currentLevel}</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-white/60 text-[10px] font-black uppercase tracking-wider mb-0.5">Streak</h3>
                <div className="flex items-center justify-end gap-1">
                  <FaFire className="text-orange-400 text-sm" />
                  <span className="text-lg font-black text-white">{user?.streak || 0}</span>
                </div>
              </div>
            </div>

            <div className="space-y-1.5 mb-4">
              <div className="flex justify-between text-[10px] font-bold text-white/80">
                <span>{xpInLevel} XP</span>
                <span>1000 XP</span>
              </div>
              <div className="w-full h-2 bg-black/20 rounded-full overflow-hidden shadow-inner">
                <motion.div initial={{ width: 0 }} animate={{ width: `${xpProgress}%` }} transition={{ duration: 1, delay: 0.2 }} className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full" />
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Weight</p>
                <p className="text-base font-black text-white">{user?.weight || '--'} <span className="text-xs font-medium text-white/70">kg</span></p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-wider mb-0.5">BMI</p>
                <p className="text-base font-black text-white">{bmi || '--'} <span className={`text-[10px] font-bold ${bmiColor.replace('text-', 'text-').replace('-500', '-300')}`}>{bmiStatus}</span></p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── METRICS GRID ───────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: FaHeartbeat, label: 'Heart Rate', value: latestProgress?.heartRate || '72', sub: 'bpm', color: 'pink' },
          { icon: FaBolt, label: 'Stamina', value: `${Math.max(100 - (workoutsDone * 15), 65)}%`, sub: 'recovery', color: 'amber' },
          { icon: FaUtensils, label: 'Calories', value: (latestProgress?.caloriesBurned || todaysDiet?.dailyCalories || 0).toLocaleString(), sub: 'kcal', color: 'emerald' },
          { icon: FaStar, label: 'Badges', value: `${user?.achievements?.length || 0}`, sub: 'total', color: 'indigo' },
        ].map((s, i) => (
          <motion.div key={i} variants={itemVariants} className="glass-card p-4 flex flex-col justify-between">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-8 h-8 rounded-lg bg-${s.color}-50 dark:bg-${s.color}-500/10 text-${s.color}-500 dark:text-${s.color}-400 flex items-center justify-center text-sm`}>
                <s.icon />
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-wider">{s.label}</p>
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white flex items-baseline gap-1">
              {s.value} <span className="text-xs font-bold text-slate-400 dark:text-slate-500">{s.sub}</span>
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── RECENT BADGES (GAMIFICATION) ── */}
      {user?.achievements && user.achievements.length > 0 && (
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FaMedal className="text-yellow-500" /> Recent Unlocks
            </h3>
            <Link to="/dashboard/profile" className="text-[10px] font-bold text-primary-600 uppercase hover:underline">View All</Link>
          </div>
          <div className="flex gap-4 overflow-x-auto sidebar-scroll pb-2">
            {user.achievements.slice(0, 5).map((badge, i) => (
              <div key={i} className="min-w-[140px] bg-gradient-to-br from-amber-100 to-yellow-50 dark:from-amber-900/30 dark:to-yellow-900/10 border border-amber-200 dark:border-amber-700/30 rounded-xl p-3 flex flex-col items-center justify-center text-center">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-lg mb-2 shadow-sm border-2 border-white dark:border-slate-800">
                  <FaStar />
                </div>
                <p className="text-xs font-black text-slate-800 dark:text-amber-100 leading-tight">{badge}</p>
                <p className="text-[9px] font-bold text-amber-600 dark:text-amber-400 mt-1 uppercase">Unlocked</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* ── ACTIVITY RINGS ── */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center relative">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Daily Activity</h3>
          </div>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressRing radius={72} stroke={10} progress={calProgress} color="#ef4444" bg="rgba(239, 68, 68, 0.1)" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressRing radius={58} stroke={10} progress={workoutProgress} color="#10b981" bg="rgba(16, 185, 129, 0.1)" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressRing radius={44} stroke={10} progress={user?.streak > 0 ? 100 : 0} color="#3b82f6" bg="rgba(59, 130, 246, 0.1)" />
            </div>
            <FaRunning className="text-slate-300 dark:text-slate-600 text-xl absolute" />
          </div>

          <div className="w-full grid grid-cols-3 gap-2 text-center mt-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-red-500 mb-0.5">Move</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">{calBurned} <span className="text-[9px] text-slate-400">/ {calGoal}</span></p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-emerald-500 mb-0.5">Exercise</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">{workoutsDone} <span className="text-[9px] text-slate-400">/ {workoutGoal}</span></p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-blue-500 mb-0.5">Streak</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">{user?.streak || 0} <span className="text-[9px] text-slate-400">days</span></p>
            </div>
          </div>
        </motion.div>

        {/* ── TODAY'S WORKOUT ── */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg"><FaDumbbell size={14} /></div>
              Today's Plan
            </h3>
            <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded text-[10px] font-black uppercase tracking-wider">
              {todaysWorkout?.difficulty || 'Beginner'}
            </span>
          </div>

          {todaysWorkout && todaysWorkout.exercises?.length > 0 ? (
            <div className="flex-1 flex flex-col">
              <h4 className="text-lg font-black text-slate-900 dark:text-white mb-1 truncate">{todaysWorkout.title}</h4>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium mb-4">Target: {todaysWorkout.category.toUpperCase()}</p>
              
              <div className="space-y-2 mb-4 flex-1">
                {todaysWorkout.exercises.slice(0, 3).map((ex, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md bg-white dark:bg-slate-700 shadow-sm flex items-center justify-center font-black text-slate-400 text-xs">
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">{ex.name}</p>
                        <p className="text-[10px] text-slate-500">{ex.muscleGroup || 'Full Body'}</p>
                      </div>
                    </div>
                    <span className="text-xs font-black text-slate-600 dark:text-slate-300">
                      {ex.sets} × {ex.reps}
                    </span>
                  </div>
                ))}
              </div>

              <button onClick={() => navigate('/dashboard/workouts')} className="w-full py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-black hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
                Full Routine <FaArrowRight size={12} />
              </button>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-6">
              <FaDumbbell size={32} className="mb-2 opacity-20" />
              <p className="font-medium text-sm">Rest Day</p>
              <p className="text-xs text-slate-500">Recover & hydrate.</p>
            </div>
          )}
        </motion.div>

        {/* ── WEIGHT PROGRESS CHART ── */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <div className="p-1.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg"><FaChartLine size={14} /></div>
              Weight Progress
            </h3>
            <button onClick={() => navigate('/dashboard/progress')} className="text-xs font-bold text-primary-600 hover:underline">View All</button>
          </div>
          
          <div className="flex-1 min-h-[160px]">
            {progressHistory.length > 0 ? (
              <Line data={weightData} options={chartOpts} />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-400 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-xl p-4 text-center">
                <FaChartLine size={24} className="mb-2 opacity-20" />
                <p className="text-xs font-medium">No Data Available</p>
              </div>
            )}
          </div>
        </motion.div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        
        {/* ── NEXT SESSION WIDGET ── */}
        <motion.div variants={itemVariants} className="bg-slate-900 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-[50px] rounded-full" />
          
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-white flex items-center gap-2">
                <div className="p-1.5 bg-white/10 text-white rounded-lg backdrop-blur-md"><FaCalendarCheck size={14} /></div>
                Next Live Session
              </h3>
            </div>

            {upcomingBooking ? (
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 backdrop-blur-md flex-1 flex flex-col justify-between">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white/10 border border-white/20 shrink-0">
                    <img src={upcomingBooking.trainer?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=Trainer"} alt="Trainer" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-lg font-black text-white leading-none mb-1">{upcomingBooking.trainer?.name || 'Trainer'}</h4>
                    <p className="text-blue-400 font-bold text-xs mb-2">{upcomingBooking.trainer?.specialization || 'Fitness Coach'}</p>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 text-[9px] font-black uppercase tracking-wider border border-emerald-500/30">
                      Confirmed
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5"><HiOutlineClock /> Time</p>
                    <p className="font-bold text-white text-sm truncate">{dayjs(upcomingBooking.date).format('MMM D')}</p>
                    <p className="text-white/80 text-xs truncate">{upcomingBooking.slot || upcomingBooking.time}</p>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5"><HiLocationMarker /> Where</p>
                    <p className="font-bold text-white text-sm">Video Call</p>
                    <p className="text-blue-400 text-xs">FitVerse Meet</p>
                  </div>
                </div>

                <button onClick={() => navigate('/dashboard/trainers/bookings')} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black transition-colors shadow-lg shadow-blue-600/30">
                  Prepare for Session
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-xl p-6">
                <FaCalendarCheck size={32} className="text-white/20 mb-3" />
                <p className="text-sm font-bold text-white mb-1">No Upcoming Sessions</p>
                <p className="text-xs text-white/60 mb-4 max-w-[200px]">Book a 1-on-1 session with an expert trainer.</p>
                <button onClick={() => navigate('/dashboard/trainers')} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors">
                  Find a Trainer
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── AI INSIGHT ── */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-4 right-4 opacity-10"><FaRobot size={100} /></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 mb-4">
              <FaRobot className="text-white text-sm" />
              <span className="text-white font-black uppercase tracking-wider text-[10px]">AI Coach</span>
            </div>
            
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug mb-4">
              "Your sleep score and hydration levels indicate you are primed for a high-intensity session today. Go all out!"
            </h2>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse shrink-0">
                <FaBolt className="text-yellow-400 text-sm" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Readiness</p>
                <p className="text-white text-lg font-black leading-none">94% <span className="text-emerald-400 text-xs ml-1">Optimal</span></p>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard/ai')} className="px-4 py-2 bg-white text-purple-900 rounded-xl text-sm font-black hover:bg-slate-50 transition-colors shadow-md">
              Ask Coach
            </button>
          </div>
        </motion.div>

      </div>

      {/* ── QUICK ACTIONS + WATER + WEEKLY CALENDAR ROW ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-5">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <HiLightningBolt className="text-yellow-500" /> Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Log Workout', icon: FaDumbbell, color: 'bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400', path: '/dashboard/workouts' },
              { label: 'Track Diet', icon: FaAppleAlt, color: 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400', path: '/dashboard/diets' },
              { label: 'Find Trainer', icon: FaUsers, color: 'bg-blue-100 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400', path: '/dashboard/trainers' },
              { label: 'AI Coach', icon: FaRobot, color: 'bg-purple-100 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400', path: '/dashboard/ai' },
            ].map((a, i) => (
              <button key={i} onClick={() => navigate(a.path)}
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all group">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${a.color} group-hover:scale-110 transition-transform`}>
                  <a.icon />
                </div>
                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Water Intake Tracker */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-5 shadow-lg relative overflow-hidden flex flex-col">
          <div className="absolute bottom-0 right-0 w-28 h-28 bg-white/10 blur-2xl rounded-full" />
          <div className="relative z-10 flex flex-col h-full">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-white font-black text-sm flex items-center gap-2">
                <FaWater /> Water Intake
              </h3>
              <span className="text-white/80 text-xs font-bold">{waterGlasses}/{waterGoal} glasses</span>
            </div>
            <p className="text-white/70 text-[10px] mb-4">Daily goal: {waterGoal * 250}ml</p>

            {/* Glasses row */}
            <div className="flex gap-1.5 flex-wrap mb-4 flex-1 items-center">
              {Array.from({ length: waterGoal }).map((_, i) => (
                <div key={i}
                  className={`w-7 h-7 rounded-lg border-2 border-white/40 flex items-center justify-center text-xs transition-all ${
                    i < waterGlasses ? 'bg-white text-blue-600' : 'bg-white/10 text-white/30'
                  }`}>
                  <FaWater size={10} />
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={removeWater} disabled={waterGlasses === 0}
                className="flex-1 py-2 rounded-xl bg-white/20 text-white font-black text-sm hover:bg-white/30 disabled:opacity-40 transition-all">−</button>
              <button onClick={addWater} disabled={waterGlasses >= waterGoal}
                className="flex-1 py-2 rounded-xl bg-white text-blue-700 font-black text-sm hover:bg-blue-50 disabled:opacity-40 transition-all">+ Glass</button>
            </div>
          </div>
        </motion.div>

        {/* Weekly Calendar Strip */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-5 flex flex-col">
          <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-4">
            <HiSparkles className="text-primary-500" /> This Week
          </h3>
          <div className="grid grid-cols-7 gap-1 flex-1">
            {weekDays.map((d, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">{d.label}</span>
                <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all ${
                  d.isToday
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                    : d.isPast
                    ? 'bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-slate-100 dark:bg-white/5 text-slate-500 dark:text-slate-400'
                }`}>
                  {d.date}
                </div>
                <div className={`w-1.5 h-1.5 rounded-full ${
                  d.isToday ? 'bg-primary-500' : d.isPast ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                }`} />
              </div>
            ))}
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[10px] font-bold text-slate-500">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              <span className="text-[10px] font-bold text-slate-500">Today</span>
            </div>
            <button onClick={() => navigate('/dashboard/progress')} className="text-[10px] font-black text-primary-600 hover:underline uppercase">History</button>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};

export default DashboardHome;
