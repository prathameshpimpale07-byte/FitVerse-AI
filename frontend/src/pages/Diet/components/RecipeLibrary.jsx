import { useState, useEffect } from 'react';
import { FaSearch, FaUtensils, FaFire, FaClock, FaHeart, FaRegHeart } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import RecipeDetailsModal from './RecipeDetailsModal';

const RecipeLibrary = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await api.get('/diets/recipes');
        if (res.success) {
          setRecipes(res.recipes);
        }
      } catch (err) {
        console.error(err);
        toast.error("Could not load recipes");
      } finally {
        setLoading(false);
      }
    };
    fetchRecipes();
  }, []);

  const categories = ['all', 'breakfast', 'lunch', 'snack', 'dinner'];

  const filteredRecipes = recipes.filter(r => {
    const matchesSearch = r.foodName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || r.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search healthy recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-200/50 dark:border-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-500/10'
                  : 'bg-white/60 dark:bg-slate-900/60 text-slate-500 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((r) => (
            <div
              key={r._id}
              onClick={() => setSelectedRecipe(r)}
              className="group bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.2rem] overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all cursor-pointer flex flex-col h-[350px]"
            >
              {/* Image Container */}
              <div className="h-44 relative bg-slate-100 dark:bg-slate-850 overflow-hidden shrink-0">
                {r.imageUrl ? (
                  <img
                    src={r.imageUrl}
                    alt={r.foodName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <FaUtensils size={40} />
                  </div>
                )}
                <span className="absolute top-4 left-4 bg-emerald-600/90 backdrop-blur text-white text-[9px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                  {r.category}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex flex-col justify-between flex-1">
                <div>
                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide group-hover:text-emerald-650 transition-colors line-clamp-1">
                    {r.foodName}
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-550 font-bold mt-1 uppercase">Serving Size: {r.servingSize}</p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex items-center justify-between text-xs text-slate-550 dark:text-slate-450 font-black uppercase tracking-wider">
                  <span className="flex items-center gap-1.5"><FaFire className="text-orange-500" /> {r.calories} kcal</span>
                  <span className="flex items-center gap-1.5"><FaClock className="text-indigo-500" /> {r.prepTime} mins</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2rem]">
          <FaUtensils size={48} className="mx-auto text-slate-300 mb-4 animate-pulse" />
          <h3 className="text-xl font-bold text-slate-950 dark:text-white mb-2">No recipes found</h3>
          <p className="text-slate-500">Try matching another keyword or filter criteria.</p>
        </div>
      )}

      {selectedRecipe && (
        <RecipeDetailsModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
        />
      )}
    </div>
  );
};

export default RecipeLibrary;
