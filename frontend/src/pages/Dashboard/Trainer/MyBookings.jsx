import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaVideo, FaMapMarkerAlt, FaCheckCircle, FaClock, FaSearch, FaTrash } from 'react-icons/fa';
import api from '../../../services/api';
import toast from 'react-hot-toast';
import dayjs from 'dayjs';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/trainers/bookings/my');
        if (res?.success) setBookings(res.bookings || []);
      } catch (err) {
        toast.error('Failed to load bookings');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCancel = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const res = await api.delete(`/trainers/bookings/${id}`);
      if (res.success) {
        toast.success("Booking deleted successfully!");
        setBookings(prev => prev.filter(b => b._id !== id));
      } else {
        toast.error(res.message || "Failed to delete booking.");
      }
    } catch (err) {
      toast.error("Error deleting booking.");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20';
      case 'completed': return 'bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border-sky-200 dark:border-sky-500/20';
      case 'cancelled': return 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20';
      default: return 'bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border-amber-200 dark:border-amber-500/20';
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-16 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">My Bookings</h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Manage your upcoming and past training sessions.</p>
        </div>
        <Link to="/dashboard/trainers/browse" className="px-5 py-2.5 bg-violet-100 dark:bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-bold rounded-xl hover:bg-violet-200 dark:hover:bg-violet-500/20 transition-colors">
          Book New Session
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-slate-200 border-t-violet-600 rounded-full animate-spin" /></div>
      ) : bookings.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-center">
          <FaCalendarAlt className="text-slate-300 dark:text-slate-700 text-4xl mx-auto mb-4" />
          <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">No Bookings Yet</h3>
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-6">You haven't booked any training sessions.</p>
          <Link to="/dashboard/trainers/browse" className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white text-sm font-black rounded-xl shadow-lg transition-all">
            Find a Trainer
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {bookings.map((booking, i) => (
            <motion.div 
              key={booking._id} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col md:flex-row gap-6 md:items-center"
            >
              <div className="flex items-center gap-4 flex-1">
                <img src={booking.trainer?.avatar || 'https://via.placeholder.com/80'} alt="Trainer" className="w-16 h-16 rounded-2xl object-cover bg-slate-100 dark:bg-slate-800" />
                <div>
                  <h3 className="text-lg font-black text-slate-900 dark:text-white">{booking.trainer?.name || 'Unknown Trainer'}</h3>
                  <p className="text-[11px] font-black text-violet-600 dark:text-violet-400 uppercase tracking-widest mb-1.5">
                    {booking.trainer?.specialization?.[0] || 'Fitness Coach'}
                  </p>
                  <div className="flex items-center gap-4 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1.5"><FaCalendarAlt /> {dayjs(booking.date).format('MMM D, YYYY')}</span>
                    <span className="flex items-center gap-1.5"><FaClock /> {booking.slot}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap md:flex-nowrap items-center gap-4 md:border-l border-slate-100 dark:border-slate-800 md:pl-6">
                <div className="space-y-2 flex-1 md:flex-none">
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[10px] font-black uppercase tracking-wider ${getStatusColor(booking.status)}`}>
                    <FaCheckCircle size={10} /> {booking.status}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 px-2.5 py-1 rounded-md">
                    {booking.sessionType === 'online' ? <FaVideo className="text-sky-500" /> : <FaMapMarkerAlt className="text-rose-500" />}
                    {booking.sessionType === 'online' ? 'Online Video' : 'Offline Gym'}
                  </div>
                </div>

                <div className="w-full md:w-auto text-right md:text-left flex flex-row md:flex-col justify-between items-center md:items-end md:justify-center">
                  <div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-bold uppercase mb-0.5">Amount</p>
                    <p className="text-base font-black text-slate-900 dark:text-white">₹{booking.amount}</p>
                  </div>
                  <button onClick={() => handleCancel(booking._id)} className="mt-0 md:mt-3 px-3 py-1.5 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-bold rounded-lg transition-colors flex items-center gap-1.5 border border-rose-200 dark:border-rose-500/20">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
