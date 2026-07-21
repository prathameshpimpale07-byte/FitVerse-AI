import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaAppleAlt, FaChevronRight, FaChevronLeft, FaUtensils, FaUserCog } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const AIDietGenerator = ({ onPlanGenerated }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    gender: 'male',
    age: '',
    height: '',
    weight: '',
    goalWeight: '',
    goal: 'muscle_gain',
    activityLevel: 'Active',
    preference: 'vegetarian',
    country: 'India',
    state: '',
    budget: '₹300',
    allergies: '',
    medicalConditions: '',
    dailyMeals: '4',
    wakeTime: '6:00 AM',
    sleepTime: '11:00 PM',
    workoutTime: '6:00 PM',
    cookingSkill: 'Intermediate',
    supplements: '',
    dietDuration: '3'
  });

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
      if (!formData.height || Number(formData.height) <= 0) {
        toast.error("Please enter a valid height");
        return;
      }
      if (!formData.weight || Number(formData.weight) <= 0) {
        toast.error("Please enter a valid weight");
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
    setLoading(false); // prevent double spinner
    setLoading(true);
    try {
      const res = await api.post('/ai/generate-diet', formData, { timeout: 60000 });
      if (res.success && res.plan) {
        toast.success("AI Diet Plan Generated!");
        if (onPlanGenerated) onPlanGenerated(res.plan);
      } else {
        toast.error("Failed to generate plan");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred generating diet plan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-3">
          <FaAppleAlt className="text-emerald-500 animate-bounce" /> AI Diet Planner
        </h2>
        <span className="px-3.5 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-extrabold text-[10px] rounded-full uppercase tracking-wider">
          Step {step} of 3
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {step === 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <FaUserCog className="text-emerald-500" /> Step 1: Body Metrics & Goals
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white">
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Age</label>
                <input type="number" required min="10" placeholder="Years" name="age" value={formData.age} onChange={handleChange} onBlur={handleAgeBlur} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Height (cm)</label>
                <input type="number" required placeholder="cm" name="height" value={formData.height} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Weight (kg)</label>
                <input type="number" required placeholder="kg" name="weight" value={formData.weight} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Target Weight</label>
                <input type="number" required placeholder="kg" name="goalWeight" value={formData.goalWeight} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Fitness Goal</label>
                <select name="goal" value={formData.goal} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white">
                  <option value="weight_loss">Weight Loss / Fat Cut 🏃</option>
                  <option value="muscle_gain">Muscle Building / Surplus 💪</option>
                  <option value="maintenance">Lean Recomposition ⚖️</option>
                  <option value="endurance">Athletic Endurance 🏋️</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Activity Level</label>
                <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white">
                  <option value="Sedentary">Sedentary (Desk Job)</option>
                  <option value="Lightly Active">Lightly Active (1-2 days/wk)</option>
                  <option value="Active">Moderately Active (3-5 days/wk)</option>
                  <option value="Very Active">Very Active (Daily Workouts)</option>
                </select>
              </div>
            </div>

            <button type="button" onClick={handleNext} className="w-full py-4 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer">
              Next Step <FaChevronRight size={10} />
            </button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <FaUtensils className="text-emerald-500" /> Step 2: Food & Diet Preferences
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Diet Type</label>
                <select name="preference" value={formData.preference} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white">
                  <option value="vegetarian">Vegetarian 🥗</option>
                  <option value="vegan">Vegan 🌿</option>
                  <option value="non-vegetarian">Non-Vegetarian 🍗</option>
                  <option value="keto">Keto (High Fat/Low Carb) 🥑</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Daily Budget Limit</label>
                <input type="text" placeholder="e.g. ₹300/day" name="budget" value={formData.budget} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Country</label>
                <input type="text" required placeholder="Country (e.g. India)" name="country" value={formData.country} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">State / Province</label>
                <input type="text" placeholder="e.g. Maharashtra" name="state" value={formData.state} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Food Allergies</label>
              <input type="text" placeholder="e.g. Nuts, Dairy, Gluten (Optional)" name="allergies" value={formData.allergies} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Medical Conditions</label>
              <input type="text" placeholder="e.g. High BP, Diabetes, Thyroid (Optional)" name="medicalConditions" value={formData.medicalConditions} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
            </div>

            <div className="flex gap-4 pt-2">
              <button type="button" onClick={handlePrev} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer">
                Back
              </button>
              <button type="button" onClick={handleNext} className="flex-1 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer">
                Next <FaChevronRight size={10} />
              </button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
              <FaUtensils className="text-emerald-500" /> Step 3: Daily Routine & Setup
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Wake Time</label>
                <input type="text" name="wakeTime" value={formData.wakeTime} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Sleep Time</label>
                <input type="text" name="sleepTime" value={formData.sleepTime} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Workout Time</label>
                <input type="text" name="workoutTime" value={formData.workoutTime} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Workout Days/Wk</label>
                <select name="workoutDays" value={formData.workoutDays} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white">
                  <option value="3">3 Days</option>
                  <option value="4">4 Days</option>
                  <option value="5">5 Days</option>
                  <option value="6">6 Days</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Meals Per Day</label>
                <select name="dailyMeals" value={formData.dailyMeals} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white">
                  <option value="3">3 Meals</option>
                  <option value="4">4 Meals</option>
                  <option value="5">5 Meals</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Diet Duration</label>
                <select name="dietDuration" value={formData.dietDuration} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white">
                  <option value="1">1 Day</option>
                  <option value="3">3 Days</option>
                  <option value="7">7 Days</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Cooking Skill</label>
                <select name="cookingSkill" value={formData.cookingSkill} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white">
                  <option value="Beginner">Beginner (Quick Meals)</option>
                  <option value="Intermediate">Intermediate (Normal Prep)</option>
                  <option value="Advanced">Advanced (Proper Cook)</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Supplements (Optional)</label>
                <input type="text" placeholder="e.g. Whey, Creatine" name="supplements" value={formData.supplements} onChange={handleChange} className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white" />
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <button type="button" onClick={handlePrev} className="flex-1 py-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer" disabled={loading}>
                Back
              </button>
              <button type="submit" className="flex-1 py-4 bg-emerald-650 hover:bg-emerald-700 text-white font-black text-xs uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 cursor-pointer" disabled={loading}>
                {loading ? (
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                ) : (
                  <>Create Diet Plan &rarr;</>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </form>
    </div>
  );
};

export default AIDietGenerator;
