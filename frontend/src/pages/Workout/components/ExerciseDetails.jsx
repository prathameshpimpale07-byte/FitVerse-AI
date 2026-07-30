import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPlay, FaDumbbell, FaFire, FaClock, FaExclamationTriangle, FaShieldAlt, FaSyncAlt } from 'react-icons/fa';
import api from '../../../services/api';
import { resolveExerciseVideo, formatEmbedUrl } from '../../../utils/exerciseVideoResolver';

const getEmbedUrl = (url) => {
  if (!url) return '';
  if (url.includes('youtube.com/embed/')) return url;
  
  let videoId = '';
  try {
    if (url.includes('youtube.com/shorts/')) {
      const parts = url.split('youtube.com/shorts/');
      if (parts.length > 1) {
        videoId = parts[1].split('?')[0];
      }
    } else if (url.includes('youtube.com/watch')) {
      const parts = url.split('v=');
      if (parts.length > 1) {
        videoId = parts[1].split('&')[0];
      }
    } else if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/');
      if (parts.length > 1) {
        videoId = parts[1].split('?')[0];
      }
    }
  } catch (e) {
    console.error("Error extracting video ID:", e);
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}`;
  }
  return url;
};

const getWatchUrl = (url) => {
  if (!url) return '#';
  if (url.includes('youtube.com/watch')) return url;
  
  let videoId = '';
  try {
    if (url.includes('embed/')) {
      const parts = url.split('embed/');
      if (parts.length > 1) {
        videoId = parts[1].split('?')[0];
      }
    } else if (url.includes('youtu.be/')) {
      const parts = url.split('youtu.be/');
      if (parts.length > 1) {
        videoId = parts[1].split('?')[0];
      }
    }
  } catch (e) {
    console.error("Error extracting video ID for watch:", e);
  }

  if (videoId) {
    return `https://www.youtube.com/watch?v=${videoId}`;
  }
  return url;
};

