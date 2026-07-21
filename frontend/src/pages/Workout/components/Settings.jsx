import { useState, useEffect } from 'react';
import { FaCog, FaBell, FaVolumeUp, FaDumbbell, FaClock } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    defaultRest: 90,
    unit: 'kg',
    soundEffects: true,
    weeklyNotifications: true
  });

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('fitverse_workout_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const handleToggle = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    localStorage.setItem('fitverse_workout_settings', JSON.stringify(updated));
    toast.success("Preference updated");
  };

  const handleSelect = (key, val) => {
    const updated = { ...settings, [key]: val };
    setSettings(updated);
    localStorage.setItem('fitverse_workout_settings', JSON.stringify(updated));
    toast.success("Preference updated");
  };

  return (
    <div className="space-y-6 max-w-xl">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <FaCog className="text-primary-500" /> Workout Settings
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Configure default options for your player and exercise logger</p>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Unit preference */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center shrink-0">
              <FaDumbbell />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">Weight Units</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Select preferred metric system</p>
            </div>
          </div>

          <div className="flex bg-slate-50 dark:bg-slate-850 p-1.5 rounded-xl border border-slate-150 dark:border-slate-800">
            <button
              onClick={() => handleSelect('unit', 'kg')}
              className={`px-4 py-2 font-black text-xs rounded-lg transition-all cursor-pointer ${
                settings.unit === 'kg' 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              KG
            </button>
            <button
              onClick={() => handleSelect('unit', 'lbs')}
              className={`px-4 py-2 font-black text-xs rounded-lg transition-all cursor-pointer ${
                settings.unit === 'lbs' 
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
              }`}
            >
              LBS
            </button>
          </div>
        </div>

        {/* Default rest timer */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
              <FaClock />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">Default Rest Time</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Timer preset between workout sets</p>
            </div>
          </div>

          <select
            value={settings.defaultRest}
            onChange={(e) => handleSelect('defaultRest', Number(e.target.value))}
            className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-800 dark:text-white focus:outline-none cursor-pointer"
          >
            <option value={30}>30 Secs</option>
            <option value={60}>60 Secs</option>
            <option value={90}>90 Secs</option>
            <option value={120}>120 Secs</option>
          </select>
        </div>

        {/* Sounds */}
        <div className="flex items-center justify-between py-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center shrink-0">
              <FaVolumeUp />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">Sound Effects</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Play beeps on timer completions</p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('soundEffects')}
            className={`w-14 h-8 rounded-full p-1 transition-all ${
              settings.soundEffects ? 'bg-primary-650 flex justify-end' : 'bg-slate-200 dark:bg-slate-750 flex justify-start'
            }`}
          >
            <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-md" />
          </button>
        </div>

        {/* Weekly summaries notification toggle */}
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shrink-0">
              <FaBell />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase">Weekly Summaries</h4>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold mt-0.5">Get weekly AI routine analysis</p>
            </div>
          </div>

          <button
            onClick={() => handleToggle('weeklyNotifications')}
            className={`w-14 h-8 rounded-full p-1 transition-all ${
              settings.weeklyNotifications ? 'bg-primary-650 flex justify-end' : 'bg-slate-200 dark:bg-slate-750 flex justify-start'
            }`}
          >
            <motion.div layout className="w-6 h-6 rounded-full bg-white shadow-md" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Settings;
