import { Link } from 'react-router-dom';
import { FaDumbbell, FaInstagram, FaTwitter, FaYoutube, FaFacebook } from 'react-icons/fa';
import { HiMail, HiPhone, HiLocationMarker } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="relative bg-dark-900 border-t border-slate-200 overflow-hidden pt-20 pb-10">
      {/* Background Decor */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070')] bg-cover bg-center opacity-5 mix-blend-overlay" />
      <div className="orb-primary w-[500px] h-[500px] -top-60 left-10 opacity-10" />
      <div className="orb-secondary w-[400px] h-[400px] top-40 right-10 opacity-10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          
          {/* Brand & Description */}
          <div className="lg:col-span-4">
            <Link to="/" className="flex items-center gap-3 mb-6 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-primary-600 to-violet-600 flex items-center justify-center transition-transform group-hover:scale-105 shadow-md shadow-primary-500/20 shrink-0">
                <FaDumbbell className="text-white text-xl" />
              </div>
              <span className="text-3xl font-black text-white tracking-tight">
                FitVerse <span className="text-primary-500">AI</span>
              </span>
            </Link>
            <p className="text-slate-400 text-base leading-relaxed mb-8 pr-4 font-medium">
              Experience the future of fitness. Our AI-powered platform and elite community are here to help you unlock your ultimate potential.
            </p>
            <div className="flex gap-4">
              {[FaInstagram, FaTwitter, FaYoutube, FaFacebook].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary-500 transition-all duration-300 shadow-sm border border-white/10 hover:border-primary-500 hover:-translate-y-1">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 lg:col-start-6">
            <h4 className="text-white font-bold text-lg mb-6">Explore</h4>
            <ul className="space-y-4">
              {[
                { name: 'Home', path: '/#hero' },
                { name: 'About', path: '/#about' },
                { name: 'Workouts', path: '/#workouts' },
                { name: 'Trainers', path: '/#trainers' },
                { name: 'AI Coach', path: '/#ai-coach' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.path} className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/0 group-hover:bg-primary-500 transition-colors" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-bold text-lg mb-6">Support</h4>
            <ul className="space-y-4">
              {[
                { name: 'Contact', path: '/#contact' },
                { name: 'FAQ', path: '/login' },
                { name: 'Privacy Policy', path: '/login' },
                { name: 'Terms of Service', path: '/login' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-slate-400 hover:text-primary-400 transition-colors flex items-center gap-2 group font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-500/0 group-hover:bg-primary-500 transition-colors" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-3">
            <h4 className="text-white font-bold text-lg mb-6">Contact Us</h4>
            <div className="space-y-6">
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 group-hover:text-primary-400 transition-colors text-slate-400">
                  <HiMail className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Email</p>
                  <p className="text-slate-300 text-sm font-medium">support@fitverse.app</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-secondary-500/20 group-hover:border-secondary-500/30 group-hover:text-secondary-400 transition-colors text-slate-400">
                  <HiPhone className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Phone</p>
                  <p className="text-slate-300 text-sm font-medium">+91 98765 43210</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-primary-500/20 group-hover:border-primary-500/30 group-hover:text-primary-400 transition-colors text-slate-400">
                  <HiLocationMarker className="text-xl" />
                </div>
                <div>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Location</p>
                  <p className="text-slate-300 text-sm font-medium">123 Fitness Street, Mumbai</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} FitVerse AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            Designed with <span className="text-red-500 animate-pulse">❤️</span> by <span className="text-white font-bold">FitVerse Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
