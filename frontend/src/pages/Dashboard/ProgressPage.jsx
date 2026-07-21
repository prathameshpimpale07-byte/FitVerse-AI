import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import {
  FaPlus, FaBrain, FaChartLine, FaTrash,
  FaWeight, FaFire, FaTint, FaDumbbell
} from 'react-icons/fa';
import api from '../../services/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';
import { useAuth } from '../../context/AuthContext';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

const EMPTY_FORM = {
  weight: '', bodyFat: '', muscleMass: '',
  chest: '', waist: '', hips: '', arms: '',
  workoutsCompleted: '', caloriesBurned: '', waterIntake: '', notes: ''
};

const Field = ({ label, name, value, onChange, placeholder, step = '0.1', accent = 'violet' }) => (
  <div>
    <label className="block text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
      {label}
    </label>
    <input
      type="number" step={step} name={name}
      value={value} onChange={onChange} placeholder={placeholder}
      className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-medium
        bg-slate-50 dark:bg-slate-800/60
        border border-slate-200 dark:border-slate-700
        text-slate-800 dark:text-white
        placeholder:text-slate-300 dark:placeholder:text-slate-600
        focus:outline-none focus:ring-2 focus:ring-${accent}-500/30 focus:border-${accent}-500
        transition-all duration-200`}
    />
  </div>
);

const ProgressPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [logs, setLogs] = useState([]);
  const [logsLoading, setLogsLoading] = useState(true);
  const [aiReport, setAiReport] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // ── Load existing logs on mount
  useEffect(() => {
    (async () => {
      setLogsLoading(true);
      try {
        const res = await api.get('/progress');
        if (res?.success) {
          setLogs((res.progress || []).sort((a, b) => new Date(a.date) - new Date(b.date)));
        }
      } catch { /* silent */ }
      finally { setLogsLoading(false); }
    })();
  }, []);

  const handleChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  // ── Save log
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([k, v]) => [k, v === '' ? 0 : isNaN(Number(v)) ? v : Number(v)])
      );
      const res = await api.post('/progress', { ...payload, date: new Date().toISOString() });
      if (res.success) {
        toast.success('✅ Progress saved!');
        setLogs(prev => [...prev, res.entry].sort((a, b) => new Date(a.date) - new Date(b.date)));
        setFormData(EMPTY_FORM);
      } else { toast.error('Save failed. Try again.'); }
    } catch { toast.error('Something went wrong.'); }
    finally { setSubmitting(false); }
  };

  // ── Delete log
  const handleDelete = async (id) => {
    if (!window.confirm('Remove this log entry?')) return;
    setDeletingId(id);
    try {
      const res = await api.delete(`/progress/${id}`);
      if (res.success) {
        setLogs(prev => prev.filter(l => l._id !== id));
        toast.success('Log deleted.');
      }
    } catch { toast.error('Delete failed.'); }
    finally { setDeletingId(null); }
  };

  // ── AI Analysis
  const handleAI = async () => {
    setAnalyzing(true);
    setAiReport(null);
    try {
      const res = await api.post('/ai/progress-analysis');
      if (res.success) setAiReport(res.analysis);
      else toast.error(res.message || 'AI analysis failed.');
    } catch { toast.error('Failed to connect to AI.'); }
    finally { setAnalyzing(false); }
  };

  // ── Chart Data
  const chartLabels = logs.map(l => dayjs(l.date).format('D MMM'));
  const weightData = {
    labels: chartLabels,
    datasets: [{
      label: 'Weight (kg)',
      data: logs.map(l => l.weight || null),
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139,92,246,0.08)',
      fill: true, tension: 0.4,
      pointRadius: 5, pointBackgroundColor: '#8b5cf6',
      pointBorderColor: '#fff', pointBorderWidth: 2
    }]
  };
  const fatData = {
    labels: chartLabels,
    datasets: [{
      label: 'Body Fat (%)',
      data: logs.map(l => l.bodyFat || null),
      borderColor: '#10b981',
      backgroundColor: 'rgba(16,185,129,0.08)',
      fill: true, tension: 0.4,
      pointRadius: 5, pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff', pointBorderWidth: 2
    }]
  };

  const chartOptions = (label) => ({
    responsive: true, maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index', intersect: false,
        backgroundColor: '#1e293b',
        titleColor: '#fff', bodyColor: '#94a3b8',
        borderColor: '#334155', borderWidth: 1,
        padding: 10,
        callbacks: { label: (ctx) => ` ${ctx.parsed.y} ${label}` }
      }
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 11, weight: '600' } }, border: { display: false } },
      y: { grid: { color: 'rgba(100,116,139,0.1)', drawBorder: false }, ticks: { color: '#94a3b8', font: { size: 11, weight: '600' } }, border: { display: false }, beginAtZero: false }
    }
  });

  // ── BMI helper
  const calcBMI = (w) => {
    const h = user?.height;
    if (!w || !h) return null;
    return (w / Math.pow(h / 100, 2)).toFixed(1);
  };

  const latestLog = logs[logs.length - 1];
  const prevLog = logs[logs.length - 2];

  return (
    <div className="max-w-3xl mx-auto pb-16 space-y-8">

      {/* ─────────── Header ─────────── */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-3">
          <span className="w-9 h-9 bg-violet-100 dark:bg-violet-500/20 text-violet-600 dark:text-violet-400 rounded-xl flex items-center justify-center text-base">
            <FaChartLine />
          </span>
          Progress Tracker
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1.5 font-medium">
          Log your metrics, view trends and get AI coaching.
        </p>
      </div>

      {/* ─────────── 1. LOG FORM ─────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center text-sm font-black">
            <FaPlus />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Log Today's Metrics</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Fill in what you have — all fields are optional</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Core Stats */}
          <div>
            <p className="text-[10px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-3">Core Stats</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Weight kg" name="weight" value={formData.weight} onChange={handleChange} placeholder="72.5" accent="violet" />
              <Field label="Body Fat %" name="bodyFat" value={formData.bodyFat} onChange={handleChange} placeholder="15.0" accent="violet" />
              <Field label="Muscle kg" name="muscleMass" value={formData.muscleMass} onChange={handleChange} placeholder="38.0" accent="violet" />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800" />

          {/* Measurements */}
          <div>
            <p className="text-[10px] font-black text-sky-600 dark:text-sky-400 uppercase tracking-widest mb-3">Measurements (cm)</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <Field label="Chest" name="chest" value={formData.chest} onChange={handleChange} placeholder="98" accent="sky" />
              <Field label="Waist" name="waist" value={formData.waist} onChange={handleChange} placeholder="80" accent="sky" />
              <Field label="Hips" name="hips" value={formData.hips} onChange={handleChange} placeholder="95" accent="sky" />
              <Field label="Arms" name="arms" value={formData.arms} onChange={handleChange} placeholder="36" accent="sky" />
            </div>
          </div>

          <div className="border-t border-slate-100 dark:border-slate-800" />

          {/* Activity */}
          <div>
            <p className="text-[10px] font-black text-orange-600 dark:text-orange-400 uppercase tracking-widest mb-3">Activity</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Field label="Workouts" name="workoutsCompleted" value={formData.workoutsCompleted} onChange={handleChange} placeholder="1" step="1" accent="orange" />
              <Field label="Calories Burned" name="caloriesBurned" value={formData.caloriesBurned} onChange={handleChange} placeholder="450" step="1" accent="orange" />
              <Field label="Water (L)" name="waterIntake" value={formData.waterIntake} onChange={handleChange} placeholder="3.0" accent="orange" />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-1">
            <button type="button" onClick={() => setFormData(EMPTY_FORM)}
              className="text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
              Clear
            </button>
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-5 sm:px-7 py-2.5 sm:py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black rounded-2xl shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50">
              {submitting
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                : <><FaPlus size={11} /> Save Log</>
              }
            </button>
          </div>
        </form>
      </motion.section>

      {/* ─────────── 2. SAVED LOGS + CHARTS ─────────── */}
      {!logsLoading && logs.length > 0 && (
        <motion.section
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="space-y-5"
        >
          {/* Quick Stats row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: <FaWeight />, label: 'Current Weight', value: latestLog?.weight ? `${latestLog.weight} kg` : '—', color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-50 dark:bg-violet-500/10' },
              { icon: <FaChartLine />, label: 'Body Fat', value: latestLog?.bodyFat ? `${latestLog.bodyFat}%` : '—', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-50 dark:bg-emerald-500/10' },
              { icon: <FaDumbbell />, label: 'BMI', value: calcBMI(latestLog?.weight) || '—', color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-50 dark:bg-sky-500/10' },
              { icon: <FaFire />, label: 'Calories (last)', value: latestLog?.caloriesBurned ? `${latestLog.caloriesBurned} kcal` : '—', color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-50 dark:bg-orange-500/10' },
            ].map((s, i) => (
              <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-3.5 sm:p-4 flex items-center gap-2.5 sm:gap-3">
                <span className={`w-8 h-8 sm:w-9 sm:h-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center text-xs sm:text-sm shrink-0`}>
                  {s.icon}
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] sm:text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate">{s.label}</p>
                  <p className={`text-sm sm:text-base font-black truncate ${s.color}`}>{s.value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Charts — only if at least 2 points */}
          {logs.filter(l => l.weight).length >= 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Weight Trend</p>
                <div className="h-44"><Line data={weightData} options={chartOptions('kg')} /></div>
              </div>
              {logs.filter(l => l.bodyFat).length >= 2 && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5">
                  <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-4">Body Fat Trend</p>
                  <div className="h-44"><Line data={fatData} options={chartOptions('%')} /></div>
                </div>
              )}
            </div>
          )}

          {/* Log History Table */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">Log History</p>
              <span className="text-xs text-slate-400 dark:text-slate-500 font-semibold">{logs.length} entries</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm min-w-[500px]">
                <thead>
                  <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-black">
                    <th className="px-4 sm:px-5 py-3 text-left">Date</th>
                    <th className="px-3 sm:px-4 py-3 text-center">Weight</th>
                    <th className="px-3 sm:px-4 py-3 text-center">Fat %</th>
                    <th className="px-3 sm:px-4 py-3 text-center">BMI</th>
                    <th className="px-3 sm:px-4 py-3 text-center">Calories</th>
                    <th className="px-3 sm:px-4 py-3 text-center">Water</th>
                    <th className="px-3 sm:px-4 py-3 text-right"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {[...logs].reverse().map((log) => (
                      <motion.tr
                        key={log._id}
                        layout
                        exit={{ opacity: 0, height: 0 }}
                        className="border-b border-slate-50 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors"
                      >
                        <td className="px-4 sm:px-5 py-3.5 font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap">
                          {dayjs(log.date).format('DD MMM YYYY')}
                        </td>
                        <td className="px-3 sm:px-4 py-3.5 text-center whitespace-nowrap">
                          <span className="text-violet-600 dark:text-violet-400 font-bold">{log.weight ? `${log.weight} kg` : '—'}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3.5 text-center whitespace-nowrap">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">{log.bodyFat ? `${log.bodyFat}%` : '—'}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3.5 text-center whitespace-nowrap">
                          <span className="text-sky-600 dark:text-sky-400 font-bold">{calcBMI(log.weight) || '—'}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3.5 text-center whitespace-nowrap">
                          <span className="text-orange-500 dark:text-orange-400 font-semibold">{log.caloriesBurned ? `${log.caloriesBurned}` : '—'}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3.5 text-center whitespace-nowrap">
                          <span className="text-slate-500 dark:text-slate-400 font-semibold">{log.waterIntake ? `${log.waterIntake}L` : '—'}</span>
                        </td>
                        <td className="px-3 sm:px-4 py-3.5 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleDelete(log._id)}
                            disabled={deletingId === log._id}
                            className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all disabled:opacity-40 cursor-pointer ml-auto"
                            title="Delete log"
                          >
                            {deletingId === log._id
                              ? <div className="w-3.5 h-3.5 border-2 border-rose-400 border-t-transparent rounded-full animate-spin" />
                              : <FaTrash size={12} />
                            }
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </motion.section>
      )}

      {/* Empty state if no logs yet */}
      {!logsLoading && logs.length === 0 && (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-10 text-center">
          <FaChartLine className="text-slate-300 dark:text-slate-700 text-3xl mx-auto mb-3" />
          <p className="text-slate-400 dark:text-slate-500 text-sm font-semibold">No logs yet — fill the form above and save your first entry!</p>
        </div>
      )}

      {/* Loading state */}
      {logsLoading && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-slate-200 dark:border-slate-700 border-t-violet-500 rounded-full animate-spin" />
        </div>
      )}

      {/* ─────────── 3. AI PROGRESS COACH ─────────── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm overflow-hidden"
      >
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
          <span className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm">
            <FaBrain />
          </span>
          <div>
            <h2 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wide">AI Progress Coach</h2>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Personalized analysis from your logged data</p>
          </div>
        </div>

        <div className="p-6">
          {!aiReport && !analyzing && (
            <div className="text-center py-5">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold mb-4">
                {logs.length === 0
                  ? 'Save at least one log entry to enable AI analysis.'
                  : `${logs.length} log${logs.length > 1 ? 's' : ''} available — generate your AI fitness report!`
                }
              </p>
              <button
                onClick={handleAI}
                disabled={logs.length === 0}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white text-sm font-black rounded-2xl shadow-lg shadow-indigo-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <FaBrain size={13} /> Generate AI Report
              </button>
            </div>
          )}

          {analyzing && (
            <div className="text-center py-8">
              <div className="w-12 h-12 border-4 border-indigo-100 dark:border-slate-700 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-700 dark:text-slate-300 font-bold text-sm">Analyzing your fitness data...</p>
              <p className="text-slate-400 text-xs font-medium mt-1">This may take a few seconds</p>
            </div>
          )}

          {aiReport && (
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
                {aiReport.split('\n').map((line, i) => {
                  const t = line.trim();
                  if (!t) return null;
                  if (t.startsWith('•')) return (
                    <div key={i} className="flex items-start gap-3">
                      <span className="text-violet-500 text-xs mt-1 shrink-0">●</span>
                      <p className="text-slate-700 dark:text-slate-300 text-sm font-medium leading-relaxed">{t.slice(1).trim()}</p>
                    </div>
                  );
                  if (t.toLowerCase().startsWith('recommendation')) return (
                    <p key={i} className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest pt-2">{t}</p>
                  );
                  return <p key={i} className="text-slate-900 dark:text-white font-bold text-sm leading-relaxed">{t}</p>;
                })}
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-slate-400 font-medium">Report generated just now</p>
                <button onClick={handleAI} className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
                  ↺ Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.section>

    </div>
  );
};

export default ProgressPage;
