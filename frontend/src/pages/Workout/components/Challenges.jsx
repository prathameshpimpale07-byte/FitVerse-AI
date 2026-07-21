import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaUsers, FaCoins, FaBolt, FaCheckCircle, FaUserCircle } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';

const mockLeaderboard = [
  { rank: 1, name: "Alex Johnson", score: "2,450 XP", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&fit=crop&q=60" },
  { rank: 2, name: "Jessica Smith", score: "2,200 XP", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&fit=crop&q=60" },
  { rank: 3, name: "Prathmesh (You)", score: "1,980 XP", avatar: "" },
  { rank: 4, name: "David Miller", score: "1,850 XP", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=80&fit=crop&q=60" },
  { rank: 5, name: "Emily Watson", score: "1,700 XP", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&fit=crop&q=60" }
];

const Challenges = () => {
  const [challenges, setChallenges] = useState([]);
  const [activeIds, setActiveIds] = useState(() => {
    // Mock active joined challenges in localStorage
    const saved = localStorage.getItem('fitverse_joined_challenges');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const res = await api.get('/challenges');
        if (res.success) {
          setChallenges(res.challenges);
        }
      } catch (err) {
        console.error("Error loading challenges:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchChallenges();
  }, []);

  const handleJoin = async (id) => {
    try {
      const res = await api.post(`/challenges/join/${id}`);
      if (res.success) {
        const updated = [...activeIds, id];
        setActiveIds(updated);
        localStorage.setItem('fitverse_joined_challenges', JSON.stringify(updated));

        // Update participants count in local state
        setChallenges(challenges.map(c => c._id === id ? { ...c, participantsCount: c.participantsCount + 1 } : c));

        toast.success("Successfully joined the challenge!");
      }
    } catch (err) {
      console.error(err);
      toast.error("Could not join challenge");
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
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-wide flex items-center gap-3">
          <FaTrophy className="text-yellow-500 animate-pulse" /> Workout Challenges
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Push your boundaries, compete with others, and earn bonus rewards</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Challenges Grid */}
        <div className="lg:col-span-8 space-y-6">
          {challenges.map((c) => {
            const isJoined = activeIds.includes(c._id);
            return (
              <div
                key={c._id}
                className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row justify-between gap-6"
              >
                <div className="space-y-4 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-3.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-full ${
                      isJoined 
                        ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20' 
                        : 'bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20'
                    }`}>
                      {isJoined ? 'Joined & Active' : 'Available'}
                    </span>
                    <span className="text-slate-400 dark:text-slate-500 text-xs font-bold flex items-center gap-1">
                      <FaUsers /> {c.participantsCount} participants
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-wide">{c.title}</h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium leading-relaxed">{c.description}</p>
                  </div>

                  {/* Target and Rewards */}
                  <div className="grid grid-cols-2 gap-4 pt-2 text-xs font-bold text-slate-700 dark:text-slate-300">
                    <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-slate-400 dark:text-slate-500 text-[9px] block uppercase font-bold mb-1">Target Goal</span>
                      <span>{c.target}</span>
                    </div>
                    <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                      <div>
                        <span className="text-slate-400 dark:text-slate-500 text-[9px] block uppercase font-bold mb-1">Rewards</span>
                        <div className="flex items-center gap-3 text-slate-900 dark:text-white">
                          <span className="flex items-center gap-1 text-primary-600"><FaBolt /> +{c.rewards.xp} XP</span>
                          <span className="flex items-center gap-1 text-yellow-600"><FaCoins /> +{c.rewards.coins}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-center sm:items-end shrink-0">
                  {isJoined ? (
                    <div className="flex items-center gap-2 text-green-500 font-extrabold text-sm uppercase">
                      <FaCheckCircle /> Joined
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(c._id)}
                      className="px-6 py-3.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-xs rounded-xl hover:opacity-90 transition-all shadow-md cursor-pointer"
                    >
                      Join Challenge
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Leaderboard Widget */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm space-y-6 self-start">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase flex items-center gap-2">
              🏆 Community Leaderboard
            </h3>
            <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold mt-1">Global weekly rankings by XP earned</p>
          </div>

          <div className="space-y-4">
            {mockLeaderboard.map((item, index) => (
              <div
                key={index}
                className={`p-3 rounded-2xl flex items-center justify-between transition-all ${
                  item.name.includes("You")
                    ? 'bg-primary-500/10 border border-primary-500/20 text-primary-850 dark:text-primary-400'
                    : 'bg-slate-50/50 dark:bg-slate-850/50 border border-slate-100 dark:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${
                    item.rank === 1 ? 'bg-yellow-500 text-white' :
                    item.rank === 2 ? 'bg-slate-300 text-slate-700' :
                    item.rank === 3 ? 'bg-orange-400 text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {item.rank}
                  </span>
                  
                  {item.avatar ? (
                    <img src={item.avatar} alt={item.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-650 flex items-center justify-center shrink-0">
                      <FaUserCircle size={24} />
                    </div>
                  )}

                  <span className="text-xs font-bold text-slate-800 dark:text-white truncate max-w-[110px]">
                    {item.name}
                  </span>
                </div>

                <span className="text-xs font-extrabold text-slate-900 dark:text-white">{item.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Challenges;
