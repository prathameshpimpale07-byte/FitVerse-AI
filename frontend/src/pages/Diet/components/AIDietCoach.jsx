import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaUserCircle, FaRobot, FaAppleAlt } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const AIDietCoach = () => {
  const [messages, setMessages] = useState([
    { role: 'model', content: "Hello! I am your FitVerse AI Diet Coach. Ask me anything about swapping ingredients, eating on a budget, fasting, or recipes!" }
  ]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const chatEndRef = useRef(null);

  const scrollChat = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollChat();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || sending) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSending(true);

    try {
      const res = await api.post('/ai/diet-chat', { message: userMessage });
      if (res.success && res.reply) {
        setMessages(prev => [...prev, { role: 'model', content: res.reply }]);
      } else {
        toast.error("Failed to connect to AI Coach");
      }
    } catch (err) {
      console.error(err);
      toast.error("Coach connection error");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-2xl relative flex flex-col h-[550px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black">
            🥗
          </div>
          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wide">
              AI Diet Coach
            </h3>
            <p className="text-[10px] text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-widest">Active & online</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto sidebar-scroll py-6 space-y-4 pr-1">
        {messages.map((msg, index) => {
          const isUser = msg.role === 'user';
          return (
            <div
              key={index}
              className={`flex gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-slate-400 text-lg ${
                isUser ? 'text-emerald-500' : 'text-indigo-500'
              }`}>
                {isUser ? <FaUserCircle /> : <FaRobot />}
              </div>
              <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed ${
                isUser
                  ? 'bg-emerald-500 text-white rounded-tr-none'
                  : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-100 dark:border-slate-750 rounded-tl-none'
              }`}>
                {msg.content}
              </div>
            </div>
          );
        })}
        {sending && (
          <div className="flex gap-3 max-w-[85%] mr-auto items-center">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 text-lg">
              <FaRobot />
            </div>
            <div className="flex gap-1.5 p-4 rounded-3xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-750 rounded-tl-none">
              <span className="w-2.5 h-2.5 bg-slate-400 rounded-full animate-bounce" />
              <span className="w-2.5 h-2.5 bg-slate-450 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-2.5 h-2.5 bg-slate-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input bar */}
      <form onSubmit={handleSend} className="flex gap-2 border-t border-slate-100 dark:border-slate-800 pt-4 shrink-0">
        <input
          type="text"
          placeholder="e.g. I don't like oats, what can I swap it with?..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white"
          disabled={sending}
        />
        <button
          type="submit"
          className="px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl flex items-center justify-center cursor-pointer transition-all shadow-md shadow-emerald-500/10"
          disabled={sending}
        >
          <FaPaperPlane size={14} />
        </button>
      </form>
    </div>
  );
};

export default AIDietCoach;
