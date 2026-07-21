import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTrash, FaUser, FaDumbbell, FaAppleAlt, FaHeartbeat, FaBolt } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const quickPrompts = [
  { icon: '💪', text: 'Best exercises for bigger arms?' },
  { icon: '🥗', text: 'High protein vegetarian diet plan?' },
  { icon: '⚠️', text: 'I have shoulder pain, what to do?' },
  { icon: '⏱️', text: 'Give me a 30-minute workout.' },
  { icon: '🔥', text: 'How to lose belly fat fast?' },
  { icon: '😴', text: 'How important is sleep for muscle?' },
];

// Renders a single AI message — parses bullet points, bold headings, and goal lines
const AIMessageContent = ({ content }) => {
  const lines = content.split('\n').filter(l => l.trim() !== '');

  return (
    <div className="space-y-1.5">
      {lines.map((line, i) => {
        const trimmed = line.trim();

        // 🎯 Goal line at the end
        if (trimmed.startsWith('🎯')) {
          return (
            <div key={i} className="mt-3 pt-3 border-t border-emerald-500/20 flex items-start gap-2">
              <span className="text-lg shrink-0">🎯</span>
              <p className="text-emerald-600 dark:text-emerald-400 text-xs font-black uppercase tracking-wide">
                {trimmed.replace('🎯', '').trim()}
              </p>
            </div>
          );
        }

        // **Bold Heading:** pattern
        if (/^\*\*.+\*\*[:\s]?/.test(trimmed)) {
          const headingText = trimmed.replace(/\*\*/g, '').replace(/:$/, '');
          return (
            <p key={i} className="text-slate-900 dark:text-white font-black text-xs uppercase tracking-wider pt-2 pb-0.5">
              {headingText}
            </p>
          );
        }

        // Bullet lines starting with •, -, *, or emoji bullet
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*') || /^[💪🥗⚠️✅🔥😴⏱️💡🧠🩺🍗🥦🏋️🧘]/.test(trimmed)) {
          const bulletText = trimmed.replace(/^[•\-\*]\s*/, '');
          // Detect "Exercise — sets x reps" or "Food — cals | protein" pattern
          const hasDash = bulletText.includes(' — ') || bulletText.includes(' - ');
          const parts = hasDash ? bulletText.split(/\s[—-]\s/) : null;

          return (
            <div key={i} className="flex items-start gap-2.5">
              <span className="text-emerald-500 text-base shrink-0 leading-5">
                {/^[💪🥗⚠️✅🔥😴⏱️💡🧠🩺🍗🥦🏋️🧘]/.test(trimmed)
                  ? trimmed[0]
                  : '•'}
              </span>
              <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                {parts ? (
                  <>
                    <span className="font-bold text-slate-900 dark:text-white">{parts[0]}</span>
                    <span className="text-slate-500 dark:text-slate-400"> — {parts.slice(1).join(' — ')}</span>
                  </>
                ) : (
                  bulletText
                )}
              </p>
            </div>
          );
        }

        // Plain text
        return (
          <p key={i} className="text-sm leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

const AIWorkoutCoach = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/ai/chat-history');
        if (res.success) setMessages(res.messages);
      } catch (err) {
        console.error('Error loading chat history:', err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async (messageText) => {
    const textToSend = (messageText || input).trim();
    if (!textToSend) return;
    if (!messageText) setInput('');
    setLoading(true);

    const userMsg = { role: 'user', content: textToSend, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);

    try {
      const res = await api.post('/ai/chat', { message: textToSend }, { timeout: 60000 });
      if (res.success) {
        setMessages(res.messages);
      } else {
        toast.error('Failed to get response from AI Coach.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Error connecting to AI Coach.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    if (!window.confirm('Clear your entire conversation history?')) return;
    try {
      const res = await api.delete('/ai/chat-history');
      if (res.success) {
        setMessages([]);
        toast.success('Conversation cleared.');
      }
    } catch (err) {
      toast.error('Failed to clear conversation.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="space-y-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
              <FaRobot size={18} />
            </span>
            FitVerse AI Coach
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-semibold pl-1">
            Ask anything — workouts, diet, recovery, supplements, injuries. Available 24/7.
          </p>
        </div>
        {messages.length > 0 && (
          <button
            onClick={handleClear}
            className="px-4 py-2.5 bg-red-500/8 hover:bg-red-500/15 text-red-500 border border-red-500/15 rounded-2xl transition-all cursor-pointer flex items-center gap-2 text-xs font-bold shrink-0"
          >
            <FaTrash size={10} /> Clear Chat
          </button>
        )}
      </div>

      {/* Topic chips */}
      <div className="flex flex-wrap gap-2">
        {[
          { icon: <FaDumbbell />, label: 'Workouts' },
          { icon: <FaAppleAlt />, label: 'Nutrition' },
          { icon: <FaHeartbeat />, label: 'Recovery' },
          { icon: <FaBolt />, label: 'Supplements' },
        ].map(chip => (
          <span key={chip.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 rounded-full text-[10px] font-black uppercase tracking-wider">
            {chip.icon} {chip.label}
          </span>
        ))}
      </div>

      {/* Chat window */}
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] shadow-sm flex flex-col h-[600px] overflow-hidden">

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-5 bg-slate-50/50 dark:bg-slate-950/20 scrollbar-none">
          {messages.length === 0 ? (
            /* Empty state */
            <div className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto space-y-6 py-8">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-3xl shadow-2xl shadow-violet-500/30">
                <FaRobot />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide">Your AI Fitness Coach</h3>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold mt-2 leading-relaxed max-w-xs mx-auto">
                  Get structured, point-by-point advice on workouts, diet, supplements, injuries & more. Just ask!
                </p>
              </div>
              {/* Quick prompts grid */}
              <div className="grid grid-cols-2 gap-2.5 w-full">
                {quickPrompts.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(p.text)}
                    className="p-3 bg-white dark:bg-slate-900 hover:bg-violet-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-violet-300 dark:hover:border-violet-700 rounded-2xl text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-sm transition-all text-left cursor-pointer flex items-start gap-2"
                  >
                    <span className="text-base shrink-0">{p.icon}</span>
                    {p.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, idx) => (
              <AnimatePresence key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Robot avatar */}
                  {m.role !== 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20 mt-1">
                      <FaRobot size={14} />
                    </div>
                  )}

                  {/* Bubble */}
                  <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm border ${
                    m.role === 'user'
                      ? 'bg-slate-900 dark:bg-slate-800 text-white border-slate-800 rounded-tr-none'
                      : 'bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-100 border-slate-100 dark:border-slate-700/50 rounded-tl-none'
                  }`}>
                    {m.role === 'user' ? (
                      <p className="text-sm font-semibold leading-relaxed">{m.content}</p>
                    ) : (
                      <AIMessageContent content={m.content} />
                    )}
                  </div>

                  {/* User avatar */}
                  {m.role === 'user' && (
                    <div className="w-9 h-9 rounded-2xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-white flex items-center justify-center shrink-0 shadow-inner mt-1">
                      <FaUser size={12} />
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            ))
          )}

          {/* Typing indicator */}
          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md shadow-violet-500/20">
                <FaRobot size={14} />
              </div>
              <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-100 dark:border-slate-700/50 shadow-sm flex items-center gap-1.5 py-5">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.4s]" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompts strip (during conversation) */}
        {messages.length > 0 && (
          <div className="px-5 py-2.5 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex gap-2 overflow-x-auto scrollbar-none shrink-0">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(p.text)}
                disabled={loading}
                className="px-3 py-2 bg-slate-50 dark:bg-slate-800 hover:bg-violet-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 hover:border-violet-300 dark:hover:border-violet-700 rounded-full text-[10px] font-extrabold text-slate-600 dark:text-slate-300 whitespace-nowrap shadow-sm transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                <span>{p.icon}</span> {p.text.split(' ').slice(0, 3).join(' ')}…
              </button>
            ))}
          </div>
        )}

        {/* Input bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex gap-3 items-center shrink-0">
          <input
            type="text"
            placeholder="Ask anything about workouts, diet, recovery..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
            className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-950 dark:text-white px-5 py-3.5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all text-sm font-medium placeholder:text-slate-400"
          />
          <button
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            className="w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-violet-500/30 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FaPaperPlane size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AIWorkoutCoach;
