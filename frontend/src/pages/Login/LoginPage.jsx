import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaCheckCircle, FaDumbbell, FaEnvelope, FaLock } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const { login, setAuthSession } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      toast.success('Login Successful! Welcome back.');
      navigate('/dashboard');
    } catch (err) {
      const errMsg = err?.message || err?.error || 'Login failed: Invalid email or password';
      toast.error(errMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://fitverse-ai-2.onrender.com/api';
      const res = await fetch(`${apiUrl}/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: credentialResponse.credential }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthSession(data.user, data.token);
        toast.success(`Welcome back, ${data.user.name}! 🚀`);
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Google Login failed');
      }
    } catch (err) {
      toast.error('Network error during Google Login');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Login failed');
  };

  return (
    <div className="min-h-screen flex bg-transparent font-sans overflow-hidden">
      
      {/* LEFT SIDE: 45% - Illustration & Features */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-14 bg-slate-900/40 backdrop-blur-2xl border-r border-white/10 text-white overflow-hidden shadow-2xl z-20 rounded-r-[3rem]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=2070')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-slate-900/90 to-slate-900/95" />
        
        {/* Floating elements for aesthetics */}
        <div className="absolute top-10 right-10 w-32 h-32 bg-primary-500/20 rounded-full blur-[50px] animate-pulse" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-secondary-500/20 rounded-full blur-[60px]" />

        <div className="relative z-10 flex items-center gap-3">
          <Link to="/" className="inline-flex items-center gap-3 text-3xl font-black text-white hover:opacity-80 transition-opacity tracking-tight">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-600/40">
              <FaDumbbell className="text-white text-2xl" />
            </div>
            FitVerse AI
          </Link>
        </div>

        <div className="relative z-10 mt-auto mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl lg:text-6xl font-black mb-5 leading-tight tracking-tight">
              Unlock Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Potential.</span>
            </h1>
            <p className="text-slate-300 text-lg mb-10 max-w-md leading-relaxed font-medium">Continue your fitness journey with personalized AI workouts, smart diet plans, and deep progress tracking.</p>
          </motion.div>
          
          <div className="space-y-6">
            {[
              "AI Workout Generator",
              "Smart Diet Planner",
              "Advanced Progress Analytics",
              "Certified Elite Trainers"
            ].map((feature, idx) => (
              <motion.div key={idx} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + (0.1 * idx) }} className="flex items-center gap-4 group cursor-default">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-sm">
                  <FaCheckCircle size={18} />
                </div>
                <span className="text-slate-200 font-semibold text-lg tracking-wide group-hover:text-white transition-colors">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: 55% - Light Form */}
      <div className="w-full lg:w-[55%] p-6 sm:p-12 relative bg-transparent overflow-y-auto max-h-screen sidebar-scroll flex flex-col justify-start items-center">
        
        {/* Subtle background blobs for the right side */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }} 
          className="w-full max-w-md relative z-10 my-auto py-8"
        >
          <div className="glass-card p-8 sm:p-12">
            
            <div className="mb-10 text-center">
              {/* <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-inner">
                <span className="text-3xl"></span>
              </div> */}
              <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Welcome Back</h2>
              <p className="text-slate-500 font-medium">Please enter your details to sign in</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} method="POST" action="" className="space-y-5">
              
              {/* Email Field */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="email">Email Address</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400"><FaEnvelope /></div>
                  <input 
                    id="email"
                    name="email"
                    type="email" 
                    autoComplete="username"
                    {...register('email', { required: 'Email is required' })} 
                    className="input-glass pl-11" 
                    placeholder="you@example.com" 
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.email.message}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-1">
                <label className="text-sm font-bold text-slate-700 ml-1" htmlFor="password">Password</label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 text-slate-400"><FaLock /></div>
                  <input 
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"} 
                    autoComplete="current-password"
                    {...register('password', { required: 'Password is required' })} 
                    className="input-glass pl-11 pr-11 w-full bg-white/50 border border-slate-200 rounded-2xl py-4 focus:ring-2 focus:ring-primary-500/20" 
                    placeholder="••••••••" 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-primary-600 transition-colors p-1">
                    {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                  </button>
                </div>
                {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>}
              </div>

              {/* Options */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 text-slate-600 text-sm cursor-pointer hover:text-slate-900 transition-colors font-semibold group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" {...register('remember')} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-primary-600 checked:border-primary-600 transition-colors cursor-pointer" />
                    <FaCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} />
                  </div>
                  Remember me
                </label>
                <Link to="/forgot-password" className="text-primary-600 text-sm font-bold hover:text-primary-700 transition-colors">Forgot Password?</Link>
              </div>

              {/* Submit Button */}
              <button type="submit" disabled={loading} className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed">
                {loading ? <div className="w-6 h-6 border-2 border-slate-400 border-t-white rounded-full animate-spin" /> : 'Sign In'}
              </button>
            </form>

            <div className="mt-8 relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
              <div className="relative px-4 text-slate-400 text-xs font-bold uppercase tracking-wider bg-white">Or continue with</div>
            </div>

            {/* Google Button */}
            <div className="mt-8 flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                shape="pill"
                size="large"
                width="300"
              />
            </div>

          </div>

          <p className="text-center text-slate-500 mt-8 font-medium">
            Don't have an account? <Link to="/register" className="text-primary-600 font-bold hover:text-primary-700 transition-colors ml-1">Create Account</Link>
          </p>

        </motion.div>
      </div>

    </div>
  );
};

export default LoginPage;
