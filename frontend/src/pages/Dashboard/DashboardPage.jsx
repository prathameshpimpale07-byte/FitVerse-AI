import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { dashboardService } from '../../services/services';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaFire, FaDumbbell, FaTrophy, FaBolt, 
  FaCrown, FaCalendarCheck, FaChartLine, FaArrowRight, FaPlay, FaUtensils, FaRobot, FaRunning,
  FaWater, FaAppleAlt, FaUsers, FaCheckCircle
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
  const [waterIntakeMl, setWaterIntakeMl] = useState(0);

  const todayStr = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 60000);
    return () => clearInterval(timer);
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await dashboardService.getSummary();
      setData(res.data);
      if (res.data?.userDietPlan) {
        setWaterIntakeMl(res.data.userDietPlan.waterIntakeToday || 0);
      }
    } catch (error) {
      console.error("Failed to load dashboard data", error);
    } finally { setLoading(false); }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const greeting = useMemo(() => {
    const hour = currentTime.hour();
    if (hour >= 5 && hour < 12) return { text: "Good Morning", emoji: "🌅", bg: "bg-gradient-to-r from-orange-500 to-amber-500", glow: "shadow-orange-500/20" };
    if (hour >= 12 && hour < 17) return { text: "Good Afternoon", emoji: "☀️", bg: "bg-gradient-to-r from-blue-500 to-indigo-600", glow: "shadow-blue-500/20" };
    if (hour >= 17 && hour < 21) return { text: "Good Evening", emoji: "🌇", bg: "bg-gradient-to-r from-indigo-600 to-purple-600", glow: "shadow-purple-500/20" };
    return { text: "Good Night", emoji: "🌙", bg: "bg-gradient-to-r from-slate-800 to-slate-900", glow: "shadow-slate-900/20" };
  }, [currentTime]);

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
        <p className="text-slate-500 text-sm font-medium animate-pulse">Syncing user data...</p>
      </div>
    );
  }

  const { progressHistory, userDietPlan, activeWorkoutPlan, todaysWorkoutRecommendation, workoutStats, upcomingBooking } = data;

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
  const calGoal = userDietPlan?.dailyCaloriesGoal || 2000;
  const calConsumed = userDietPlan?.consumedCaloriesToday || 0;
  const calProgress = Math.min((calConsumed / calGoal) * 100, 100);

  const workoutsDone = workoutStats?.totalWorkoutsCompleted || 0;
  const workoutGoal = 5;
  const workoutProgress = Math.min((workoutsDone / workoutGoal) * 100, 100);

  // Water tracker logic (syncs with backend UserDietPlan waterLogs via /api/diets/water)
  const targetWaterMl = userDietPlan?.targetWater || 3500;
  const waterGlasses = Math.floor(waterIntakeMl / 250);
  const targetGlasses = Math.ceil(targetWaterMl / 250);

  const addWater = async () => {
    try {
      const res = await api.post('/diets/water', { date: todayStr, amount: 250 });
      if (res.success) {
        setWaterIntakeMl(prev => prev + 250);
        toast.success("Logged +250ml Water 💧");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update water intake");
    }
  };

  const removeWater = async () => {
    if (waterIntakeMl < 250) return;
    try {
      const res = await api.post('/diets/water', { date: todayStr, amount: -250 });
      if (res.success) {
        setWaterIntakeMl(prev => Math.max(0, prev - 250));
        toast.success("Updated Water Intake 💧");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not update water intake");
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
              {greeting.text}, {user?.name?.split(' ')[0] || 'Fitness Champion'} {greeting.emoji}
            </h1>
            <p className="text-sm font-medium text-white/80 max-w-lg leading-relaxed mb-5">
              Goal: <span className="font-extrabold uppercase tracking-wide text-white">{user?.fitnessGoal ? user.fitnessGoal.replace('_', ' ') : 'General Fitness'}</span>. Stay consistent and crush your targets!
            </p>
            
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => navigate('/dashboard/workouts')} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-sm font-black hover:bg-slate-50 transition-all shadow-md flex items-center gap-2 cursor-pointer">
                <FaPlay className="text-primary-600 text-xs" /> Launch Workout
              </button>
              <button onClick={() => navigate('/dashboard/diets')} className="px-5 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-xl text-sm font-black backdrop-blur-sm border border-white/20 transition-all flex items-center gap-2 cursor-pointer">
                <FaUtensils className="text-white text-xs" /> View Diet Plan
              </button>
            </div>
          </div>

          <div className="w-full md:w-auto bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl shadow-lg min-w-[240px]">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white/60 text-[10px] font-black uppercase tracking-wider mb-0.5">User Level</h3>
                <div className="flex items-center gap-1.5">
                  <FaTrophy className="text-yellow-400 text-sm" />
                  <span className="text-lg font-black text-white">{user?.streak > 5 ? 'Elite Athlete' : 'Active Member'}</span>
                </div>
              </div>
              <div className="text-right">
                <h3 className="text-white/60 text-[10px] font-black uppercase tracking-wider mb-0.5">Daily Streak</h3>
                <div className="flex items-center justify-end gap-1">
                  <FaFire className="text-orange-400 text-sm animate-pulse" />
                  <span className="text-lg font-black text-white">{user?.streak || 0} Days</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-3">
              <div>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-wider mb-0.5">Weight</p>
                <p className="text-base font-black text-white">{user?.weight || '--'} <span className="text-xs font-medium text-white/70">kg</span></p>
              </div>
              <div>
                <p className="text-white/50 text-[10px] font-black uppercase tracking-wider mb-0.5">BMI Score</p>
                <p className="text-base font-black text-white">{bmi || '--'} <span className={`text-[10px] font-bold ${bmiColor.replace('text-', 'text-').replace('-500', '-300')}`}>{bmiStatus}</span></p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── METRICS GRID (REAL PROJECT DATA ONLY) ─────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { 
            icon: FaAppleAlt, 
            label: 'Diet Calories', 
            value: calConsumed.toLocaleString(), 
            sub: `/ ${calGoal} kcal`, 
            color: 'emerald' 
          },
          { 
            icon: FaFire, 
            label: 'Calories Burned', 
            value: (workoutStats?.caloriesBurnedToday || workoutStats?.totalCaloriesBurned || 0).toLocaleString(), 
            sub: 'kcal burned', 
            color: 'orange' 
          },
          { 
            icon: FaDumbbell, 
            label: 'Workouts Logged', 
            value: workoutsDone, 
            sub: 'sessions', 
            color: 'indigo' 
          },
          { 
            icon: FaWater, 
            label: 'Hydration', 
            value: (waterIntakeMl / 1000).toFixed(1), 
            sub: `/ ${(targetWaterMl / 1000).toFixed(1)} L`, 
            color: 'blue' 
          },
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* ── ACTIVITY RINGS ── */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center relative">
          <div className="w-full flex items-center justify-between mb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white">Daily Progress Rings</h3>
          </div>
          
          <div className="relative w-36 h-36 flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressRing radius={72} stroke={10} progress={calProgress} color="#10b981" bg="rgba(16, 185, 129, 0.1)" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressRing radius={58} stroke={10} progress={workoutProgress} color="#6366f1" bg="rgba(99, 102, 241, 0.1)" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <ProgressRing radius={44} stroke={10} progress={Math.min((waterIntakeMl / targetWaterMl) * 100, 100)} color="#3b82f6" bg="rgba(59, 130, 246, 0.1)" />
            </div>
            <FaRunning className="text-slate-300 dark:text-slate-600 text-xl absolute" />
          </div>

          <div className="w-full grid grid-cols-3 gap-2 text-center mt-6">
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-emerald-500 mb-0.5">Diet Kcal</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">{calConsumed} <span className="text-[9px] text-slate-400">/ {calGoal}</span></p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-indigo-500 mb-0.5">Workouts</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">{workoutsDone} <span className="text-[9px] text-slate-400">/ {workoutGoal}</span></p>
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-wider text-blue-500 mb-0.5">Water</p>
              <p className="text-xs font-black text-slate-900 dark:text-white">{(waterIntakeMl / 1000).toFixed(1)} <span className="text-[9px] text-slate-400">/ {(targetWaterMl / 1000).toFixed(1)}L</span></p>
            </div>
          </div>
        </motion.div>

        {/* ── RECENT WORKOUT ACTIVITY & QUICK SESSIONS (Replaces old workout plan box) ── */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm p-5 flex flex-col justify-between h-full">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <div className="p-1.5 bg-violet-100 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 rounded-lg"><FaDumbbell size={14} /></div>
                Recent Workout Sessions
              </h3>
              <button 
                onClick={() => navigate('/dashboard/workouts?tab=history')} 
                className="text-xs font-bold text-primary-600 hover:underline cursor-pointer"
              >
                History &rarr;
              </button>
            </div>

            {workoutStats?.recentWorkouts && workoutStats.recentWorkouts.length > 0 ? (
              <div className="space-y-2.5 mb-4">
                {workoutStats.recentWorkouts.map((w, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center text-xs font-black shrink-0">
                        🏋️
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{w.workoutName || 'Training Session'}</p>
                        <p className="text-[10px] text-slate-400 font-bold">
                          {w.duration ? `${w.duration} min` : '30 min'} • {dayjs(w.completedAt).format('MMM D')}
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-orange-500 bg-orange-50 dark:bg-orange-950/40 px-2 py-0.5 rounded-md border border-orange-500/20 shrink-0">
                      🔥 {w.caloriesBurned || 250} kcal
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-center mb-4 border border-dashed border-slate-200 dark:border-slate-800">
                <FaDumbbell className="text-slate-300 dark:text-slate-700 text-2xl mx-auto mb-2 opacity-50" />
                <p className="text-xs font-bold text-slate-600 dark:text-slate-300">No workout sessions logged yet</p>
                <p className="text-[10px] text-slate-400 mt-1">Start your training session today to record your progress!</p>
              </div>
            )}
          </div>

          <button 
            onClick={() => navigate('/dashboard/workouts')} 
            className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 cursor-pointer mt-2"
          >
            <FaPlay size={10} /> Start Training Session &rarr;
          </button>
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
                <p className="text-xs font-medium">No Progress Logs Yet</p>
                <button onClick={() => navigate('/dashboard/progress')} className="mt-2 text-xs font-bold text-primary-600 hover:underline">Log Weight</button>
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
                Next Trainer Session
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
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-wider mb-1 flex items-center gap-1.5"><HiLocationMarker /> Location</p>
                    <p className="font-bold text-white text-sm">Video Session</p>
                  </div>
                </div>

                <button onClick={() => navigate('/dashboard/trainers/bookings')} className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-black transition-colors shadow-lg shadow-blue-600/30 cursor-pointer">
                  Manage Session &rarr;
                </button>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center bg-white/5 border border-white/10 rounded-xl p-6">
                <FaCalendarCheck size={32} className="text-white/20 mb-3" />
                <p className="text-sm font-bold text-white mb-1">No Booked Trainer Sessions</p>
                <p className="text-xs text-white/60 mb-4 max-w-[200px]">Book a 1-on-1 personal session with an expert trainer.</p>
                <button onClick={() => navigate('/dashboard/trainers')} className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-black hover:bg-slate-100 transition-colors cursor-pointer">
                  Browse Trainers
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── AI COACH MOTIVATION INSIGHT ── */}
        <motion.div variants={itemVariants} className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-6 shadow-lg relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-4 right-4 opacity-10"><FaRobot size={100} /></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20 mb-4">
              <FaRobot className="text-white text-sm" />
              <span className="text-white font-black uppercase tracking-wider text-[10px]">AI Fitness Coach</span>
            </div>
            
            <h2 className="text-lg sm:text-xl font-black text-white leading-snug mb-4">
              "{activeWorkoutPlan?.motivation || 'Consistency is the key to transformation. Stay focused on your goals!'}"
            </h2>
          </div>

          <div className="relative z-10 flex items-center justify-between mt-4 pt-4 border-t border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center animate-pulse shrink-0">
                <FaBolt className="text-yellow-400 text-sm" />
              </div>
              <div>
                <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-0.5">Target Goal</p>
                <p className="text-white text-base font-black uppercase">{user?.fitnessGoal ? user.fitnessGoal.replace('_', ' ') : 'Fitness'}</p>
              </div>
            </div>
            <button onClick={() => navigate('/dashboard/ai')} className="px-4 py-2 bg-white text-purple-900 rounded-xl text-sm font-black hover:bg-slate-50 transition-colors shadow-md cursor-pointer">
              Chat with AI Coach
            </button>
          </div>
        </motion.div>

      </div>

      {/* ── QUICK ACTIONS + WATER TRACKER (DB SYNCED) + WEEKLY CALENDAR ── */}
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
                className="flex flex-col items-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all group cursor-pointer">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${a.color} group-hover:scale-110 transition-transform`}>
                  <a.icon />
                </div>
                <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-wider text-center leading-tight">{a.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Today's Active Diet & Macros Overview (Replaces blue hydration widget) */}
        <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <FaAppleAlt className="text-emerald-500" /> Today's Diet & Macros
              </h3>
              <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {userDietPlan?.completedMealsCount || 0} LOGGED
              </span>
            </div>

            {/* Macro Consumed vs Target Cards */}
            <div className="grid grid-cols-3 gap-2 mb-4 text-center">
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase block mb-0.5">Protein</span>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {userDietPlan?.consumedProteinToday || 0}g <span className="text-[9px] text-slate-400 font-normal">/ {userDietPlan?.protein || '140g'}</span>
                </span>
                <div className="w-full h-1 bg-emerald-500/20 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(((userDietPlan?.consumedProteinToday || 0) / (parseInt(userDietPlan?.protein) || 140)) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                <span className="text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase block mb-0.5">Carbs</span>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {userDietPlan?.consumedCarbsToday || 0}g <span className="text-[9px] text-slate-400 font-normal">/ {userDietPlan?.carbs || '220g'}</span>
                </span>
                <div className="w-full h-1 bg-amber-500/20 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(((userDietPlan?.consumedCarbsToday || 0) / (parseInt(userDietPlan?.carbs) || 220)) * 100, 100)}%` }} />
                </div>
              </div>

              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                <span className="text-[9px] font-black text-rose-600 dark:text-rose-400 uppercase block mb-0.5">Fat</span>
                <span className="text-xs font-black text-slate-900 dark:text-white block">
                  {userDietPlan?.consumedFatToday || 0}g <span className="text-[9px] text-slate-400 font-normal">/ {userDietPlan?.fat || '65g'}</span>
                </span>
                <div className="w-full h-1 bg-rose-500/20 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${Math.min(((userDietPlan?.consumedFatToday || 0) / (parseInt(userDietPlan?.fat) || 65)) * 100, 100)}%` }} />
                </div>
              </div>
            </div>

            {/* Today's Meals list */}
            {userDietPlan && userDietPlan.todayMeals && userDietPlan.todayMeals.length > 0 ? (
              <div className="space-y-2 mb-4">
                {userDietPlan.todayMeals.slice(0, 3).map((m, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-[10px] font-black shrink-0">
                        {idx + 1}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-slate-900 dark:text-white truncate">{m.meal}</p>
                        <p className="text-[9px] text-slate-400 font-bold truncate">{m.foods ? m.foods.slice(0, 2).join(', ') : 'Healthy Meal'}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20 shrink-0">
                      {m.calories || 400} kcal
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/30 text-center mb-4 border border-dashed border-slate-200 dark:border-slate-800">
                <p className="text-xs font-bold text-slate-500">No diet plan active for today</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Generate your AI Diet Plan in seconds!</p>
              </div>
            )}
          </div>

          <button onClick={() => navigate('/dashboard/diets')} className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-md shadow-emerald-500/20 cursor-pointer">
            Manage Diet & Log Meals &rarr;
          </button>
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
              <span className="text-[10px] font-bold text-slate-500">Passed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />
              <span className="text-[10px] font-bold text-slate-500">Today</span>
            </div>
            <button onClick={() => navigate('/dashboard/progress')} className="text-[10px] font-black text-primary-600 hover:underline uppercase cursor-pointer">Progress</button>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};

export default DashboardHome;
