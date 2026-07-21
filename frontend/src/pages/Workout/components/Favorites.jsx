import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaHeart, FaDumbbell, FaFire, FaClock, FaPlay } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

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

const Favorites = ({ onSelectExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  const loadFavorites = async () => {
    try {
      const res = await api.get('/favorites');
      if (res.success) {
        setExercises(res.data);
      }
    } catch (err) {
      console.error("Error loading favorites:", err);
      toast.error("Could not load favorites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const removeFavorite = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.delete(`/favorites/${id}`);
      if (res.success) {
        setExercises(exercises.filter(ex => ex._id !== id));
        toast.success("Removed from favorites");
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove favorite");
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
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <FaHeart className="text-red-550" /> Favorite Exercises
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Your bookmarked list of reference exercises for quick access</p>
      </div>

      {exercises.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {exercises.map((ex) => (
              <motion.div
                key={ex._id}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ y: -6 }}
                className="group bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer flex flex-col h-[380px]"
                onClick={() => onSelectExercise(ex)}
              >
                {/* Image */}
                <div className="h-44 relative overflow-hidden bg-slate-100 dark:bg-slate-850 shrink-0">
                  {ex.imageUrl ? (
                    <img src={ex.imageUrl} alt={ex.exerciseName} className="w-full h-full object-cover transition-transform duration-505 group-hover:scale-105" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 dark:text-slate-700">
                      <FaDumbbell size={40} />
                    </div>
                  )}

                  {/* Level Tag */}
                  <span className="absolute top-4 left-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur text-slate-900 dark:text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm">
                    {ex.difficulty}
                  </span>

                  {/* Unfavorite */}
                  <button
                    onClick={(e) => removeFavorite(e, ex._id)}
                    className="absolute top-4 right-4 w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-red-500 hover:scale-110 shadow-sm transition-all cursor-pointer border border-slate-100 dark:border-slate-800"
                  >
                    <FaHeart className="text-lg text-red-500" />
                  </button>

                  {/* Play Button */}
                  {ex.videoUrl && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVideoUrl(ex.videoUrl);
                      }}
                      className="absolute top-4 right-16 w-10 h-10 bg-white dark:bg-slate-900 rounded-full flex items-center justify-center text-primary-500 hover:scale-110 hover:text-white hover:bg-primary-600 shadow-sm transition-all border border-slate-100 dark:border-slate-800 cursor-pointer"
                      title="Watch Video"
                    >
                      <FaPlay size={10} className="ml-0.5" />
                    </button>
                  )}
                </div>

                {/* Details */}
                <div className="p-6 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] text-primary-500 dark:text-primary-400 font-extrabold uppercase tracking-widest block">
                      {ex.targetMuscle}
                    </span>
                    <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1 group-hover:text-primary-600 transition-colors line-clamp-1">
                      {ex.exerciseName}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-2 flex items-center gap-1.5">
                      <FaDumbbell className="text-slate-400" /> Equipment: <span className="text-slate-700 dark:text-slate-300 font-bold">{ex.equipment}</span>
                    </p>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 font-bold">
                    <span className="flex items-center gap-1.5"><FaFire className="text-orange-500" /> ~{ex.estimatedCalories} kcal</span>
                    <span className="flex items-center gap-1.5"><FaClock className="text-indigo-500" /> {ex.estimatedDuration} mins</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <FaHeart size={48} className="mx-auto text-slate-200 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No favorites yet</h3>
          <p className="text-slate-500 dark:text-slate-400">Save exercises to your favorites to see them listed here.</p>
        </div>
      )}

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
                src={getEmbedUrl(selectedVideoUrl)}
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

export default Favorites;