const ExerciseDetails = ({ exercise, onClose, onSelectAlternative }) => {
  const [alternatives, setAlternatives] = useState([]);
  const [loadingAlts, setLoadingAlts] = useState(true);

  // Fetch alternatives targeting the same muscle
  useEffect(() => {
    const fetchAlternatives = async () => {
      setLoadingAlts(true);
      try {
        const res = await api.get(`/exercises?category=${exercise.targetMuscle}`);
        if (res.success) {
          // Filter out the current exercise
          const filtered = res.exercises.filter(ex => ex._id !== exercise._id);
          setAlternatives(filtered.slice(0, 3));
        }
      } catch (err) {
        console.error("Error fetching alternative exercises:", err);
      } finally {
        setLoadingAlts(false);
      }
    };
    if (exercise) {
      fetchAlternatives();
    }
  }, [exercise]);

  if (!exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Background click to close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose} />

      {/* Modal Container */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white dark:bg-slate-900 w-full max-w-5xl rounded-[2.5rem] shadow-2xl border border-slate-200 dark:border-slate-800 z-10 flex flex-col md:flex-row overflow-hidden max-h-[90vh]"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-30 w-12 h-12 bg-white/80 dark:bg-slate-800/80 backdrop-blur-md rounded-full flex items-center justify-center text-slate-800 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-105 shadow-md border border-slate-200/50 dark:border-slate-700/50 transition-all cursor-pointer"
        >
          <FaTimes size={16} />
        </button>

        {/* Video / Visual Segment */}
        <div className="w-full md:w-1/2 bg-slate-950 relative min-h-[350px] md:min-h-full">
          <div className="absolute inset-0 w-full h-full">
            <iframe
              className="w-full h-full"
              src={formatEmbedUrl(resolveExerciseVideo(exercise.exerciseName || exercise.title, [exercise]))}
              title={exercise.exerciseName}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>

          {/* Quick Metrics Bar on top of media bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent flex items-center justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="bg-primary-500 text-white font-extrabold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
                {exercise.difficulty}
              </span>
              <span className="bg-slate-800 text-slate-300 font-bold text-[10px] tracking-wider uppercase px-3 py-1 rounded-full">
                {exercise.equipment}
              </span>
            </div>
          </div>
        </div>

        {/* Info / Instructions Segment */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-10 overflow-y-auto sidebar-scroll space-y-8 bg-slate-50/50 dark:bg-slate-900/50 backdrop-blur-xl">
          {/* Header */}
          <div>
            <span className="text-xs text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-widest block mb-1">
              {exercise.targetMuscle} focus
            </span>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
              {exercise.exerciseName}
            </h2>
            {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
              <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-2">
                Secondary Muscles: <span className="text-slate-800 dark:text-slate-200 font-bold">{exercise.secondaryMuscles.join(', ')}</span>
              </p>
            )}
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Calories</span>
              <span className="text-slate-900 dark:text-white font-black text-sm flex items-center justify-center gap-1">
                <FaFire className="text-orange-500 text-xs" /> ~{exercise.estimatedCalories} kcal
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Time</span>
              <span className="text-slate-900 dark:text-white font-black text-sm flex items-center justify-center gap-1">
                <FaClock className="text-indigo-500 text-xs" /> {exercise.estimatedDuration} min
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-sm text-center">
              <span className="text-slate-400 dark:text-slate-500 text-[10px] font-bold uppercase tracking-wider block mb-1">Equipment</span>
              <span className="text-slate-900 dark:text-white font-black text-sm truncate block" title={exercise.equipment}>
                <FaDumbbell className="text-slate-400 text-xs inline mr-1" /> {exercise.equipment.split(',')[0]}
              </span>
            </div>
          </div>

          {/* Target Sets & Reps Recommendation */}
          <div className="p-5 rounded-3xl bg-primary-500/10 border border-primary-500/25 shadow-sm flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-500 text-white flex items-center justify-center font-black text-lg">
                🎯
              </div>
              <div>
                <span className="text-[10px] text-primary-600 dark:text-primary-400 font-extrabold uppercase tracking-widest block">Recommended Volume</span>
                <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wide">
                  {exercise.difficulty === 'Beginner' ? '3 Sets x 12 Reps' : 
                   exercise.difficulty === 'Advanced' ? '4 Sets x 6-8 Reps' : '4 Sets x 8-10 Reps'}
                </h4>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Target Intensity</span>
              <span className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/50 dark:border-slate-700 text-xs font-black text-slate-850 dark:text-slate-250">
                {exercise.difficulty === 'Beginner' ? 'RPE 7-8' : 
                 exercise.difficulty === 'Advanced' ? 'RPE 9-10' : 'RPE 8-9'}
              </span>
            </div>
          </div>

          {/* Step-by-Step Instructions */}
          {exercise.instructions && exercise.instructions.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Instructions</h3>
              <div className="space-y-3">
                {exercise.instructions.map((step, index) => (
                  <div key={index} className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50 shadow-sm">
                    <span className="w-6 h-6 rounded-lg bg-primary-500/10 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xs font-black shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-slate-600 dark:text-slate-300 text-sm font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Common Mistakes & Safety Tips */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Common Mistakes */}
            {exercise.commonMistakes && exercise.commonMistakes.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-red-500 dark:text-red-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FaExclamationTriangle /> Common Mistakes
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {exercise.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-red-500/5 dark:bg-red-950/20 p-3 rounded-xl border border-red-500/10">
                      <span className="text-red-500 font-extrabold">•</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Safety Tips */}
            {exercise.tips && exercise.tips.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-extrabold text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FaShieldAlt /> Safety Tips
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {exercise.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 bg-green-500/5 dark:bg-green-950/20 p-3 rounded-xl border border-green-500/10">
                      <span className="text-green-500 font-extrabold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Alternative Exercises */}
          <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <FaSyncAlt className="text-primary-500 animate-spin-slow" /> Alternative Exercises
            </h3>
            {loadingAlts ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : alternatives.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {alternatives.map((alt) => (
                  <div
                    key={alt._id}
                    onClick={() => onSelectAlternative(alt)}
                    className="p-4 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl hover:border-primary-500/50 dark:hover:border-primary-500/30 cursor-pointer shadow-sm hover:shadow-md transition-all flex items-center gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-700 shrink-0">
                      <img src={alt.imageUrl} alt={alt.exerciseName} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white truncate uppercase">{alt.exerciseName}</h4>
                      <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase">{alt.difficulty} • {alt.equipment.split(',')[0]}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">No alternative exercises found.</p>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ExerciseDetails;
