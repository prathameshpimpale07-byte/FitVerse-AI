import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRobot, FaPaperPlane, FaTrash, FaUser, FaMicrophone, FaExclamationTriangle } from 'react-icons/fa';
import ReactMarkdown from 'react-markdown';
import api from '../../services/api';
import toast from 'react-hot-toast';

const QUICK_PROMPTS = [
  { emoji: '💪', text: 'Best chest workout for beginners?' },
  { emoji: '🥗', text: 'High protein vegetarian meal plan?' },
  { emoji: '🔥', text: 'How to lose belly fat fast?' },
  { emoji: '⚠️', text: 'I have knee pain, safe exercises?' },
  { emoji: '😴', text: 'How does sleep affect muscle growth?' },
  { emoji: '⏱️', text: 'Give me a 30-minute full-body workout.' },
];

// Renders AI replies using react-markdown with custom Tailwind styles
const MessageContent = ({ content }) => {
  const isScopeRefusal = content.includes('Scope Constraint') || content.includes('I can only assist with workout');

  if (isScopeRefusal) {
    return (
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 flex items-start gap-3 text-amber-200 shadow-lg shadow-amber-950/20">
        <FaExclamationTriangle className="text-amber-400 text-lg shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-xs uppercase tracking-wider text-amber-300">Workout & Diet Scope Only</p>
          <p className="text-sm font-medium leading-relaxed text-amber-100/90">{content.replace(/⚠️\s*\*\*Scope Constraint\*\*:\s*/, '')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="text-sm text-slate-200 font-normal leading-relaxed space-y-3">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-lg font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-300 to-indigo-200 mt-5 mb-3 uppercase tracking-wider border-b border-slate-700/60 pb-2" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-base font-bold text-violet-300 mt-4 mb-2 flex items-center gap-2" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-sm font-bold text-indigo-300 mt-3 mb-1.5" {...props} />,
          p: ({node, ...props}) => <p className="mb-3 leading-relaxed text-slate-200 font-medium" {...props} />,
          ul: ({node, ...props}) => <ul className="my-3 space-y-2.5 pl-1" {...props} />,
          ol: ({node, ...props}) => <ol className="list-decimal pl-5 my-3 space-y-2.5" {...props} />,
          li: ({node, ...props}) => <li className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 text-slate-200 leading-relaxed shadow-sm hover:border-violet-500/30 transition-all" {...props} />,
          strong: ({node, ...props}) => <strong className="font-bold text-white bg-violet-500/20 px-1.5 py-0.5 rounded text-violet-200" {...props} />,
          blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-violet-500 pl-4 py-2.5 italic my-3 bg-violet-950/30 rounded-r-2xl text-slate-300 font-medium" {...props} />,
          code: ({node, ...props}) => <code className="bg-slate-950 text-emerald-400 px-2 py-1 rounded text-xs font-mono border border-slate-800" {...props} />,
          a: ({node, ...props}) => <a className="text-violet-400 hover:underline font-bold" {...props} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

const AIPage = () => {
  const [messages,    setMessages]    = useState([]);
  const [input,       setInput]       = useState('');
  const [loading,     setLoading]     = useState(false);
  const [histLoading, setHistLoading] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);
  const recognitionRef = useRef(null);

  // Cleanup speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch(e) {}
      }
    };
  }, []);

  const stopListening = () => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch(e) {}
    }
    setIsListening(false);
  };

  const toggleListen = () => {
    if (isListening) {
      stopListening();
    } else {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error('Voice input is supported in Google Chrome & Microsoft Edge browsers.');
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('🎙️ Listening... Speak your question now!');
      };

      recognition.onresult = (event) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; ++i) {
          transcript += event.results[i][0].transcript;
        }
        if (transcript) {
          setInput(transcript);
        }
      };

      recognition.onerror = (event) => {
        if (event.error === 'not-allowed') {
          toast.error('Mic access denied. Click the Lock/Mic icon next to your URL bar and click "Allow".');
        } else if (event.error === 'no-speech') {
          toast.error('No speech detected. Click the mic icon 🎙️ and speak clearly.');
        } else if (event.error !== 'aborted') {
          toast.error(`Mic error: ${event.error}`);
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      try {
        recognition.start();
      } catch (err) {
        setIsListening(false);
        toast.error('Could not start microphone. Please refresh the page.');
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        // Clear history on mount to start fresh every time
        await api.delete('/ai/chat-history');
        setMessages([]);
      } catch { /* silent */ } finally { setHistLoading(false); }
    })();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const msg = (text || input).trim();
    if (!msg || loading) return;
    if (!text) setInput('');
    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: msg }]);
    try {
      const res = await api.post('/ai/chat', { message: msg }, { timeout: 60000 });
      if (res.success) setMessages(res.messages);
      else toast.error('AI Coach failed to respond.');
    } catch { toast.error('Connection error. Please retry.'); }
    finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm('Clear your full conversation?')) return;
    try {
      const res = await api.delete('/ai/chat-history');
      if (res.success) { setMessages([]); toast.success('Conversation cleared.'); }
    } catch { toast.error('Could not clear history.'); }
  };

  return (
    /*
      DashboardLayout gives this component:
        — a sticky top navbar of h-16
        — padding: p-4 sm:p-6 lg:p-8
      We use a flex column that fills that space exactly:
        height = 100vh − 64px (navbar) − 2×padding (32px each side on lg = 64px)  →  calc(100vh - 8rem)
    */
    <div
      className="flex flex-col bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-2xl shadow-black/40 max-w-4xl mx-auto w-full h-[calc(100vh-5.5rem)] sm:h-[calc(100vh-8rem)] min-h-[450px]"
    >

      {/* ── Top bar ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-5 py-3.5 bg-slate-900 border-b border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-violet-500/30">
            <FaRobot size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="text-sm font-black text-white uppercase tracking-wide">FitVerse AI Coach</p>
              <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[9px] font-black uppercase tracking-wider border border-violet-500/30 flex items-center gap-1">
                ⚡ RAG Active
              </span>
            </div>
            <p className="text-[10px] font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              Online · Knowledge Base Search · Gym · Diet · Recovery
            </p>
          </div>
        </div>

        {messages.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center gap-1.5 px-3 py-2 text-[11px] font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 rounded-xl transition-all cursor-pointer"
          >
            <FaTrash size={9} /> Clear
          </button>
        )}
      </div>

      {/* ── Messages ────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-4 scrollbar-none">

        {/* Empty / welcome state */}
        {!histLoading && messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center space-y-7 py-6"
          >
            <div className="w-20 h-20 rounded-[1.75rem] bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-violet-500/30 text-3xl">
              <FaRobot />
            </div>
            <div className="space-y-2 max-w-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-[10px] font-black uppercase tracking-wider">
                ⚡ Retrieval-Augmented Generation Enabled
              </div>
              <h2 className="text-xl font-black text-white uppercase tracking-wide">FitVerse AI Master Coach</h2>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                Backed by real-time knowledge retrieval. Ask about chest bench safety, knee pain, high protein veg diets, or supplement dosage.
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 w-full max-w-lg">
              {QUICK_PROMPTS.map((p, i) => (
                <button
                  key={i}
                  onClick={() => send(p.text)}
                  className="p-3 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/40 rounded-2xl text-left transition-all group flex flex-col justify-between space-y-2"
                >
                  <span className="text-lg">{p.emoji}</span>
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white line-clamp-2 leading-tight">
                    {p.text}
                  </span>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Loading history spinner */}
        {histLoading && (
          <div className="flex justify-center pt-10">
            <div className="w-7 h-7 border-2 border-t-violet-500 border-slate-700 rounded-full animate-spin" />
          </div>
        )}

        {/* Chat bubbles */}
        {messages.map((m, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.16 }}
            className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {m.role !== 'user' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shrink-0 mt-0.5 shadow-md shadow-violet-500/20">
                <FaRobot size={12} />
              </div>
            )}

            <div className={`max-w-[90%] sm:max-w-[85%] px-5 sm:px-6 py-4.5 rounded-3xl shadow-xl text-sm ${
              m.role === 'user'
                ? 'bg-violet-600 text-white rounded-tr-md font-semibold'
                : 'bg-slate-900/90 border border-slate-800 rounded-tl-md backdrop-blur-xl'
            }`}>
              {m.role === 'user'
                ? <p className="font-semibold leading-relaxed">{m.content}</p>
                : (
                  <div>
                    <MessageContent content={m.content} />
                    {m.retrievedDocs && m.retrievedDocs.length > 0 && (
                      <div className="mt-3 pt-2.5 border-t border-slate-700/60 flex flex-wrap items-center gap-1.5 text-[10px]">
                        <span className="font-bold text-slate-400">📚 Verified RAG Sources:</span>
                        {m.retrievedDocs.map((doc, dIdx) => (
                          <span key={dIdx} className="px-2 py-0.5 rounded-md bg-violet-500/10 text-violet-300 border border-violet-500/20 font-semibold">
                            {doc.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
            </div>

            {m.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-700 flex items-center justify-center text-slate-300 shrink-0 mt-0.5">
                <FaUser size={11} />
              </div>
            )}
          </motion.div>
        ))}

        {/* Typing dots */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-3"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white shrink-0">
                <FaRobot size={12} />
              </div>
              <div className="bg-slate-800 border border-slate-700/50 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5">
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce" />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.15s]" />
                <span className="w-2 h-2 bg-violet-400 rounded-full animate-bounce [animation-delay:0.3s]" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* ── Quick prompts strip (during chat) ───────────────── */}
      {messages.length > 0 && (
        <div className="flex gap-2 px-4 sm:px-5 py-2.5 bg-slate-900 border-t border-slate-800 overflow-x-auto scrollbar-none shrink-0">
          {QUICK_PROMPTS.map((p, i) => (
            <button
              key={i}
              onClick={() => send(p.text)}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-violet-500/40 rounded-full text-[10px] font-bold text-slate-400 hover:text-white whitespace-nowrap transition-all cursor-pointer disabled:opacity-40 shrink-0"
            >
              {p.emoji} {p.text.split(' ').slice(0, 3).join(' ')}…
            </button>
          ))}
        </div>
      )}

      {/* Listening Status Banner */}
      {isListening && (
        <div className="px-5 py-2.5 bg-rose-500/10 border-t border-rose-500/20 text-rose-400 text-xs font-bold flex items-center justify-between animate-pulse">
          <span className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping" />
            🎙️ Listening to your voice... Speak your question now!
          </span>
          <button onClick={stopListening} className="text-[10px] uppercase font-black tracking-wider text-rose-300 hover:underline">
            Stop Listening
          </button>
        </div>
      )}

      {/* ── Input bar ───────────────────────────────────────── */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
        className="p-2.5 sm:px-5 sm:py-3.5 bg-slate-900 border-t border-slate-800 flex gap-2 sm:gap-3 items-center shrink-0"
      >
        <input
          ref={inputRef}
          type="text"
          placeholder="Ask AI coach..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          className="flex-1 min-w-0 bg-slate-800 border border-slate-700 focus:border-violet-500 text-white placeholder:text-slate-500 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500/20 transition-all disabled:opacity-50"
        />
        <button
          type="button"
          onClick={toggleListen}
          disabled={loading}
          className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center transition-all shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed ${
            isListening 
              ? 'bg-rose-500/20 text-rose-500 animate-pulse border border-rose-500/50' 
              : 'bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 border border-slate-700'
          }`}
          title="Click to speak"
        >
          <FaMicrophone className="text-xs sm:text-sm" />
        </button>
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-9 h-9 sm:w-11 sm:h-11 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-violet-500/25 shrink-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FaPaperPlane className="text-xs sm:text-sm" />
        </button>
      </form>
    </div>
  );
};

export default AIPage;
