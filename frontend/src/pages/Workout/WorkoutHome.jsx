import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaDumbbell, FaRobot, FaTrophy, FaHistory, FaHeart, FaCog, 
  FaBolt, FaCoins, FaPlay, FaCalendarCheck, FaMagic, FaUserCircle
} from 'react-icons/fa';
import api from '../../services/api';

// Subcomponents
import WorkoutCategories from './components/WorkoutCategories';
import ExerciseLibrary from './components/ExerciseLibrary';
import ExerciseDetails from './components/ExerciseDetails';
import AIWorkoutGenerator from './components/AIWorkoutGenerator';
import WorkoutPlayer from './components/WorkoutPlayer';
import WorkoutHistory from './components/WorkoutHistory';
import Favorites from './components/Favorites';
import Records from './components/Records';

const WorkoutHome = () => {
  const [activeTab, setActiveTab] = useState('categories');
  const [userStats, setUserStats] = useState({ name: 'User', streak: 0, xp: 0, coins: 0 });
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);

  // Load user profile statistics
  const fetchUserProfile = async () => {
    try {
      const res = await api.get('/auth/profile');
      // If the user route structure has profile stats, load them
      if (res.success && res.user) {
        setUserStats({
          name: res.user.name || 'Athlete',
          streak: res.user.streak || 0,
          xp: res.user.xp || 0,
          coins: res.user.coins || 0
        });
      }
    } catch (err) {
      // Fallback/guest user if profile route fails
      setUserStats({
        name: 'Champion',
        streak: 2,
        xp: 320,
        coins: 140
      });
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, [activeTab]);

  const handleStartWorkout = (workoutData) => {
    setActiveWorkout(workoutData || { workoutName: "Custom Session", exercises: [] });
    setActiveTab('player');
  };

  const handleFinishWorkout = () => {
    setActiveWorkout(null);
    setActiveTab('history');
    fetchUserProfile();
  };

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    setActiveTab('library');
  };

  const handleSelectAlternative = (altEx) => {
    setSelectedExercise(altEx);
  };

  // Nav Item configuration
  const navItems = [
    { id: 'categories', name: 'Categories', icon: FaCalendarCheck },
    { id: 'generator', name: 'AI Generator', icon: FaRobot },
    { id: 'history', name: 'History', icon: FaHistory },
    { id: 'favorites', name: 'Favorites', icon: FaHeart },
    { id: 'records', name: 'Records', icon: FaTrophy }
  ];

  return (
    <div className="space-y-8">
      {/* Exercise Details Modal */}
      <AnimatePresence>
        {selectedExercise && (
          <ExerciseDetails
            exercise={selectedExercise}
            onClose={() => setSelectedExercise(null)}
            onSelectAlternative={handleSelectAlternative}
          />
        )}
      </AnimatePresence>

      {/* Main navigation / sub-module container */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Navigation Sidebar */}
        {activeTab !== 'player' && (
          <aside className="lg:col-span-3 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-4 shadow-sm flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-visible scrollbar-none w-full mb-4 lg:mb-0 lg:space-y-1">
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest pl-3 hidden lg:block mb-3">
              Workout Sections
            </span>
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (item.id !== 'library') setSelectedCategory(null);
                }}
                className={`flex items-center gap-3 px-5 py-3 rounded-2xl font-bold text-xs uppercase transition-all tracking-wider cursor-pointer shrink-0 whitespace-nowrap lg:w-full lg:py-3.5 lg:px-4 ${
                  activeTab === item.id || (item.id === 'categories' && activeTab === 'library')
                    ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <item.icon className="text-base shrink-0" />
                <span>{item.name}</span>
              </button>
            ))}
          </aside>
        )}

        {/* Right Content Section */}
        <main className={`${activeTab === 'player' ? 'lg:col-span-12' : 'lg:col-span-9'}`}>
          <AnimatePresence mode="wait">

            {/* 1. CATEGORIES GRID */}
            {activeTab === 'categories' && (
              <motion.div
                key="categories"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <WorkoutCategories onSelectCategory={handleSelectCategory} />
              </motion.div>
            )}

            {/* 2. EXERCISE LIBRARY / EXPLORE */}
            {activeTab === 'library' && (
              <motion.div
                key="library"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ExerciseLibrary
                  category={selectedCategory}
                  onBack={() => {
                    setSelectedCategory(null);
                    setActiveTab('categories');
                  }}
                  onSelectExercise={(ex) => setSelectedExercise(ex)}
                />
              </motion.div>
            )}

            {/* 3. AI WORKOUT PLAN GENERATOR */}
            {activeTab === 'generator' && (
              <motion.div
                key="generator"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <AIWorkoutGenerator onStartWorkout={handleStartWorkout} />
              </motion.div>
            )}

            {/* 4. WORKOUT SESSION PLAYER */}
            {activeTab === 'player' && activeWorkout && (
              <motion.div
                key="player"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <WorkoutPlayer
                  workout={activeWorkout}
                  onFinish={handleFinishWorkout}
                />
              </motion.div>
            )}

            {/* 5. HISTORY LIST */}
            {activeTab === 'history' && (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <WorkoutHistory />
              </motion.div>
            )}

            {/* 6. FAVORITES LIBRARY */}
            {activeTab === 'favorites' && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Favorites onSelectExercise={(ex) => setSelectedExercise(ex)} />
              </motion.div>
            )}

            {/* 7. PERSONAL RECORDS LOG */}
            {activeTab === 'records' && (
              <motion.div
                key="records"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <Records />
              </motion.div>
            )}

          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};

export default WorkoutHome;
