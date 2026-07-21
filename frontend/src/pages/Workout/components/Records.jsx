import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaPlus, FaCheckCircle, FaWeightHanging, FaStopwatch, FaRunning, FaTrash } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const recordIcons = {
  "bench press": FaWeightHanging,
  "squat": FaWeightHanging,
  "deadlift": FaWeightHanging,
  "plank": FaStopwatch,
  "fastest 1k run": FaRunning
};

const Records = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    exerciseName: 'Bench Press',
    value: '',
    unit: 'kg'
  });

  const fetchRecords = async () => {
    try {
      const res = await api.get('/records');
      if (res.success) {
        setRecords(res.records);
      }
    } catch (err) {
      console.error("Error fetching personal records:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.delete(`/records/${id}`);
      if (res.success) {
        toast.success("Record deleted!");
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete record.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Set matching unit automatically
    if (name === 'exerciseName') {
      const unit = (value.toLowerCase().includes("plank") || value.toLowerCase().includes("run")) ? 'sec' : 'kg';
      setFormData(prev => ({ ...prev, exerciseName: value, unit }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/records', formData);
      if (res.success) {
        toast.success("Personal Record Logged!");
        setIsAdding(false);
        setFormData({ exerciseName: 'Bench Press', value: '', unit: 'kg' });
        fetchRecords();
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to log personal record.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
            <FaTrophy className="text-yellow-500" /> Personal Records
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Log and showcase your peak strength and speed performances</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="px-5 py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-black text-xs rounded-xl flex items-center gap-2 shadow-md cursor-pointer transition-all"
        >
          <FaPlus /> Log New PR
        </button>
      </div>

      {/* PR Cards Grid */}
      {records.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {records.map((rec, idx) => {
            const Icon = recordIcons[rec.exerciseName.toLowerCase()] || FaWeightHanging;
            return (
              <motion.div
                key={rec._id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-all relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/3" />
                
                {/* Delete Button */}
                <button
                  onClick={(e) => handleDelete(e, rec._id)}
                  className="absolute top-4 right-4 z-20 w-8 h-8 bg-slate-50 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-slate-400 hover:text-red-500 rounded-full flex items-center justify-center transition-all cursor-pointer border border-slate-100 dark:border-slate-800"
                  title="Delete Record"
                >
                  <FaTrash size={10} />
                </button>

                <div className="w-12 h-12 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 rounded-2xl flex items-center justify-center text-xl shrink-0">
                  <Icon />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Best Lift / Time</span>
                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide mt-0.5">{rec.exerciseName}</h4>
                  <div className="flex items-baseline gap-1 mt-2 text-slate-900 dark:text-white">
                    <span className="text-2xl font-black">{rec.value}</span>
                    <span className="text-xs font-extrabold text-slate-400">{rec.unit}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-semibold mt-2">Achieved: {new Date(rec.achievedAt).toLocaleDateString()}</span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <FaTrophy size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4 animate-bounce" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No personal records logged yet</h3>
          <p className="text-slate-500 dark:text-slate-400">Tap "Log New PR" to record your first achievement!</p>
        </div>
      )}

      {/* Log PR Modal */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
            <div className="absolute inset-0 cursor-pointer" onClick={() => setIsAdding(false)} />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] p-8 border border-slate-200 dark:border-slate-800 shadow-2xl z-10 space-y-6"
            >
              <div>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase">Log Personal Record</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-1">Enter your new peak lift weight or duration best</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Exercise</label>
                  <select
                    name="exerciseName"
                    value={formData.exerciseName}
                    onChange={handleChange}
                    className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3.5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white"
                  >
                    <option value="Bench Press">Bench Press</option>
                    <option value="Squat">Squat</option>
                    <option value="Deadlift">Deadlift</option>
                    <option value="Plank">Plank</option>
                    <option value="Fastest 1K Run">Fastest 1K Run</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Value</label>
                    <input
                      type="number"
                      required
                      name="value"
                      placeholder="e.g. 90"
                      value={formData.value}
                      onChange={handleChange}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Unit</label>
                    <input
                      type="text"
                      disabled
                      name="unit"
                      value={formData.unit}
                      className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm text-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsAdding(false)}
                    className="flex-1 py-4 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-850 text-slate-800 dark:text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer border border-slate-100 dark:border-slate-800"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-slate-900 hover:bg-slate-950 dark:bg-white dark:hover:bg-slate-50 text-white dark:text-slate-900 font-black text-xs rounded-xl shadow-md cursor-pointer transition-all"
                  >
                    Save Record
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Records;
