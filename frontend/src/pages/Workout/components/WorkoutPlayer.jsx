import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlay, FaPause, FaForward, FaBackward, FaCheck, FaStopwatch, FaDumbbell, FaFire, FaTrophy, FaSmile, FaFrown, FaMeh } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const WorkoutPlayer = ({ workout, onFinish }) => {
  // Setup default workout exercises if none provided
  const defaultExercises = [
    { exerciseId: '1', exerciseName: 'Barbell Bench Press', sets: 4, reps: '10', weight: 60, restTime: 90, imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&q=80' },
    { exerciseId: '2', exerciseName: 'Tricep Rope Pushdown', sets: 3, reps: '12', weight: 20, restTime: 60, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80' },
    { exerciseId: '3', exerciseName: 'Dumbbell Lateral Raise', sets: 3, reps: '15', weight: 10, restTime: 60, imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e53050c3a4?w=600&q=80' }
  ];

  const exercises = workout?.exercises?.length > 0 
    ? workout.exercises.map(e => ({
        exerciseId: e.exerciseId?._id || e.exerciseId || 'mock',
        exerciseName: e.exerciseId?.exerciseName || e.exerciseName || 'Workout Exercise',
        sets: e.sets || 3,
        reps: e.reps || '10',
        weight: e.weight || 0,
        restTime: e.restTime || 60,
        imageUrl: e.exerciseId?.imageUrl || ''
      }))
    : defaultExercises;

  const workoutName = workout?.workoutName || workout?.name || "Free Training Session";

  const [currentIdx, setCurrentIdx] = useState(0);
  const [totalTimer, setTotalTimer] = useState(0); // overall workout duration
  const [isPaused, setIsPaused] = useState(false);
  const [completedSets, setCompletedSets] = useState({}); // format: { 'exerciseIndex-setIndex': true }
  
  // Rest Timer State
  const [restRemaining, setRestRemaining] = useState(0);
  const [restTotal, setRestTotal] = useState(60);
  const [restActive, setRestActive] = useState(false);

  // Summary State
  const [summaryActive, setSummaryActive] = useState(false);
  const [rating, setRating] = useState('good'); // good, neutral, bad
  const [notes, setNotes] = useState('');
  const [rewards, setRewards] = useState(null);

  // Increment total timer
  useEffect(() => {
    let interval = null;
    if (!isPaused && !summaryActive) {
      interval = setInterval(() => {
        setTotalTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused, summaryActive]);

  // Rest timer countdown
  useEffect(() => {
    let interval = null;
    if (restActive && restRemaining > 0) {
      interval = setInterval(() => {
        setRestRemaining(prev => prev - 1);
      }, 1000);
    } else if (restRemaining === 0) {
      setRestActive(false);
    }
    return () => clearInterval(interval);
  }, [restActive, restRemaining]);

  const currentExercise = exercises[currentIdx];

  const toggleSetComplete = (setIdx) => {
    const key = `${currentIdx}-${setIdx}`;
    const wasCompleted = !!completedSets[key];
    setCompletedSets(prev => ({ ...prev, [key]: !wasCompleted }));

    if (!wasCompleted) {
      // Auto-trigger rest timer when checkmarked
      setRestTotal(currentExercise.restTime || 60);
      setRestRemaining(currentExercise.restTime || 60);
      setRestActive(true);
    }
  };

  const handleNext = () => {
    if (currentIdx < exercises.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setRestActive(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1);
      setRestActive(false);
    }
  };

  const handleAdd30s = () => {
    setRestRemaining(prev => prev + 30);
    setRestTotal(prev => prev + 30);
  };

  const handleSkipRest = () => {
    setRestRemaining(0);
    setRestActive(false);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const finishWorkout = async () => {
    setRestActive(false);
    
    // Compile completed exercises list
    const completedList = exercises.map((ex, exIdx) => {
      let setsDone = 0;
      for (let s = 0; s < ex.sets; s++) {
        if (completedSets[`${exIdx}-${s}`]) setsDone++;
      }
      const isValidId = /^[0-9a-fA-F]{24}$/.test(ex.exerciseId);
      return {
        exerciseId: isValidId ? ex.exerciseId : null,
        exerciseName: ex.exerciseName,
        setsCompleted: setsDone,
        repsCompleted: ex.reps,
        weightUsed: ex.weight || 0
      };
    });

    try {
      const isValidWorkoutId = /^[0-9a-fA-F]{24}$/.test(workout?._id);
      const payload = {
        workoutId: isValidWorkoutId ? workout._id : null,
        workoutName,
        completedExercises: completedList,
        duration: totalTimer,
        rating,
        notes
      };

      const res = await api.post('/workout/complete', payload);
      if (res.success) {
        setRewards(res.data);
        setSummaryActive(true);
        toast.success("Workout Saved!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not complete workout session.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 relative min-h-[500px]">
      
      {/* REST TIMER GLASS OVERLAY */}
      <AnimatePresence>
        {restActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-lg flex items-center justify-center p-6"
          >
            <div className="text-center space-y-8 max-w-sm w-full">
              <span className="text-[10px] bg-primary-500/20 text-primary-400 border border-primary-500/30 px-4 py-1.5 rounded-full font-black uppercase tracking-widest">
                Smart Rest Timer
              </span>

              <div className="relative w-48 h-48 mx-auto flex items-center justify-center">
                {/* Circular progress bar */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="96" cy="96" r="86" stroke="rgba(255,255,255,0.05)" strokeWidth="6" fill="transparent" />
                  <circle 
                    cx="96" 
                    cy="96" 
                    r="86" 
                    stroke="#3b82f6" 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 86}
                    strokeDashoffset={2 * Math.PI * 86 * (1 - restRemaining / restTotal)}
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-5xl font-black text-white tracking-tight">{restRemaining}</span>
                  <span className="text-xs text-slate-400 block font-bold uppercase mt-1">Seconds Left</span>
                </div>
              </div>

              <div className="text-white">
                <h4 className="font-extrabold uppercase text-sm text-slate-300">Next Up</h4>
                <p className="font-black text-lg mt-1 text-primary-300 uppercase">{currentExercise.exerciseName}</p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleAdd30s}
                  className="flex-1 py-4 bg-white/10 hover:bg-white/15 border border-white/10 text-white font-black text-xs rounded-2xl transition-all cursor-pointer"
                >
                  +30 Seconds
                </button>
                <button
                  onClick={handleSkipRest}
                  className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs rounded-2xl shadow-lg shadow-primary-500/20 transition-all cursor-pointer"
                >
                  Skip Rest
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUMMARY DISPLAY SCREEN */}
      <AnimatePresence>
        {summaryActive && rewards && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-8 sm:p-10 shadow-xl space-y-8 text-center"
          >
            {/* Header */}
            <div className="space-y-2">
              <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
                <FaTrophy className="animate-bounce" />
              </div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide">Workout Complete!</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">You smashed your session. Here are your stats and rewards!</p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Time</span>
                <span className="text-slate-950 dark:text-white font-black text-base">{Math.floor(totalTimer / 60)}m {totalTimer % 60}s</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">XP Earned</span>
                <span className="text-primary-600 dark:text-primary-400 font-black text-base">+{rewards.xpGained} XP</span>
              </div>
              <div className="p-4 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Coins Gained</span>
                <span className="text-yellow-600 dark:text-yellow-400 font-black text-base">+{rewards.coinsGained} Coins</span>
              </div>
            </div>

            {/* Feedback / Review form */}
            <div className="space-y-4 text-left border-t border-slate-100 dark:border-slate-800 pt-6">
              <h4 className="font-extrabold uppercase text-xs text-slate-500 tracking-wider">How did it feel?</h4>
              
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setRating('bad')}
                  className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    rating === 'bad' 
                      ? 'bg-red-500/10 text-red-500 border-red-500' 
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <FaFrown /> Exhausted
                </button>
                <button
                  type="button"
                  onClick={() => setRating('neutral')}
                  className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    rating === 'neutral' 
                      ? 'bg-orange-500/10 text-orange-500 border-orange-500' 
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <FaMeh /> Average
                </button>
                <button
                  type="button"
                  onClick={() => setRating('good')}
                  className={`flex-1 py-3 border rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                    rating === 'good' 
                      ? 'bg-green-500/10 text-green-500 border-green-500' 
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <FaSmile /> Strong
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Add workout notes</label>
                <textarea
                  placeholder="Note down weights lifted, pain, or achievements..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 px-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white placeholder-slate-400"
                />
              </div>
            </div>

            <button
              onClick={() => onFinish()}
              className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm rounded-2xl hover:opacity-90 transition-all shadow-md cursor-pointer"
            >
              Go to Dashboard
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ACTIVE PLAYER PANEL */}
      {!summaryActive && (
        <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm overflow-hidden flex flex-col md:flex-row min-h-[500px]">
          {/* Visual card */}
          <div className="w-full md:w-5/12 bg-slate-950 flex flex-col relative h-[250px] md:h-auto min-h-[300px]">
            {currentExercise.imageUrl ? (
              <img src={currentExercise.imageUrl} alt={currentExercise.exerciseName} className="w-full h-full object-cover flex-1" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 gap-2 flex-1">
                <FaDumbbell size={40} className="text-slate-700 animate-pulse" />
                <span className="text-xs font-semibold uppercase">Exercise Image</span>
              </div>
            )}
            
            {/* Dark glass overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

            {/* Overall session stats */}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center text-white">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-widest">Total Duration</span>
                <span className="text-2xl font-black tracking-tight">{formatTime(totalTimer)}</span>
              </div>
              <button 
                onClick={() => setIsPaused(!isPaused)}
                className={`p-3.5 rounded-full flex items-center justify-center text-sm shadow-md transition-all cursor-pointer ${
                  isPaused ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white backdrop-blur'
                }`}
              >
                {isPaused ? <FaPlay /> : <FaPause />}
              </button>
            </div>
          </div>

          {/* Controls card */}
          <div className="w-full md:w-7/12 p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            {/* Top Row: Exercise Name and Pagination */}
            <div className="flex justify-between items-start gap-4">
              <div className="space-y-1">
                <span className="text-[10px] text-primary-500 dark:text-primary-400 font-extrabold uppercase tracking-widest block">
                  Exercise {currentIdx + 1} of {exercises.length}
                </span>
                <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wide leading-tight line-clamp-2">
                  {currentExercise.exerciseName}
                </h3>
              </div>
            </div>

            {/* Checklist of Sets */}
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px] scrollbar-none pr-1">
              {Array.from({ length: currentExercise.sets }).map((_, setIdx) => {
                const isDone = !!completedSets[`${currentIdx}-${setIdx}`];
                return (
                  <div
                    key={setIdx}
                    onClick={() => toggleSetComplete(setIdx)}
                    className={`p-4 border rounded-2xl flex items-center justify-between cursor-pointer transition-all ${
                      isDone 
                        ? 'bg-green-500/5 border-green-500 text-green-600 dark:text-green-400' 
                        : 'bg-slate-50 dark:bg-slate-850 border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black transition-all ${
                        isDone ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                      }`}>
                        {setIdx + 1}
                      </span>
                      <span className="text-sm font-extrabold">
                        {currentExercise.weight ? `${currentExercise.weight} kg × ` : ''}{currentExercise.reps} Reps
                      </span>
                    </div>

                    <button
                      type="button"
                      className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all ${
                        isDone ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 dark:border-slate-600 text-transparent'
                      }`}
                    >
                      <FaCheck size={10} />
                    </button>
                  </div>
                );
              })}
            </div>

            {/* Bottom Row Navigation Controls */}
            <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
              <div className="flex gap-3">
                <button
                  onClick={handlePrev}
                  disabled={currentIdx === 0}
                  className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-850 text-slate-800 dark:text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-800 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <FaBackward /> Prev Exercise
                </button>
                <button
                  onClick={handleNext}
                  disabled={currentIdx === exercises.length - 1}
                  className="flex-1 py-3.5 bg-slate-50 hover:bg-slate-100 dark:bg-slate-800/50 dark:hover:bg-slate-850 text-slate-800 dark:text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 border border-slate-100 dark:border-slate-800 disabled:opacity-50 transition-all cursor-pointer"
                >
                  Next Exercise <FaForward />
                </button>
              </div>

              <button
                onClick={finishWorkout}
                className="w-full py-4 bg-slate-900 hover:bg-slate-950 dark:bg-white dark:hover:bg-slate-50 text-white dark:text-slate-900 font-black text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                Finish Workout Session
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default WorkoutPlayer;
