import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaEye, FaEyeSlash, FaDumbbell, FaArrowRight } from 'react-icons/fa';
import toast from 'react-hot-toast';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    // basic regex check
    const isValid = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    if (!isValid) {
      return toast.error('Password must have 8+ chars, 1 uppercase, 1 number & 1 special char');
    }

    setLoading(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://fitverse-ai-2.onrender.com/api';
      const response = await fetch(`${apiUrl}/auth/resetpassword/${token}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      
      if (data.success) {
        toast.success('Password reset successfully!');
        navigate('/login');
      } else {
        toast.error(data.message || 'Invalid or expired token');
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
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 text-3xl font-black text-slate-900 dark:text-white tracking-tight hover:opacity-90 transition-opacity">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-primary-600 to-violet-600 flex items-center justify-center shadow-lg shadow-primary-600/40">
              <FaDumbbell className="text-white text-2xl" />
            </div>
            <span>FitVerse <span className="text-primary-500">AI</span></span>
          </Link>
        </div>

        <div className="glass-card p-8 sm:p-12">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">New Password</h2>
            <p className="text-slate-500 font-medium">Create a strong new password for your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400"><FaLock /></div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-glass pl-11 pr-12" 
                  placeholder="••••••••" 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-primary-600 transition-colors p-1">
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-slate-400"><FaLock /></div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="input-glass pl-11 pr-12" 
                  placeholder="••••••••" 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
              {loading ? <div className="w-6 h-6 border-2 border-slate-400 border-t-white rounded-full animate-spin" /> : 'Reset Password'}
              {!loading && <FaArrowRight />}
            </button>
          </form>

        </div>
      </motion.div>
    </div>
  );
};

export default ResetPasswordPage;
