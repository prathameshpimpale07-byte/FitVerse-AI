import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { FaEye, FaEyeSlash, FaCheckCircle, FaDumbbell, FaArrowRight, FaArrowLeft, FaUser, FaEnvelope, FaPhoneAlt, FaLock } from 'react-icons/fa';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const InputWithIcon = ({ id, label, icon: Icon, type = "text", register, validation, errors }) => (
  <div className="space-y-1">
    <label className="text-sm font-bold text-slate-700 ml-1">{label}</label>
    <div className="relative flex items-center">
      {Icon && <div className="absolute left-4 text-slate-400"><Icon /></div>}
      <input 
        type={type} 
        id={id}
        {...register(id, validation)} 
        className={`input-glass ${Icon ? 'pl-11' : 'pl-5'}`} 
        placeholder={label} 
      />
    </div>
    {errors[id] && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors[id].message}</p>}
  </div>
);

const RegisterPage = () => {
  const { register: authRegister, login, setAuthSession } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  const { register, handleSubmit, formState: { errors }, watch, trigger, getValues } = useForm({
    defaultValues: {
      gender: 'Male',
      goal: 'General Fitness',
      activityLevel: 'Beginner',
      workoutLocation: 'Gym',
      workoutDays: '3'
    }
  });

  const pwd = watch('password') || '';
  const formData = watch();

  const getStrength = (p) => {
    let s = 0;
    if (p.length > 5) s += 1;
    if (p.length > 8) s += 1;
    if (/[A-Z]/.test(p)) s += 1;
    if (/[0-9]/.test(p)) s += 1;
    if (/[^A-Za-z0-9]/.test(p)) s += 1;
    return s;
  };
  const strength = getStrength(pwd);
  const strengthColor = strength <= 2 ? 'bg-red-500' : strength <= 3 ? 'bg-yellow-500' : 'bg-emerald-500';

  const nextStep = async () => {
    let valid = false;
    if (step === 1) {
      valid = await trigger(['name', 'email', 'phone', 'password', 'confirmPassword', 'terms']);
    } else if (step === 2) {
      valid = await trigger(['age', 'height', 'weight']);
    } else if (step === 3) {
      valid = true;
    }
    
    if (valid) setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await authRegister(data);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err?.message || 'Registration failed');
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
        toast.success(`Welcome to FitVerse, ${data.user.name}! 🚀`);
        navigate('/dashboard');
      } else {
        toast.error(data.message || 'Google Signup failed');
      }
    } catch (err) {
      toast.error('Network error during Google Signup');
    }
  };

  const handleGoogleError = () => {
    toast.error('Google Signup failed');
  };

  return (
    <div className="min-h-screen flex bg-transparent font-sans overflow-hidden">
      
      {/* LEFT SIDE: 45% - Illustration */}
      <div className="hidden lg:flex w-[45%] relative flex-col justify-between p-14 bg-slate-900/40 backdrop-blur-2xl border-r border-white/10 text-white overflow-hidden shadow-2xl z-20 rounded-r-[3rem]">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070')] bg-cover bg-center opacity-30 mix-blend-luminosity" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/90 via-slate-900/90 to-slate-900/95" />
        
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
              Start Your <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400">Journey.</span>
            </h1>
            <p className="text-slate-300 text-lg mb-10 max-w-md leading-relaxed font-medium">Join thousands of users transforming their bodies with intelligent, data-driven coaching.</p>
          </motion.div>
          
          <div className="space-y-6">
            {[
              "Personalized AI Coaching",
              "Advanced Progress Analytics",
              "Custom Meal Plans",
              "Access to Elite Trainers"
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

      {/* RIGHT SIDE: 55% - Form */}
      <div className="w-full lg:w-[55%] p-4 sm:p-8 lg:p-12 relative bg-transparent overflow-y-auto max-h-screen sidebar-scroll flex flex-col justify-start items-center">
        
        {/* Subtle background blobs */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-secondary-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="w-full max-w-xl relative z-10 my-auto py-8">
          
          <div className="glass-card p-8 sm:p-12">
            
            {/* Multi-step Header */}
            <div className="mb-10 text-center">
              <h2 className="text-xl font-bold text-slate-900 mb-1 tracking-tight">Create Account</h2>
              <p className="text-slate-500 text-sm font-medium">Step {step} of {totalSteps}: <span className="text-primary-600 font-bold">
                {step === 1 && 'Account Info'}
                {step === 2 && 'Personal Profile'}
                {step === 3 && 'Fitness Goals'}
                {step === 4 && 'Review Details'}
              </span></p>
            </div>

            {/* Stepper Progress */}
            <div className="flex gap-2 mb-10">
              {[1, 2, 3, 4].map(s => (
                <div key={s} className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden relative">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: step >= s ? '100%' : '0%' }} 
                    className="absolute top-0 left-0 h-full bg-slate-900 rounded-full" 
                    transition={{ duration: 0.5, ease: "easeInOut" }} 
                  />
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: ACCOUNT INFORMATION */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    
                    <InputWithIcon id="name" label="Full Name" icon={FaUser} validation={{ required: 'Name is required' }} register={register} errors={errors} />
                    <InputWithIcon id="email" label="Email Address" type="email" icon={FaEnvelope} validation={{ required: 'Email is required', pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' } }} register={register} errors={errors} />
                    <InputWithIcon id="phone" label="Phone Number" type="tel" icon={FaPhoneAlt} validation={{ required: 'Phone is required' }} register={register} errors={errors} />
                    
                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 text-slate-400"><FaLock /></div>
                        <input type={showPassword ? 'text' : 'password'} id="password" {...register('password', { required: 'Password is required', pattern: { value: /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, message: 'Must have 8+ chars, 1 uppercase, 1 number & 1 special char' } })} className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all font-medium" placeholder="Create a password" />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 text-slate-400 hover:text-primary-600 transition-colors p-1">{showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}</button>
                      </div>
                      
                      {/* Password Strength */}
                      {pwd && (
                        <div className="mt-3 flex gap-1 h-1.5 px-1">
                          <div className={`flex-1 rounded-full transition-colors ${strength >= 1 ? strengthColor : 'bg-slate-100'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${strength >= 3 ? strengthColor : 'bg-slate-100'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${strength >= 4 ? strengthColor : 'bg-slate-100'}`} />
                          <div className={`flex-1 rounded-full transition-colors ${strength >= 5 ? strengthColor : 'bg-slate-100'}`} />
                        </div>
                      )}
                      {errors.password && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.password.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <label className="text-sm font-bold text-slate-700 ml-1">Confirm Password</label>
                      <div className="relative flex items-center">
                        <div className="absolute left-4 text-slate-400"><FaLock /></div>
                        <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword" {...register('confirmPassword', { validate: value => value === pwd || 'Passwords do not match' })} className="w-full bg-slate-50 border border-slate-200 text-slate-900 pl-11 pr-12 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all font-medium" placeholder="Confirm your password" />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 text-slate-400 hover:text-primary-600 transition-colors p-1">{showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}</button>
                      </div>
                      {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{errors.confirmPassword.message}</p>}
                    </div>

                    <label className="flex items-start gap-3 text-slate-600 text-sm cursor-pointer mt-4 font-medium group">
                      <div className="relative flex items-center justify-center shrink-0 mt-0.5">
                        <input type="checkbox" {...register('terms', { required: 'You must agree to T&C' })} className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-md checked:bg-primary-600 checked:border-primary-600 transition-colors cursor-pointer" />
                        <FaCheckCircle className="absolute text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" size={12} />
                      </div>
                      <span className="leading-relaxed">I agree to the <span className="text-primary-600 font-bold hover:underline">Terms & Conditions</span> and Privacy Policy</span>
                    </label>
                    {errors.terms && <p className="text-red-500 text-xs ml-1 font-medium">{errors.terms.message}</p>}
                  </motion.div>
                )}

                {/* STEP 2: PERSONAL INFORMATION */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    <div className="grid grid-cols-2 gap-5">
                      <InputWithIcon id="age" label="Age" type="number" validation={{ required: 'Age required', min: 14 }} />
                      
                      <div className="space-y-1">
                        <label className="text-sm font-bold text-slate-700 ml-1">Gender</label>
                        <select id="gender" {...register('gender')} className="w-full bg-slate-50 border border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 focus:bg-white transition-all appearance-none font-medium">
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-5">
                      <InputWithIcon id="height" label="Height (cm)" type="number" validation={{ required: 'Required', min: 50 }} />
                      <InputWithIcon id="weight" label="Weight (kg)" type="number" step="0.1" validation={{ required: 'Required', min: 20 }} />
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: FITNESS GOALS */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                    
                    <div>
                      <p className="text-slate-800 font-black mb-4 tracking-tight">Primary Goal</p>
                      <div className="grid grid-cols-2 gap-3">
                        {['Weight Loss', 'Muscle Gain', 'Endurance', 'General Fitness'].map(g => (
                          <label key={g} className={`border-2 rounded-2xl p-4 text-center cursor-pointer font-bold transition-all ${formData.goal === g ? 'bg-primary-50 border-primary-600 text-primary-700 shadow-sm' : 'bg-slate-50 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'}`}>
                            <input type="radio" value={g} {...register('goal')} className="hidden" />
                            {g}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-slate-800 font-black mb-4 tracking-tight">Activity Level</p>
                      <div className="flex bg-slate-50 border-2 border-slate-200 rounded-2xl p-1.5">
                        {['Beginner', 'Intermediate', 'Advanced'].map(lvl => (
                          <label key={lvl} className={`flex-1 text-center py-2.5 rounded-xl cursor-pointer font-bold transition-all ${formData.activityLevel === lvl ? 'bg-white shadow-md text-slate-900' : 'text-slate-500 hover:text-slate-900'}`}>
                            <input type="radio" value={lvl} {...register('activityLevel')} className="hidden" />
                            {lvl}
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <p className="text-slate-800 font-black mb-3 tracking-tight">Location</p>
                        <select {...register('workoutLocation')} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:border-primary-500 focus:bg-white outline-none font-medium transition-colors">
                          <option value="Gym">Gym</option>
                          <option value="Home">Home</option>
                          <option value="Both">Both</option>
                        </select>
                      </div>
                      <div>
                        <p className="text-slate-800 font-black mb-3 tracking-tight">Days/Week</p>
                        <select {...register('workoutDays')} className="w-full bg-slate-50 border-2 border-slate-200 text-slate-900 px-5 py-4 rounded-2xl focus:border-primary-500 focus:bg-white outline-none font-medium transition-colors">
                          {[3,4,5,6,7].map(d => <option key={d} value={d}>{d} Days</option>)}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: REVIEW */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                    
                    <div className="bg-slate-50 border-2 border-slate-100 rounded-3xl p-6 space-y-4">
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4">
                        <div>
                          <span className="text-slate-500 block mb-1 text-sm font-semibold">Name</span>
                          <span className="font-bold text-slate-900 text-lg">{formData.name}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-1 text-sm font-semibold">Email</span>
                          <span className="font-bold text-slate-900 truncate block">{formData.email}</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 border-b border-slate-200 pb-4">
                        <div>
                          <span className="text-slate-500 block mb-1 text-sm font-semibold">Profile</span>
                          <span className="font-bold text-slate-900 block">{formData.age} yrs • {formData.gender}</span>
                          <span className="font-bold text-slate-900 block">{formData.height} cm • {formData.weight} kg</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-1 text-sm font-semibold">Goal</span>
                          <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
                            {formData.goal}
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-slate-500 block mb-1 text-sm font-semibold">Experience</span>
                          <span className="font-bold text-slate-900">{formData.activityLevel}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block mb-1 text-sm font-semibold">Routine</span>
                          <span className="font-bold text-slate-900">{formData.workoutDays} Days/wk at {formData.workoutLocation}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="w-16 py-4 rounded-2xl font-bold text-lg border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center justify-center shadow-sm">
                    <FaArrowLeft />
                  </button>
                )}
                
                {step < totalSteps ? (
                  <button type="button" onClick={nextStep} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    Continue <FaArrowRight />
                  </button>
                ) : (
                  <button type="submit" disabled={loading} className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-2xl font-bold text-lg transition-all shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-2">
                    {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'Create Account'}
                  </button>
                )}
              </div>
            </form>

            {step === 1 && (
              <>
                <div className="mt-8 relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200" /></div>
                  <div className="relative px-4 text-slate-400 text-xs font-bold uppercase tracking-wider bg-white">Or continue with</div>
                </div>

                <div className="mt-8 flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    useOneTap
                    shape="pill"
                    size="large"
                    width="300"
                    text="signup_with"
                  />
                </div>
              </>
            )}

          </div>

          <p className="text-center text-slate-500 mt-8 font-medium">
            Already have an account? <Link to="/login" className="text-primary-600 font-bold hover:text-primary-700 transition-colors ml-1">Sign In</Link>
          </p>

        </motion.div>
      </div>

    </div>
  );
};

export default RegisterPage;
