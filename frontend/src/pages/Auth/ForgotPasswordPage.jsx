import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaEnvelope, FaDumbbell, FaArrowLeft, FaLock, FaEye, FaEyeSlash, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !oldPassword || !newPassword) return toast.error('Please fill all fields');
    
    const isValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword);
    if (!isValid) {
      return toast.error('Password must have 8+ chars, 1 uppercase, 1 number & 1 special char');
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://fitverse-ai-2.onrender.com/api';
      const response = await fetch(`${apiUrl}/auth/changepassword`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword, newPassword })
      });
      const data = await response.json();
      
      if (data.success) {
        setSuccess(true);
        toast.success('Password changed successfully!');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(data.message || 'Something went wrong');
      }
    } catch (err) {
      toast.error('Network error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent relative overflow-hidden font-sans p-4">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-secondary-100 rounded-full blur-[120px] opacity-60 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} 
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center gap-3 text-3xl font-black text-slate-900 tracking-tight">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/40">
              <FaDumbbell className="text-white text-2xl" />
            </div>
            FitVerse AI
          </Link>
        </div>

        <div className="glass-card p-8 sm:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Change Password</h2>
            <p className="text-slate-500 font-medium">Update your password to keep your account secure.</p>
          </div>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400"><FaEnvelope /></div>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="username"
                    className="input-glass pl-11" 
                    placeholder="you@example.com" 
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">Old Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400"><FaLock /></div>
                  <input 
                    type={showOldPassword ? 'text' : 'password'} 
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="input-glass pl-11 pr-12" 
                    placeholder="••••••••" 
                  />
                  <button type="button" onClick={() => setShowOldPassword(!showOldPassword)} className="absolute right-4 text-slate-400 hover:text-primary-600 transition-colors p-1">
                    {showOldPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400"><FaLock /></div>
                  <input 
                    type={showNewPassword ? 'text' : 'password'} 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    autoComplete="new-password"
                    className="input-glass pl-11 pr-12" 
                    placeholder="••••••••" 
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)} className="absolute right-4 text-slate-400 hover:text-primary-600 transition-colors p-1">
                    {showNewPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? <div className="w-6 h-6 border-2 border-slate-400 border-t-white rounded-full animate-spin" /> : 'Change Password'}
              </button>
            </form>
          ) : (
            <div className="text-center bg-green-50 border border-green-100 p-6 rounded-2xl">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle size={24} />
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-2">Password Changed!</h3>
              <p className="text-green-700 font-medium text-sm">You will be redirected to the login page shortly.</p>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 font-bold hover:text-primary-600 transition-colors">
              <FaArrowLeft /> Back to Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
