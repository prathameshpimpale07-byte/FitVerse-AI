import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaArrowRight, FaRobot, FaDumbbell, FaChartLine, FaCheckCircle, 
  FaAppleAlt, FaPlay, FaFire, FaStar, FaChartPie, FaChevronDown, FaEnvelope 
} from 'react-icons/fa';

const HomePage = () => {
  const [activeFaq, setActiveFaq] = useState(null);
  const [contactForm, setContactForm] = useState({ firstName: '', lastName: '', email: '', message: '' });
  const [contactStatus, setContactStatus] = useState(null);

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactStatus('sending');
    try {
      const apiUrl = import.meta.env.VITE_API_URL || 'https://fitverse-ai-2.onrender.com/api';
      const response = await fetch(`${apiUrl}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      const data = await response.json();
      if (data.success) {
        setContactStatus('success');
        setContactForm({ firstName: '', lastName: '', email: '', message: '' });
        setTimeout(() => setContactStatus(null), 5000); 
      } else {
        setContactStatus('error');
      }
    } catch (err) {
      setContactStatus('error');
    }
  };

  const fadeIn = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8 }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const faqs = [
    { 
      category: "AI Technology",
      q: "How does FitVerse AI personalize my workout plans?", 
      a: "FitVerse AI analyzes your personal fitness goals, experience level, body metrics, available equipment, and fatigue recovery rates. It calculates optimal volume, reps, sets, and progressive overload to build a hyper-customized workout plan that evolves as you get stronger." 
    },
    { 
      category: "Workouts",
      q: "Do I need gym equipment to use FitVerse AI?", 
      a: "Not at all! FitVerse AI adapts completely to your environment. Whether you are training at home with zero equipment, using simple dumbbells, or working out in a full commercial gym, your program is custom-tailored to what you have available." 
    },
    { 
      category: "Nutrition",
      q: "How accurate is the AI Diet & Macro Planner?", 
      a: "Extremely precise. Our AI calculates your Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE) based on your real-time body weight and activity targets. It creates meal plans with exact protein, carb, and fat distributions tailored to your dietary preferences." 
    },
    { 
      category: "Progress",
      q: "How does progress and analytics tracking work?", 
      a: "FitVerse AI records your workout logs, weight changes, macro compliance, and personal records (PRs). Visual graphs and weekly AI insights show you exactly where you've improved and recommend optimal adjustments." 
    },
    { 
      category: "Trainers",
      q: "Can I also work with human certified personal trainers?", 
      a: "Yes! FitVerse AI offers a hybrid model. In addition to AI coaching, you can browse verified, certified personal trainers on our platform to book 1-on-1 sessions, form reviews, and live video training." 
    },
    { 
      category: "Account & Plans",
      q: "Can I switch or cancel my subscription anytime?", 
      a: "Absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account settings with no hidden fees or long-term lock-ins." 
    },
  ];

  return (
    <div className="min-h-screen overflow-hidden font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 selection:bg-primary-500/30 transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <section id="hero" className="relative flex min-h-screen pt-32 lg:pt-36 pb-16 lg:pb-24 px-4 overflow-hidden items-center justify-center bg-transparent">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-primary-400/30 dark:bg-primary-900/40 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            className="absolute top-40 -right-20 w-[500px] h-[500px] bg-secondary-400/30 dark:bg-secondary-900/40 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen"
          />
        </div>
        
        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center relative z-10">
          
          {/* Left Content */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mt-10 lg:mt-0"
          >

            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black text-slate-900 dark:text-white leading-[1.05] mb-6 sm:mb-8 tracking-tight break-words">
              Transform <br className="hidden sm:inline" /> Your Body, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500">Elevate Your Mind.</span>
            </h1>
            
            <p className="text-lg sm:text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-8 sm:mb-10 max-w-lg leading-relaxed font-medium">
              The world's smartest AI fitness ecosystem. Generate hyper-personalized workouts, track precise macros, and achieve results faster than ever before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 w-full sm:w-auto">
              <Link to="/login" className="group relative w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-base sm:text-lg overflow-hidden flex items-center justify-center gap-3 hover:scale-105 transition-transform duration-300 shadow-xl shadow-slate-900/20 dark:shadow-white/20">
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 dark:via-black/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                Start Free Trial <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#about" className="w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-full font-bold text-base sm:text-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm flex items-center justify-center gap-3">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center">
                  <FaPlay className="text-primary-600 dark:text-primary-400 text-xs ml-0.5" />
                </div>
                Watch Demo
              </a>
            </div>
            
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.8 }}
              className="mt-8 sm:mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6"
            >
              <div className="flex -space-x-3 sm:-space-x-4">
                {[1, 2, 3, 4].map((num) => (
                  <img key={num} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-slate-50 dark:border-slate-950 object-cover shadow-sm" src={`https://randomuser.me/api/portraits/men/${num}.jpg`} alt="User" />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1 text-yellow-400 text-sm mb-1">
                  {[1,2,3,4,5].map(i => <FaStar key={i} />)}
                  <span className="text-slate-900 dark:text-white font-bold ml-2">5.0</span>
                </div>
                <div className="text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400">Trusted by 20,000+ athletes</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="relative h-[500px] lg:h-[650px] hidden lg:block perspective-1000"
          >
            {/* Background decorative shape */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary-500/20 to-secondary-500/20 rounded-full blur-[80px] -z-10 animate-pulse-slow" />
            
            {/* Main Image Container */}
            <motion.div 
              animate={{ y: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 rounded-[3rem] border-[8px] border-white dark:border-slate-900 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800"
            >
              <img src="https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=800&auto=format&fit=crop" alt="Fitness Training" className="w-full h-full object-cover scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent" />
            </motion.div>
            
            {/* Floating Widget 1 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: -50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute top-20 -left-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white/60 dark:border-white/10 flex items-center gap-5 z-20"
            >
              <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-rose-500 text-white rounded-2xl flex items-center justify-center text-2xl shadow-inner"><FaFire /></div>
              <div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase mb-1">Calories Burned</p>
                <p className="text-2xl font-black text-slate-900 dark:text-white">1,245 <span className="text-sm font-bold text-slate-500 dark:text-slate-400">kcal</span></p>
              </div>
            </motion.div>
            
            {/* Floating Widget 2 */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 50 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="absolute bottom-24 -right-12 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl p-6 rounded-3xl shadow-2xl border border-white/60 dark:border-white/10 z-20"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md"><FaChartLine /></div>
                <div>
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-wide uppercase">AI Performance Score</p>
                  <p className="text-lg font-black text-emerald-500 dark:text-emerald-400">+14% vs Last Week</p>
                </div>
              </div>
              <div className="flex items-end gap-2 h-12 mt-2">
                {[40, 60, 45, 80, 65, 90, 100].map((h, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ height: 0 }} 
                    animate={{ height: `${h}%` }} 
                    transition={{ duration: 1.5, delay: 1.2 + (i * 0.1), type: "spring" }} 
                    className="w-3 bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-full" 
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 2. STATS & TRUSTED BY (Upgraded Container Design) */}
      <section className="py-16 relative z-20 -mt-10 mb-10">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-[3rem] p-8 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] relative overflow-hidden"
          >
            {/* Ambient inner glow */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[80px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-10 w-full">
                {[
                  { label: "Active Users", value: "20k+", icon: "👥" },
                  { label: "Workouts Gen", value: "1.5M", icon: "⚡" },
                  { label: "Expert Trainers", value: "150+", icon: "🏆" },
                  { label: "Store Rating", value: "4.9/5", icon: "⭐" }
                ].map((stat, i) => (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1, type: "spring" }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="text-xl mb-3 bg-slate-100 dark:bg-slate-800 w-12 h-12 rounded-2xl flex items-center justify-center group-hover:-translate-y-1 transition-transform border border-slate-200 dark:border-white/5">
                      {stat.icon}
                    </div>
                    <span className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-1 tracking-tight">{stat.value}</span>
                    <span className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="py-32 px-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-7xl h-full flex justify-center pointer-events-none">
          <div className="w-[600px] h-[600px] bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen" />
          <div className="w-[500px] h-[500px] bg-secondary-500/10 dark:bg-secondary-500/5 rounded-full blur-[120px] -ml-40 mt-40 mix-blend-multiply dark:mix-blend-screen" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div {...fadeIn}>
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-primary-600 dark:text-primary-400 font-black text-[10px] tracking-widest uppercase mb-6 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" /> About FitVerse AI
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.2]">
                Your Ultimate AI-Powered <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-secondary-500 pr-2">Fitness Ecosystem</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                FitVerse AI is a next-generation platform designed to revolutionize your health journey. By combining advanced machine learning with expert fitness and nutrition science, we provide an all-in-one ecosystem that dynamically adapts to your unique body, goals, and daily performance.
              </p>
            </motion.div>
          </div>

          {/* New Fluid Layout instead of Bento Grid */}
          <div className="flex flex-col lg:flex-row items-center gap-16 mt-20">
            {/* Image/Visual Side */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-[8px] border-white dark:border-slate-800">
                <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=1200&auto=format&fit=crop" alt="FitVerse AI Training" className="w-full h-full object-cover aspect-[4/5]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Floating stats card */}
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-3xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary-500 flex items-center justify-center">
                      <FaChartLine className="text-white text-xl" />
                    </div>
                    <div>
                      <div className="text-white/80 text-sm font-medium uppercase tracking-wider">Average Results</div>
                      <div className="text-white font-black text-2xl">+32% Muscle Growth</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements behind image */}
              <div className="absolute -z-10 -top-10 -left-10 w-full h-full border-2 border-primary-500/20 rounded-[2.5rem]" />
              <div className="absolute -z-10 top-1/2 -right-20 w-64 h-64 bg-secondary-500/20 blur-[80px] rounded-full" />
            </motion.div>

            {/* Text/Content Side */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="w-full lg:w-1/2 flex flex-col gap-10"
            >
              {/* Feature 1 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FaDumbbell className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Hyper-Personalized Workouts</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Our AI analyzes your biomechanics, past performance, and current recovery state to craft the perfect routine for you today.
                  </p>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FaAppleAlt className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Dynamic Nutrition Plans</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Diet isn't static. We adjust your macros and meal recommendations automatically based on your daily energy expenditure.
                  </p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex gap-6 items-start group">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-400 flex items-center justify-center shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <FaCheckCircle className="text-2xl text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-3">Seamless Integrations</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                    Sync your favorite wearables. We pull data from Apple Health, Garmin, and Fitbit to ensure our AI has the complete picture.
                  </p>
                </div>
              </div>

              <div className="pt-6">
                <Link to="/login" className="px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full font-bold text-lg hover:shadow-xl hover:shadow-slate-900/20 dark:hover:shadow-white/20 transition-all flex items-center gap-3 w-fit">
                  Experience FitVerse <FaArrowRight />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 3. INTELLIGENT WORKOUTS */}
      <section id="workouts" className="py-32 px-4 relative bg-white dark:bg-slate-950 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-slate-50 dark:from-slate-900 to-transparent" />
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div {...fadeIn}>
              <div className="text-secondary-600 dark:text-secondary-400 font-bold tracking-wider uppercase mb-4 text-sm flex items-center justify-center gap-4">
                <span className="w-12 h-[2px] bg-secondary-600 dark:bg-secondary-400"></span> Dynamic Generation
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                Workouts That Evolve <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-secondary-500 to-primary-600">With You</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                Say goodbye to static 12-week templates. FitVerse AI generates your daily workout on the fly, balancing your muscle recovery, time constraints, and available equipment.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Interactive Visual/Cards */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-secondary-500/20 to-primary-500/20 blur-[100px] rounded-full" />
              
              <div className="relative bg-slate-900 dark:bg-black border border-slate-800 rounded-[2.5rem] p-8 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
                  <div>
                    <div className="text-slate-400 font-bold text-sm uppercase tracking-wider mb-1">Today's Focus</div>
                    <div className="text-white font-black text-2xl">Upper Body Power</div>
                  </div>
                  <div className="bg-white/10 px-4 py-2 rounded-full text-white font-bold text-sm backdrop-blur-md border border-white/10">
                    45 Mins
                  </div>
                </div>

                <div className="space-y-4">
                  {/* Exercise 1 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-secondary-500/20 text-secondary-400 rounded-xl flex items-center justify-center">
                        <FaDumbbell className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Barbell Bench Press</h4>
                        <div className="text-slate-400 text-sm">4 Sets • 5-8 Reps</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-secondary-400 font-bold text-sm">Target</div>
                      <div className="text-white font-black">85 kg</div>
                    </div>
                  </div>
                  
                  {/* Exercise 2 */}
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:bg-white/10 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-primary-500/20 text-primary-400 rounded-xl flex items-center justify-center">
                        <FaDumbbell className="text-xl" />
                      </div>
                      <div>
                        <h4 className="text-white font-bold">Weighted Pull-ups</h4>
                        <div className="text-slate-400 text-sm">3 Sets • 8-10 Reps</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-primary-400 font-bold text-sm">Target</div>
                      <div className="text-white font-black">+ 15 kg</div>
                    </div>
                  </div>

                  {/* Optimization Alert */}
                  <div className="mt-6 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 rounded-2xl p-4 flex items-start gap-3">
                    <FaCheckCircle className="text-emerald-400 text-xl shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-white font-bold text-sm">AI Optimization Applied</h4>
                      <p className="text-slate-400 text-xs mt-1">Volume reduced by 10% on chest exercises due to incomplete recovery detected from your last session.</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Feature List */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-10"
            >
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 group-hover:bg-secondary-500 group-hover:text-white transition-colors duration-300">
                  <FaFire className="text-2xl text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Auto-Progressive Overload</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">The AI automatically calculates exactly how much weight or how many reps you need to do today to force muscle growth, safely.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 group-hover:bg-primary-500 group-hover:text-white transition-colors duration-300">
                  <FaChartPie className="text-2xl text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Fatigue-Aware Programming</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Didn't sleep well? Sore from yesterday? The system detects fatigue markers and instantly swaps exercises or alters volume to prevent injury.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300">
                  <FaDumbbell className="text-2xl text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Equipment Flexibility</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Traveling or at a crowded gym? Just tell the AI what equipment you have, and it will rebuild your routine in seconds without losing the stimulus.</p>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/login" className="px-8 py-4 bg-primary-600 text-white rounded-full font-bold text-lg hover:bg-primary-500 transition-colors shadow-lg shadow-primary-500/30 flex items-center gap-3 w-fit">
                  Start Your AI Workout <FaArrowRight />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* NEW DIET SECTION */}
      <section id="diet" className="py-32 px-4 relative bg-slate-50 dark:bg-slate-950 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.div {...fadeIn}>
              <div className="text-emerald-600 dark:text-emerald-400 font-bold tracking-wider uppercase mb-4 text-sm flex items-center justify-center gap-4">
                <span className="w-12 h-[2px] bg-emerald-600 dark:bg-emerald-400"></span> Precision Nutrition
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6">
                Fuel Your <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">Transformation</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">
                Nutrition is 80% of the battle. Our AI acts as your personal dietitian, adapting your meals and macros based on your daily activity and progress.
              </p>
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Feature List (Left Side) */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col gap-10 order-2 lg:order-1"
            >
              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <FaChartPie className="text-2xl text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Dynamic Macro Targets</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Your calorie needs change daily. If you burned 600 extra calories on a hike, the AI instantly updates your dinner targets to keep you in the perfect zone.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 group-hover:bg-teal-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <FaAppleAlt className="text-2xl text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Smart Recipe Alternatives</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Don't like broccoli or allergic to nuts? Swipe to swap any ingredient or meal with an AI-approved alternative that perfectly matches the original macros.</p>
                </div>
              </div>

              <div className="flex gap-6 items-start group">
                <div className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-800 group-hover:bg-cyan-500 group-hover:text-white transition-colors duration-300 shadow-sm">
                  <FaCheckCircle className="text-2xl text-slate-400 group-hover:text-white transition-colors" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Automated Grocery Lists</h3>
                  <p className="text-slate-600 dark:text-slate-400 font-medium">Once your weekly meals are set, the app automatically generates a categorized grocery list. Shopping for health has never been easier.</p>
                </div>
              </div>

              <div className="pt-4">
                <Link to="/login" className="px-8 py-4 bg-emerald-500 text-white rounded-full font-bold text-lg hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/30 flex items-center gap-3 w-fit">
                  Get Your Diet Plan <FaArrowRight />
                </Link>
              </div>
            </motion.div>

            {/* Interactive Visual/Cards (Right Side) */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative order-1 lg:order-2"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-teal-500/20 blur-[100px] rounded-full -z-10" />
              
              <div className="relative rounded-[3rem] border-[8px] border-white dark:border-slate-900 shadow-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 h-[500px]">
                <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?q=80&w=1000&auto=format&fit=crop" alt="Healthy Diet" className="w-full h-full object-cover scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
                
                <div className="absolute bottom-8 left-8 right-8">
                  <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-3xl shadow-xl">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <div className="text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">Remaining Macros</div>
                        <div className="text-white font-black text-xl">Dinner Allowance</div>
                      </div>
                      <div className="text-white/80 font-bold text-sm">650 kcal</div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300">Protein</span>
                          <span className="text-white">45g</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div className="bg-emerald-400 h-2 rounded-full" style={{ width: '70%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300">Carbs</span>
                          <span className="text-white">60g</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div className="bg-blue-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-xs font-bold mb-1">
                          <span className="text-slate-300">Fats</span>
                          <span className="text-white">22g</span>
                        </div>
                        <div className="w-full bg-slate-700/50 rounded-full h-2">
                          <div className="bg-amber-400 h-2 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. AI COACH (Restored Beautiful Glassmorphism & Light Mode Compatible) */}
      <section id="ai-coach" className="py-32 bg-white dark:bg-slate-900 text-slate-900 dark:text-white relative overflow-hidden rounded-[3rem] mx-4 lg:mx-8 mb-32 shadow-2xl shadow-slate-200/50 dark:shadow-[0_30px_60px_rgba(15,23,42,0.2)] border border-slate-100 dark:border-slate-800">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-secondary-500/10 dark:bg-secondary-500/20 rounded-full blur-[150px] mix-blend-multiply dark:mix-blend-screen animate-pulse-slow" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <motion.div {...fadeIn} className="relative h-[500px] md:h-[600px] w-full rounded-[3rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 backdrop-blur-xl shadow-xl dark:shadow-2xl p-6 overflow-hidden flex flex-col group">
              <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-secondary-500/5 dark:from-primary-500/10 dark:to-secondary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="flex items-center gap-4 mb-6 border-b border-slate-100 dark:border-white/10 pb-4 relative z-10">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-secondary-500 flex items-center justify-center shadow-lg"><FaRobot className="text-white text-xl" /></div>
                <div>
                  <h4 className="text-slate-900 dark:text-white font-bold text-lg">FitVerse AI Coach</h4>
                  <p className="text-secondary-600 dark:text-secondary-400 text-xs font-bold flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary-500 dark:bg-secondary-400 animate-pulse"></span> Online</p>
                </div>
              </div>
              
              <div className="flex-1 space-y-6 overflow-hidden relative z-10">
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="flex gap-4 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center border border-slate-200 dark:border-white/10"><FaRobot className="text-slate-500 dark:text-slate-300 text-sm" /></div>
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white p-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-md backdrop-blur-sm">
                    Good morning! Your lower body is fully recovered. I suggest a heavy leg day today focusing on squats and Romanian deadlifts. Ready?
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 1.5 }} className="flex gap-4 max-w-[85%] ml-auto justify-end">
                  <div className="bg-primary-600 text-white p-4 rounded-2xl rounded-tr-sm text-sm leading-relaxed shadow-md">
                    Sounds good, but I only have 45 minutes today.
                  </div>
                </motion.div>
                
                <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 2.8 }} className="flex gap-4 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 shrink-0 flex items-center justify-center border border-slate-200 dark:border-white/10"><FaRobot className="text-slate-500 dark:text-slate-300 text-sm" /></div>
                  <div className="bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white p-4 rounded-2xl rounded-tl-sm text-sm leading-relaxed shadow-md backdrop-blur-sm">
                    Got it. I've optimized the routine into a high-intensity superset format to maximize volume in 40 minutes. Check your dashboard for the updated plan! Let's crush it!
                  </div>
                </motion.div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-white/10 relative z-10">
                <input type="text" disabled placeholder="Type your fitness question..." className="w-full bg-white dark:bg-slate-950/50 border border-slate-200 dark:border-white/10 rounded-full py-4 px-6 text-sm text-slate-900 dark:text-white cursor-not-allowed placeholder:text-slate-400 focus:outline-none backdrop-blur-sm shadow-inner" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 mt-2 w-10 h-10 bg-primary-500 hover:bg-primary-400 transition-colors rounded-full flex items-center justify-center text-white shadow-lg"><FaArrowRight className="text-sm" /></button>
              </div>
            </motion.div>
            
            <motion.div {...fadeIn}>
              <div className="text-primary-600 dark:text-primary-400 font-bold tracking-wider uppercase mb-4 text-sm flex items-center gap-4">
                <span className="w-12 h-[2px] bg-primary-600 dark:bg-primary-400"></span> Always On
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">Meet Your New Personal Coach</h2>
              <p className="text-slate-600 dark:text-slate-300 text-xl leading-relaxed mb-10 font-medium">
                Stop googling fitness questions. The FitVerse AI knows your body, your goals, and your history. Get instant, science-backed advice tailored specifically to you.
              </p>
              <div className="space-y-6">
                {[
                  { title: "Real-time Form Feedback", desc: "Upload videos and get instant corrections on your lifting form." },
                  { title: "Macro Adjustments", desc: "Ate too much at lunch? The AI recalculates your dinner automatically." },
                  { title: "Injury Prevention", desc: "Auto-detects overtraining and suggests mobility work." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 dark:bg-white/5 backdrop-blur-md flex items-center justify-center shrink-0 border border-slate-200 dark:border-white/10 mt-1 shadow-inner">
                      <FaCheckCircle className="text-secondary-600 dark:text-secondary-400 text-xl" />
                    </div>
                    <div>
                      <h4 className="text-slate-900 dark:text-white font-bold text-xl mb-2">{item.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5. TRAINERS SECTION */}
      <section id="trainers" className="py-32 px-4 bg-slate-50 dark:bg-slate-950 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary-500/10 rounded-full blur-[100px]" />
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <motion.div {...fadeIn}>
              <div className="text-secondary-600 dark:text-secondary-400 font-bold tracking-wider uppercase mb-4 text-sm flex items-center justify-center gap-4">
                <span className="w-12 h-[2px] bg-secondary-600 dark:bg-secondary-400"></span> Elite Team <span className="w-12 h-[2px] bg-secondary-600 dark:bg-secondary-400"></span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6">World-Class Expertise</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                Our AI is trained on data from the world's top fitness professionals. You also get access to human experts when you need them.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { name: 'Marcus Chen', role: 'Head of Strength', img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=400&auto=format&fit=crop', color: 'from-blue-500 to-cyan-400' },
              { name: 'Sarah Miller', role: 'Mobility Expert', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=400&auto=format&fit=crop', color: 'from-emerald-500 to-teal-400' },
              { name: 'David Okafor', role: 'Nutritionist', img: 'https://images.unsplash.com/photo-1531384441138-2736e62e0919?q=80&w=400&auto=format&fit=crop', color: 'from-purple-500 to-fuchsia-400' },
              { name: 'Elena Rostova', role: 'HIIT Specialist', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=400&auto=format&fit=crop', color: 'from-orange-500 to-rose-400' },
            ].map((trainer, i) => (
              <motion.div key={i} {...fadeIn} transition={{ delay: i * 0.1 }} className={`group relative bg-white/60 dark:bg-slate-900/40 backdrop-blur-xl rounded-[3rem] p-6 text-center hover:-translate-y-4 transition-all duration-500 shadow-xl shadow-slate-200/50 dark:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white dark:border-white/5 overflow-hidden ${i % 2 !== 0 ? 'lg:translate-y-8' : ''}`}>
                <div className={`absolute top-0 left-0 w-full h-32 bg-gradient-to-br ${trainer.color} opacity-20 group-hover:opacity-40 transition-opacity duration-500`} />
                <div className="relative w-40 h-40 mx-auto mb-6 mt-4">
                  <div className={`absolute inset-0 rounded-[2rem] bg-gradient-to-br ${trainer.color} blur-xl opacity-40 group-hover:opacity-70 group-hover:scale-110 transition-all duration-500`} />
                  <img src={trainer.img} alt={trainer.name} className="relative w-full h-full object-cover rounded-[2rem] border-4 border-white dark:border-slate-800 shadow-lg" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-2 relative z-10">{trainer.name}</h4>
                <div className="inline-block px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-primary-600 dark:text-primary-400 font-bold uppercase tracking-wider text-[10px] relative z-10 mb-6 shadow-inner">{trainer.role}</div>
                
                <div className="flex justify-center gap-3 relative z-10">
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary-500 hover:text-white cursor-pointer transition-all shadow-md hover:shadow-lg"><FaChartLine /></div>
                  <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary-500 hover:text-white cursor-pointer transition-all shadow-md hover:shadow-lg"><FaFire /></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="py-32 px-4 bg-transparent relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <span className="px-4 py-1.5 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-bold text-xs uppercase tracking-widest border border-primary-500/20 mb-4 inline-block">
              Frequently Asked Questions
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">Got Questions?</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 font-medium">Everything you need to know about FitVerse AI and how it works.</p>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div 
                key={i} 
                {...fadeIn} 
                transition={{ delay: i * 0.08 }} 
                className="glass-card overflow-hidden transition-all duration-300"
              >
                <button 
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)} 
                  className="w-full px-6 sm:px-8 py-6 flex items-center justify-between text-left focus:outline-none group gap-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-primary-500/10 text-primary-600 dark:text-primary-400 border border-primary-500/20 w-max shrink-0">
                      {faq.category}
                    </span>
                    <span className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      {faq.q}
                    </span>
                  </div>
                  <div className={`w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 border border-white/40 dark:border-white/10 flex items-center justify-center shrink-0 transition-transform duration-300 ${activeFaq === i ? 'rotate-180 bg-primary-500 text-white border-primary-500' : 'text-slate-500 dark:text-slate-400'}`}>
                    <FaChevronDown size={14} />
                  </div>
                </button>
                <div className={`px-6 sm:px-8 overflow-hidden transition-all duration-300 ease-in-out ${activeFaq === i ? 'max-h-60 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed pt-2 border-t border-slate-100 dark:border-white/5 font-medium">
                    {faq.a}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* FAQ Footer CTA */}
          <div className="mt-12 text-center glass-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="text-left">
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">Still have questions?</h4>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Can't find the answer you're looking for? Reach out to our support team.</p>
            </div>
            <a 
              href="#contact" 
              className="px-6 py-3 bg-primary-600 hover:bg-primary-500 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-primary-600/20 shrink-0"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </section>

      {/* 7. CONTACT SECTION */}
      <section id="contact" className="py-32 px-4 relative overflow-hidden bg-slate-50 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-slate-900 dark:bg-black rounded-[3rem] p-6 md:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
            
            {/* Dark Mode Glowing Accents */}
            <div className="absolute top-0 right-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-primary-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-72 md:w-[500px] h-72 md:h-[500px] bg-secondary-600/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none" />
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 mix-blend-overlay pointer-events-none" />

            <div className="flex flex-col lg:flex-row gap-16 items-center relative z-10">
              
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white font-bold text-[10px] tracking-widest uppercase mb-6 backdrop-blur-sm">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Support Online
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
                  Let's build your <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-secondary-400 italic pr-2">Empire.</span>
                </h2>
                <p className="text-lg text-slate-400 mb-10 leading-relaxed font-medium max-w-lg mx-auto lg:mx-0">
                  Join thousands of athletes who have already upgraded their fitness journey with FitVerse AI. Need help? Drop us a line.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <div className="flex items-center gap-4 bg-white/5 border border-white/10 hover:border-primary-500/50 transition-colors px-6 py-4 rounded-2xl backdrop-blur-md group cursor-pointer">
                    <div className="w-12 h-12 rounded-xl bg-primary-500/20 flex items-center justify-center text-primary-400 group-hover:scale-110 transition-transform">
                      <FaEnvelope className="text-xl" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Email Us</p>
                      <p className="text-white font-bold">hello@fitverse.ai</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} className="flex-1 w-full">
                <form onSubmit={handleContactSubmit} className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 shadow-2xl">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">First Name</label>
                      <input required type="text" value={contactForm.firstName} onChange={(e) => setContactForm({...contactForm, firstName: e.target.value})} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white outline-none transition-all font-medium placeholder:text-slate-600 shadow-inner" placeholder="John" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Last Name</label>
                      <input type="text" value={contactForm.lastName} onChange={(e) => setContactForm({...contactForm, lastName: e.target.value})} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white outline-none transition-all font-medium placeholder:text-slate-600 shadow-inner" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="mb-6">
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Email Address</label>
                    <input required type="email" value={contactForm.email} onChange={(e) => setContactForm({...contactForm, email: e.target.value})} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white outline-none transition-all font-medium placeholder:text-slate-600 shadow-inner" placeholder="john@example.com" />
                  </div>
                  <div className="mb-8">
                    <label className="block text-[10px] font-bold text-slate-400 mb-2 uppercase tracking-widest">Message</label>
                    <textarea required rows="4" value={contactForm.message} onChange={(e) => setContactForm({...contactForm, message: e.target.value})} className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl focus:ring-1 focus:ring-primary-500 focus:border-primary-500 text-white outline-none transition-all resize-none font-medium placeholder:text-slate-600 shadow-inner" placeholder="How can we help you achieve your goals?" />
                  </div>
                  <button type="submit" disabled={contactStatus === 'sending'} className="w-full py-4 bg-white text-slate-900 hover:bg-primary-500 hover:text-white font-black rounded-2xl transition-all shadow-lg text-lg hover:-translate-y-1 hover:shadow-primary-500/25 disabled:opacity-70 disabled:cursor-not-allowed">
                    {contactStatus === 'sending' ? 'Sending...' : 'Send Message'}
                  </button>
                  {contactStatus === 'success' && (
                    <div className="text-center mt-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl">
                      <p className="text-green-400 font-bold">Message sent successfully! We'll get back to you soon.</p>
                    </div>
                  )}
                  {contactStatus === 'error' && <p className="text-red-400 font-bold text-center mt-4">Failed to send message. Please try again.</p>}
                </form>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;
