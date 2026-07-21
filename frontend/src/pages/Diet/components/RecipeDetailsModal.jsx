import { FaTimes, FaFire, FaClock, FaDumbbell, FaListOl, FaExchangeAlt, FaUtensils } from 'react-icons/fa';

const RecipeDetailsModal = ({ recipe, onClose }) => {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] max-w-2xl w-full max-h-[85vh] overflow-y-auto sidebar-scroll shadow-2xl p-6 sm:p-10 relative flex flex-col md:flex-row gap-8">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full flex items-center justify-center text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer z-20"
        >
          <FaTimes size={16} />
        </button>

        {/* Visual Panel */}
        <div className="w-full md:w-1/2 relative min-h-[250px] rounded-3xl overflow-hidden bg-slate-950/20 shrink-0">
          {recipe.imageUrl ? (
            <img 
              src={recipe.imageUrl} 
              alt={recipe.foodName} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 gap-2">
              <FaUtensils size={40} className="text-emerald-500" />
            </div>
          )}

          {/* Tag */}
          <div className="absolute bottom-4 left-4 bg-emerald-500 text-white font-extrabold text-[10px] tracking-wider uppercase px-3.5 py-1.5 rounded-full shadow-md">
            {recipe.category || 'Nutrient Rich'}
          </div>
        </div>

        {/* Info panel */}
        <div className="flex-1 space-y-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-wide">
              {recipe.foodName}
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-1">
              Serving Size: <span className="text-slate-800 dark:text-slate-200 font-bold">{recipe.servingSize || '1 Serving'}</span>
            </p>
          </div>

          {/* Macros Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-150/30 dark:border-slate-750 text-center">
              <span className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase block mb-0.5">Calories</span>
              <span className="text-slate-900 dark:text-white font-black text-xs flex items-center justify-center gap-1">
                <FaFire className="text-orange-500 text-xs" /> {recipe.calories} kcal
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-155/30 dark:border-slate-750 text-center">
              <span className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase block mb-0.5">Protein</span>
              <span className="text-slate-900 dark:text-white font-black text-xs flex items-center justify-center gap-1">
                <FaDumbbell className="text-emerald-500 text-xs" /> {recipe.protein}g
              </span>
            </div>
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-155/30 dark:border-slate-750 text-center">
              <span className="text-slate-400 dark:text-slate-500 text-[9px] font-bold uppercase block mb-0.5">Ready in</span>
              <span className="text-slate-900 dark:text-white font-black text-xs flex items-center justify-center gap-1">
                <FaClock className="text-indigo-500 text-xs" /> {recipe.prepTime}m
              </span>
            </div>
          </div>

          {/* Cooking Instructions */}
          {recipe.recipe && recipe.recipe.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-black text-slate-900 dark:text-white uppercase text-xs tracking-wider flex items-center gap-2">
                <FaListOl className="text-emerald-500" /> Cooking Instructions
              </h4>
              <div className="space-y-2">
                {recipe.recipe.map((step, idx) => (
                  <div key={idx} className="flex gap-3 text-xs">
                    <span className="w-5 h-5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-black shrink-0">
                      {idx + 1}
                    </span>
                    <p className="text-slate-650 dark:text-slate-350 font-medium leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Alternatives */}
          {recipe.alternativeFoods && recipe.alternativeFoods.length > 0 && (
            <div className="p-4 rounded-2xl bg-primary-500/5 border border-primary-500/10 space-y-2">
              <h4 className="font-black text-primary-600 dark:text-primary-400 uppercase text-[10px] tracking-wider flex items-center gap-1.5">
                <FaExchangeAlt /> Healthy Alternatives
              </h4>
              <p className="text-[11px] text-slate-550 dark:text-slate-400 font-semibold leading-relaxed">
                If you are short on ingredients, you can substitute this meal with: <span className="text-slate-800 dark:text-slate-200 font-black">{recipe.alternativeFoods.join(', ')}</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetailsModal;
