import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaMapMarkerAlt, FaCheckCircle, FaGraduationCap, FaDumbbell, FaArrowLeft, FaTimes } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const TrainerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trainer, setTrainer] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Booking Form State
  const [showBooking, setShowBooking] = useState(false);
  const [date, setDate] = useState('');
  const [slot, setSlot] = useState('');
  const [sessionType, setSessionType] = useState('online');
  const [notes, setNotes] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get(`/trainers/${id}`);
        if (res?.success) setTrainer(res.trainer);
        else navigate('/dashboard/trainers');
      } catch (err) {
        toast.error('Failed to load trainer profile');
        navigate('/dashboard/trainers');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, navigate]);

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!date || !slot) return toast.error('Please select date and time slot.');
    
    setBookingLoading(true);
    try {
      const res = await api.post('/trainers/bookings', {
        trainer: trainer._id,
        date, slot, sessionType, notes
      });
      if (res.success) {
        toast.success('Session booked successfully! 🎉');
        setShowBooking(false);
        setDate(''); setSlot(''); setNotes('');
        navigate('/dashboard/trainers/bookings'); // redirect to bookings
      } else {
        toast.error(res.message || 'Failed to book session');
      }
    } catch (err) {
      toast.error('Something went wrong during booking.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-32"><div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" /></div>;
  }
  if (!trainer) return null;

  // Standard daily time slots (06:00 AM to 09:00 PM)
  const defaultSlots = [
    "06:00", "07:00", "08:00", "09:00", "10:00", "11:00", 
    "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", 
    "18:00", "19:00", "20:00", "21:00"
  ];

  const formatSlotLabel = (s) => {
    if (!s) return '';
    const parts = s.split(':');
    const h = parseInt(parts[0], 10);
    if (isNaN(h)) return s;
    const m = parts[1] || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 === 0 ? 12 : h % 12;
    const pad12 = h12 < 10 ? `0${h12}` : h12;
    return `${s} (${pad12}:${m} ${ampm})`;
  };

  const selectedDay = date ? dayjs(date).format('ddd') : '';
  const availableDay = trainer.availability?.find(a => a.day === selectedDay);
  const slotsToSelect = availableDay?.slots?.length ? availableDay.slots : defaultSlots;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-6 transition-colors">
        <FaArrowLeft /> Back to Browse
      </button>

      {/* ── Profile Header ── */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm mb-8">
        <div className="h-48 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
          {trainer.avatar && <img src={trainer.avatar} alt="cover" className="w-full h-full object-cover opacity-30 mix-blend-overlay" />}
        </div>
        <div className="px-6 sm:px-10 pb-10 relative">
          <div className="flex flex-col sm:flex-row gap-6 sm:items-end -mt-16 sm:-mt-20 mb-6">
            <img src={trainer.avatar || 'https://via.placeholder.com/150'} alt={trainer.name} className="w-32 h-32 sm:w-40 sm:h-40 rounded-3xl border-4 border-white dark:border-slate-900 object-cover bg-white shadow-lg" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">{trainer.name}</h1>
                <FaCheckCircle className="text-sky-500 text-lg" title="Verified Professional" />
              </div>
              <p className="text-violet-600 dark:text-violet-400 text-sm font-black uppercase tracking-widest mb-3">
                {trainer.specialization?.join(' • ')}
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-slate-600 dark:text-slate-400">
                <span className="flex items-center gap-1.5"><FaStar className="text-orange-400" /> {trainer.rating} ({trainer.totalReviews} Reviews)</span>
                <span className="flex items-center gap-1.5"><FaMapMarkerAlt /> Available Online & Offline</span>
              </div>
            </div>
            <button onClick={() => setShowBooking(true)} className="px-8 py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black rounded-2xl shadow-lg shadow-violet-500/20 transition-all shrink-0">
              Book Session (₹{trainer.pricePerSession})
            </button>
          </div>

          {/* About Section */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-2 space-y-8">
              <div>
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3">About the Trainer</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-medium">{trainer.bio || "No bio provided."}</p>
              </div>

              {trainer.certifications?.length > 0 && (
                <div>
                  <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2"><FaGraduationCap /> Certifications</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.certifications.map((cert, i) => (
                      <span key={i} className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700">
                        {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 self-start space-y-4">
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider mb-2">Quick Stats</h3>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Experience</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">{trainer.experience} Years</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Session Rate</span>
                <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">₹{trainer.pricePerSession}</span>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700" />
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Response Time</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">~ 2 Hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Booking Modal ── */}
      <AnimatePresence>
        {showBooking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-8 overflow-hidden">
              
              <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">Book a Session</h2>
                <button onClick={() => setShowBooking(false)} className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white bg-slate-200 dark:bg-slate-800 rounded-full transition-colors"><FaTimes size={12} /></button>
              </div>

              <div className="p-6">
                <form onSubmit={handleBookSession} className="space-y-6">
                  {/* Session Type */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Session Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button type="button" onClick={() => setSessionType('online')} className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${sessionType === 'online' ? 'bg-violet-50 dark:bg-violet-500/10 border-violet-500 text-violet-700 dark:text-violet-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}>Online Video</button>
                      <button type="button" onClick={() => setSessionType('offline')} className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${sessionType === 'offline' ? 'bg-violet-50 dark:bg-violet-500/10 border-violet-500 text-violet-700 dark:text-violet-400' : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'}`}>Offline (Gym)</button>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Date</label>
                      <input type="date" required min={new Date().toISOString().split('T')[0]} value={date} onChange={e => { setDate(e.target.value); setSlot(''); }} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-violet-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Time Slot</label>
                      <select required disabled={!date} value={slot} onChange={e => setSlot(e.target.value)} className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-violet-500 focus:outline-none disabled:opacity-50">
                        <option value="">{date ? 'Select a time slot' : 'Select date first'}</option>
                        {slotsToSelect.map(s => <option key={s} value={s}>{formatSlotLabel(s)}</option>)}
                      </select>
                      {date && !slotsToSelect.length && <p className="text-[10px] text-rose-500 mt-1 font-bold">Trainer is not available on {selectedDay}</p>}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">Goal / Notes (Optional)</label>
                    <textarea rows="3" value={notes} onChange={e => setNotes(e.target.value)} placeholder="What do you want to focus on in this session?" className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:ring-1 focus:ring-violet-500 focus:outline-none resize-none" />
                  </div>

                  <button type="submit" disabled={bookingLoading || !date || !slot} className="w-full py-3.5 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black rounded-xl shadow-lg shadow-violet-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider">
                    {bookingLoading ? 'Confirming...' : `Confirm Booking • ₹${trainer.pricePerSession}`}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TrainerProfile;
