import { useState, useEffect } from 'react';
import { FaHistory, FaCalendarAlt, FaFire, FaClock, FaDumbbell, FaTrash } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const WorkoutHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await api.get('/history');
        if (res.success) {
          setHistory(res.data);
        }
      } catch (err) {
        console.error("Error loading workout history:", err);
        toast.error("Could not load workout history.");
      } finally {
        setLoading(false);
      }
    };
    loadHistory();
  }, []);

  const handleDeleteHistory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this workout history record?")) return;
    try {
      const res = await api.delete(`/history/${id}`);
      if (res.success) {
        toast.success("Workout history deleted!");
        setHistory(prev => prev.filter(item => item._id !== id));
      } else {
        toast.error(res.message || "Failed to delete record.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not delete workout history.");
    }
  };

  const formatDuration = (secs) => {
    if (!secs) return '0 min';
    const m = Math.floor(secs / 60);
    if (m === 0) return `${secs} sec`;
    return `${m} min`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <FaHistory className="text-primary-500" /> Workout History
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Review your past sweat sessions and track your consistency</p>
      </div>

      {history.length > 0 ? (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record._id}
              className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-all space-y-4 relative"
            >
              {/* Header: Title/Date on left, Delete Button on right */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="p-2 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl text-xs shrink-0">
                      <FaDumbbell />
                    </span>
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                      {record.workoutName}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 dark:text-slate-500 pl-9">
                    <FaCalendarAlt />
                    <span>{formatDate(record.completedAt)}</span>
                  </div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteHistory(record._id)}
                  className="p-3 bg-red-500/10 hover:bg-red-600 hover:text-white text-red-500 rounded-2xl transition-all cursor-pointer border border-red-500/10 hover:border-red-600 shadow-sm shrink-0"
                  title="Delete Record"
                >
                  <FaTrash size={12} />
                </button>
              </div>

              {/* Completed Exercises Pills */}
              {record.completedExercises?.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pl-0 md:pl-9">
                  {record.completedExercises.map((ex, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 text-[10px] text-slate-600 dark:text-slate-300 font-extrabold rounded-lg uppercase tracking-wide"
                    >
                      {ex.exerciseName} • {ex.setsCompleted} Sets
                    </span>
                  ))}
                </div>
              )}

              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 pt-3 border-t border-slate-50 dark:border-slate-850 pl-0 md:pl-9 text-slate-600 dark:text-slate-350 font-bold text-xs">
                <div className="flex items-center gap-2">
                  <FaClock className="text-indigo-500 text-sm shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Duration</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{formatDuration(record.duration)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaFire className="text-orange-500 text-sm shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Calories</span>
                    <span className="text-slate-900 dark:text-white font-extrabold">{record.caloriesBurned} kcal</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <FaDumbbell className="text-primary-500 text-sm shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Exercises</span>
                    <span className="text-slate-950 dark:text-white font-extrabold">{record.completedExercises?.length || 0} Done</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <FaHistory size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No workout history</h3>
          <p className="text-slate-500 dark:text-slate-400">Complete your first workout to start tracking your history.</p>
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
