import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaDumbbell, FaFire, FaClock, FaHeart, FaRegHeart, FaArrowLeft, FaFilter, FaPlay } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
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

const ExerciseLibrary = ({ category, onBack, onSelectExercise }) => {
  const [exercises, setExercises] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [visibleCount, setVisibleCount] = useState(10);
  const [loading, setLoading] = useState(true);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);

  // Fetch exercises and favorites
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Fetch Exercises
        const catQuery = category ? `category=${category.id}` : 'category=all';
        const exRes = await api.get(`/exercises?${catQuery}`);
        if (exRes.success) {
          setExercises(exRes.exercises);
        }

        // Fetch Favorites (Only if authenticated)
        const token = localStorage.getItem('fitverse_token');
        if (token) {
          const favRes = await api.get('/favorites');
          if (favRes.success) {
            setFavorites(favRes.data.map(fav => fav._id));
          }
        } else {
          setFavorites([]);
        }
      } catch (err) {
        console.error("Error loading library data:", err);
        // Do not toast for guest views if exercises were loaded
        if (exercises.length === 0) {
          toast.error("Failed to load exercises.");
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [category]);

  // Toggle Favorite
  const toggleFavorite = async (e, exerciseId) => {
    e.stopPropagation(); // Avoid triggering card details click
    const token = localStorage.getItem('fitverse_token');
    if (!token) {
      toast.error("Please login to add favorites.");
      return;
    }
    try {
      const isFav = favorites.includes(exerciseId);
      if (isFav) {
        const res = await api.delete(`/favorites/${exerciseId}`);
        if (res.success) {
          setFavorites(favorites.filter(id => id !== exerciseId));
          toast.success("Removed from favorites");
        }
      } else {
        const res = await api.post('/favorites', { exerciseId });
        if (res.success) {
          setFavorites([...favorites, exerciseId]);
          toast.success("Added to favorites");
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
      toast.error("Could not update favorites");
    }
  };

  // Filtering Logic
  const filteredExercises = exercises.filter(ex => {
    const matchesSearch = ex.exerciseName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficultyFilter === 'all' || ex.difficulty === difficultyFilter;
    return matchesSearch && matchesDifficulty;
  });

  const loadMore = () => {
    setVisibleCount(prev => prev + 10);
  };

  return (
    <div className="space-y-6">
      {/* Header with Back button */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all cursor-pointer"
            >
              <FaArrowLeft />
            </button>
          )}
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
              {category ? `${category.name} Exercises` : 'Exercise Library'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              {category ? `Showing workouts for ${category.name}` : 'Explore our comprehensive workouts library'}
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search exercise..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all text-slate-800 dark:text-white placeholder-slate-400"
            />
          </div>
          <div className="relative">
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="appearance-none pl-4 pr-10 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-slate-800 dark:text-white transition-all cursor-pointer"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
            <FaFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-xs" />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      ) : filteredExercises.length > 0 ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredExercises.slice(0, visibleCount).map((ex) => (
              <motion.div
                key={ex._id}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => onSelectExercise(ex)}
                className="group relative aspect-square w-full rounded-3xl overflow-hidden shadow-lg border border-slate-100 dark:border-slate-800 bg-white/10 dark:bg-slate-900/10 backdrop-blur-md flex flex-col justify-end cursor-pointer"
              >
                {/* Background Image */}
                {ex.imageUrl ? (
                  <img 
                    src={ex.imageUrl} 
                    alt={ex.exerciseName} 
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full bg-slate-950 flex items-center justify-center text-slate-700">
                    <FaDumbbell size={64} />
                  </div>
                )}
                {/* Glassmorphic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10" />

                {/* Glowing borders */}
                <div className="absolute inset-0 border border-white/10 group-hover:border-primary-500/30 rounded-3xl z-20 pointer-events-none transition-all duration-300" />

                {/* Level Tag */}
                <span className="absolute top-4 left-4 z-20 bg-slate-950/80 backdrop-blur-md text-white text-[10px] font-extrabold px-3 py-1 rounded-full shadow-sm border border-white/15">
                  {ex.difficulty}
                </span>

                {/* Favorite Button */}
                <button
                  onClick={(e) => toggleFavorite(e, ex._id)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-slate-950/80 backdrop-blur-md rounded-full flex items-center justify-center text-red-500 hover:scale-110 shadow-sm transition-all border border-white/15 cursor-pointer"
                >
                  {favorites.includes(ex._id) ? <FaHeart className="text-base text-red-500" /> : <FaRegHeart className="text-base text-slate-350" />}
                </button>

                {/* Play Button - Always available for every exercise */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedVideoUrl(resolveExerciseVideo(ex.exerciseName, [ex]));
                  }}
                  className="absolute top-4 right-16 z-20 w-10 h-10 bg-slate-950/80 backdrop-blur-md rounded-full flex items-center justify-center text-primary-500 hover:scale-110 hover:text-white shadow-sm transition-all border border-white/15 cursor-pointer"
                  title="Watch Demo Video"
                >
                  <FaPlay size={10} className="ml-0.5" />
                </button>

                {/* Card Content */}
                <div className="relative z-20 p-6 space-y-3 text-white">
                  <div>
                    <span className="text-[10px] text-primary-450 font-extrabold uppercase tracking-widest block">
                      {ex.targetMuscle}
                    </span>
                    <h3 className="text-xl font-black mt-1 tracking-wide text-white group-hover:text-primary-300 transition-colors uppercase line-clamp-1">
                      {ex.exerciseName}
                    </h3>
                  </div>

                  {/* Quick Specs */}
                  <p className="text-slate-300 text-[10px] font-black tracking-wider flex items-center justify-between pt-3 border-t border-white/10 w-full uppercase whitespace-nowrap">
                    <span className="flex items-center gap-1"><FaFire className="text-orange-500 text-xs shrink-0" /> {ex.estimatedCalories} KCAL</span>
                    <span className="text-slate-500">•</span>
                    <span className="flex items-center gap-1"><FaClock className="text-indigo-400 text-xs shrink-0" /> {ex.estimatedDuration} MIN</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-primary-400">{ex.difficulty}</span>
                  </p>

                  <div className="text-[10px] text-primary-400 font-extrabold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 uppercase tracking-widest pt-1">
                    View Instructions &rarr;
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Load More Button */}
          {filteredExercises.length > visibleCount && (
            <div className="flex justify-center pt-4">
              <button
                onClick={loadMore}
                className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm rounded-2xl hover:opacity-90 transition-all shadow-lg cursor-pointer"
              >
                Load More Exercises
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <FaDumbbell size={48} className="mx-auto text-slate-300 dark:text-slate-700 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No exercises found</h3>
          <p className="text-slate-500 dark:text-slate-400">Try adjusting your search query or difficulty filters.</p>
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
                src={formatEmbedUrl(selectedVideoUrl)}
                title="Exercise Demo Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

export default ExerciseLibrary;
