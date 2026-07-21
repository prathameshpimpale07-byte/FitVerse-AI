import { useState, useEffect } from 'react';
import { FaShoppingCart, FaPlus, FaCheck, FaTrash, FaDownload } from 'react-icons/fa';
import toast from 'react-hot-toast';

const GroceryList = ({ plan }) => {
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');

  useEffect(() => {
    if (plan && plan.shoppingList) {
      // Map list to objects with check status
      setItems(plan.shoppingList.map((name, i) => ({ id: i, name, checked: false })));
    }
  }, [plan]);

  const handleToggleItem = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItem.trim()) return;
    const itemObj = {
      id: Date.now(),
      name: newItem.trim(),
      checked: false
    };
    setItems([...items, itemObj]);
    setNewItem('');
    toast.success("Added to shopping list");
  };

  const handleDeleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
    toast.success("Removed from list");
  };

  const handleDownload = () => {
    const textContent = items
      .map(item => `[${item.checked ? 'x' : ' '}] ${item.name}`)
      .join('\n');
    const blob = new Blob([`FitVerse Grocery List\n==================\n\n${textContent}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'fitverse_grocery_list.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("List downloaded successfully!");
  };

  return (
    <div className="max-w-xl mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 sm:p-10 shadow-2xl relative space-y-6">
      
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-2">
          <FaShoppingCart className="text-emerald-500" /> Shopping & Grocery List
        </h3>
        <button
          onClick={handleDownload}
          className="p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-650 dark:text-slate-300 transition-all cursor-pointer"
          title="Download List"
        >
          <FaDownload size={14} />
        </button>
      </div>

      {/* Add Item Form */}
      <form onSubmit={handleAddItem} className="flex gap-2">
        <input
          type="text"
          placeholder="Add manual item (e.g. eggs, protein shake)..."
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white"
        />
        <button
          type="submit"
          className="px-4 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all"
        >
          <FaPlus size={12} />
        </button>
      </form>

      {/* Items List */}
      {items.length > 0 ? (
        <div className="space-y-3 max-h-[400px] overflow-y-auto sidebar-scroll pr-1">
          {items.map(item => (
            <div
              key={item.id}
              className={`flex items-center justify-between p-4 bg-white dark:bg-slate-850/60 border border-slate-100 dark:border-slate-800/80 rounded-2xl transition-all ${
                item.checked ? 'opacity-50' : ''
              }`}
            >
              <div 
                className="flex items-center gap-3 cursor-pointer select-none"
                onClick={() => handleToggleItem(item.id)}
              >
                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                  item.checked ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-slate-300'
                }`}>
                  {item.checked && <FaCheck size={10} />}
                </div>
                <span className={`text-sm font-semibold text-slate-800 dark:text-slate-200 ${
                  item.checked ? 'line-through' : ''
                }`}>
                  {item.name}
                </span>
              </div>

              <button
                onClick={() => handleDeleteItem(item.id)}
                className="text-red-500/60 hover:text-red-600 p-1 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all cursor-pointer"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 bg-slate-50 dark:bg-slate-850/40 rounded-2xl border border-dashed border-slate-200">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Your list is empty. Generate a diet plan or add items!</p>
        </div>
      )}
    </div>
  );
};

export default GroceryList;
