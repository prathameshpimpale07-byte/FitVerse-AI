import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaDumbbell, FaCalendarAlt, FaFire, FaCheckCircle, FaExclamationCircle, FaPlay } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const AIWorkoutGenerator = ({ onStartWorkout }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    goal: 'muscle_gain',
    experience: 'Intermediate',
    workoutDays: '6',
    duration: '60',
    equipment: 'Gym',
    medicalConditions: '',
    injuries: '',
    preference: 'Mixed'
  });

  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [activeDay, setActiveDay] = useState('');
  const [exerciseLibrary, setExerciseLibrary] = useState([]);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      try {
        const res = await api.get('/exercises');
        if (res.success) {
          setExerciseLibrary(res.exercises);
        }
      } catch (err) {
        console.error("Failed to load exercise library:", err);
      }
    };
    fetchLibrary();
  }, []);

  const getMatchVideo = (name) => {
    if (!name || !exerciseLibrary.length) return null;
    const match = exerciseLibrary.find(libEx => 
      libEx.exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '') === 
      name.toLowerCase().replace(/[^a-z0-9]/g, '') ||
      libEx.exerciseName.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(libEx.exerciseName.toLowerCase())
    );
    return match ? match.videoUrl : null;
  };

  // Load active plan if exists
  useEffect(() => {
    const fetchActivePlan = async () => {
      try {
        const res = await api.get('/ai/my-plan');
        if (res.success && res.plan) {
          setGeneratedPlan(res.plan);
          const days = Object.keys(res.plan.weeklySplit);
          if (days.length > 0) setActiveDay(days[0]);
        }
      } catch (err) {
        console.error("Error loading active workout plan:", err);
      }
    };
    fetchActivePlan();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'age') {
      if (value === '') {
        setFormData(prev => ({ ...prev, age: '' }));
        return;
      }
      const num = Number(value);
      if (value.length >= 2 && num < 10) {
        toast.error("Age must be 10 years and above");
        setFormData(prev => ({ ...prev, age: '' }));
        return;
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAgeBlur = (e) => {
    const value = e.target.value;
    if (value !== '') {
      const num = Number(value);
      if (num < 10) {
        toast.error("Age must be 10 years and above");
        setFormData(prev => ({ ...prev, age: '' }));
      }
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.age || Number(formData.age) < 10) {
        toast.error("Age must be 10 years and above");
        return;
      }
    }
    setStep(step + 1);
  };
  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Number(formData.age) < 10) {
      toast.error("Age must be 10 years and above");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-workout', formData, { timeout: 60000 });
      if (res.success && res.plan) {
        setGeneratedPlan(res.plan);
        const days = Object.keys(res.plan.weeklySplit);
        if (days.length > 0) setActiveDay(days[0]);
        toast.success("AI Workout Plan Generated!");
      } else {
        toast.error("Failed to generate plan");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred generating workout");
    } finally {
      setLoading(false);
    }
  };

  const handleLaunchWorkout = () => {
    if (!generatedPlan || !activeDay) return;
    const activeExercises = generatedPlan.weeklySplit[activeDay] || [];
    if (activeExercises.length === 0) {
      toast.error("Today is a rest day! Select another day to start a workout.");
      return;
    }

    const workoutData = {
      workoutName: `AI Generated: ${activeDay} Split`,
      exercises: activeExercises.map((ex) => {
        const restSeconds = parseInt(ex.rest) || 90;
        
        // Find matching exercise in library
        const match = exerciseLibrary.find(libEx => 
          libEx.exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '') === 
          ex.exerciseName.toLowerCase().replace(/[^a-z0-9]/g, '') ||
          libEx.exerciseName.toLowerCase().includes(ex.exerciseName.toLowerCase()) ||
          ex.exerciseName.toLowerCase().includes(libEx.exerciseName.toLowerCase())
        );

        return {
          exerciseId: match ? match._id : 'mock',
          exerciseName: match ? match.exerciseName : ex.exerciseName,
          sets: Number(ex.sets) || 3,
          reps: String(ex.reps) || '10-12',
          weight: 0,
          restTime: restSeconds,
          videoUrl: match ? match.videoUrl : 'https://www.youtube.com/embed/IODxDxX7oi4', // Fallback to pushup
          imageUrl: match ? match.imageUrl : 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80',
          instructions: match ? match.instructions : ['Perform with slow and controlled form.'],
          tips: match ? match.tips : ['Keep core tight'],
          commonMistakes: match ? match.commonMistakes : ['Using momentum']
        };
      })
    };

    if (onStartWorkout) {
      onStartWorkout(workoutData);
      toast.success(`Starting AI Workout: ${activeDay} Split!`);
    } else {
      toast.error("Unable to start workout player.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <FaRobot className="text-primary-500 animate-pulse" /> AI Workout Generator
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
          Create structured workout plans tailored specifically for your body and goals instead of generic lists
        </p>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          /* LOADING SCREEN */
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-12 text-center bg-slate-900 text-white rounded-[2.5rem] shadow-xl border border-slate-800 space-y-6 flex flex-col items-center justify-center min-h-[400px]"
          >
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-primary-500/20 border-t-primary-500 animate-spin"></div>
              <FaRobot size={40} className="text-primary-500 animate-bounce" />
            </div>
            <div>
              <h3 className="text-2xl font-black tracking-wide uppercase">AI Coach Is Calculating...</h3>
              <p className="text-slate-400 text-sm font-semibold max-w-sm mx-auto mt-2 leading-relaxed">
                Structuring splits, adjusting load progression, calculating optimal rest times, and setting warm-ups...
              </p>
            </div>
          </motion.div>
        ) : generatedPlan ? (
          /* PLAN DISPLAY */
          <motion.div
            key="plan"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid lg:grid-cols-12 gap-8"
          >
            {/* Split Schedule */}
            <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
                  <FaCalendarAlt className="text-primary-500" /> Weekly Workout Split
                </h3>
                <button
                  onClick={() => setGeneratedPlan(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-extrabold text-xs rounded-xl transition-all cursor-pointer"
                >
                  Generate New Plan
                </button>
              </div>

              {/* Day selection tabs */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(generatedPlan.weeklySplit).map((day) => (
                  <button
                    key={day}
                    onClick={() => setActiveDay(day)}
                    className={`px-5 py-2.5 rounded-xl font-extrabold text-xs transition-all uppercase cursor-pointer ${
                      activeDay === day
                        ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>

              {/* Exercises for selected day */}
              <div className="space-y-4">
                {generatedPlan.weeklySplit[activeDay] && generatedPlan.weeklySplit[activeDay].length > 0 ? (
                  generatedPlan.weeklySplit[activeDay].map((ex, idx) => (
                    <div
                      key={idx}
                      className="p-5 bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center text-sm font-black shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-extrabold text-slate-900 dark:text-white uppercase text-base">{ex.exerciseName}</h4>
                            {getMatchVideo(ex.exerciseName) && (
                              <button
                                type="button"
                                onClick={() => setSelectedVideoUrl(getMatchVideo(ex.exerciseName))}
                                className="p-1.5 text-primary-600 hover:text-white bg-primary-100 hover:bg-primary-600 dark:bg-primary-950/40 dark:hover:bg-primary-650 rounded-lg transition-all cursor-pointer flex items-center justify-center shrink-0"
                                title="Watch Demo Video"
                              >
                                <FaPlay size={8} />
                              </button>
                            )}
                          </div>
                          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold mt-0.5">Rest Time: {ex.rest || '90 sec'}</p>
                        </div>
                      </div>
                      <div className="flex gap-3 text-xs font-bold text-slate-700 dark:text-slate-300">
                        <span className="px-3.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/50 dark:border-slate-800">
                          {ex.sets || 3} Sets
                        </span>
                        <span className="px-3.5 py-1.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200/50 dark:border-slate-800">
                          {ex.reps || '10-12'} Reps
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-slate-400 dark:text-slate-500 font-bold uppercase text-xs">
                    Rest Day / Active Recovery 🧘
                  </div>
                )}
              </div>

              {/* Start Workout Button */}
              {generatedPlan.weeklySplit[activeDay] && generatedPlan.weeklySplit[activeDay].length > 0 && onStartWorkout && (
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                  <button
                    onClick={handleLaunchWorkout}
                    className="w-full sm:w-auto px-8 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-lg shadow-primary-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <FaDumbbell className="animate-pulse" /> Start Active Day's Session &rarr;
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar Guide details */}
            <div className="lg:col-span-4 space-y-6">
              {/* Warm-up & Cool-down */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <h4 className="text-base font-black text-slate-900 dark:text-white uppercase">Schedules</h4>
                <div className="space-y-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                  <div className="p-4 rounded-2xl bg-orange-500/5 border border-orange-500/10">
                    <span className="text-orange-500 font-black uppercase text-[10px] tracking-widest block mb-1">Warm Up Routine</span>
                    <p className="leading-relaxed">{generatedPlan.warmUp}</p>
                  </div>
                  <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                    <span className="text-indigo-500 font-black uppercase text-[10px] tracking-widest block mb-1">Cool Down Stretch</span>
                    <p className="leading-relaxed">{generatedPlan.coolDown}</p>
                  </div>
                </div>
              </div>

              {/* Progress tips */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <h4 className="text-base font-black text-slate-900 dark:text-white uppercase">Progressive Overload</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 font-medium">
                  {generatedPlan.progressiveOverloadSuggestions}
                </p>
              </div>

              {/* Recovery advice */}
              <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                <h4 className="text-base font-black text-slate-900 dark:text-white uppercase">Recovery Advice</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 font-medium">
                  {generatedPlan.recoveryAdvice}
                </p>
              </div>

              {/* Motivation */}
              <div className="bg-gradient-to-r from-primary-500 to-indigo-500 rounded-[2rem] p-6 text-white space-y-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-primary-200">Coach Motivation</span>
                <p className="text-sm font-black italic">"{generatedPlan.motivation}"</p>
              </div>
            </div>
          </motion.div>
        ) : (
          /* FORM STEPPER */
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {step === 1 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">Step 1: Body Metrics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Gender</label>
                      <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Age</label>
                      <input type="number" required min="10" placeholder="Years" name="age" value={formData.age} onChange={handleChange} onBlur={handleAgeBlur} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Height (cm)</label>
                      <input type="number" required placeholder="cm" name="height" value={formData.height} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Weight (kg)</label>
                      <input type="number" required placeholder="kg" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                    </div>
                  </div>
                  <button type="button" onClick={handleNext} className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-sm rounded-xl hover:opacity-95 transition-all cursor-pointer">
                    Next Step &rarr;
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">Step 2: Training Goals</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Fitness Goal</label>
                      <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white">
                        <option value="muscle_gain">Muscle Gain</option>
                        <option value="weight_loss">Weight Loss</option>
                        <option value="endurance">Endurance</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="general_fitness">General Fitness</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Weekly Days</label>
                        <select name="workoutDays" value={formData.workoutDays} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white">
                          <option value="3">3 Days</option>
                          <option value="4">4 Days</option>
                          <option value="5">5 Days</option>
                          <option value="6">6 Days</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Experience</label>
                        <select name="experience" value={formData.experience} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white">
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Duration (Min)</label>
                        <select name="duration" value={formData.duration} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white">
                          <option value="30">30 Min</option>
                          <option value="45">45 Min</option>
                          <option value="60">60 Min</option>
                          <option value="90">90 Min</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Equipment</label>
                        <select name="equipment" value={formData.equipment} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white">
                          <option value="Gym">Full Gym Equipment</option>
                          <option value="Dumbbells Only">Dumbbells Only</option>
                          <option value="Bodyweight">Bodyweight Only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={handlePrev} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer">
                      &larr; Back
                    </button>
                    <button type="button" onClick={handleNext} className="flex-1 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-extrabold text-sm rounded-xl hover:opacity-95 transition-all cursor-pointer">
                      Next Step &rarr;
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase">Step 3: Medical Conditions & Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Medical Conditions (Optional)</label>
                      <input type="text" placeholder="e.g. Asthma, Diabetes" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Injuries (Optional)</label>
                      <input type="text" placeholder="e.g. Right shoulder pain, lower back stiffness" name="injuries" value={formData.injuries} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Workout Preference</label>
                      <select name="preference" value={formData.preference} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 text-slate-900 dark:text-white">
                        <option value="Mixed">Mixed Strength & Cardio</option>
                        <option value="Heavy Weights">Heavy Lifting</option>
                        <option value="HIIT / Bodyweight">High Intensity / Bodyweight</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button type="button" onClick={handlePrev} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-extrabold text-sm rounded-xl transition-all cursor-pointer">
                      &larr; Back
                    </button>
                    <button type="submit" className="flex-1 py-4 bg-primary-600 hover:bg-primary-700 text-white font-black text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary-500/20 cursor-pointer">
                      <FaRobot /> Generate Plan
                    </button>
                  </div>
                </motion.div>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      {selectedVideoUrl && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 max-w-2xl w-full shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-wider">Exercise Demo Video</h4>
              <button 
                onClick={() => setSelectedVideoUrl(null)} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all cursor-pointer text-slate-500 hover:text-slate-900 dark:hover:text-white font-extrabold"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-slate-100 dark:border-slate-800">
              <iframe
                src={selectedVideoUrl}
                title="Exercise Demo"
                className="w-full h-full"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIWorkoutGenerator;
