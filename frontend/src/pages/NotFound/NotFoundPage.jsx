import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
      <div className="orb-primary w-96 h-96 top-20 left-20 animate-float" />
      <div className="orb-secondary w-96 h-96 bottom-20 right-20 animate-float animation-delay-2000" />
      
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
        className="clean-card p-12 text-center max-w-lg w-full relative z-10">
        <h1 className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-primary-500 to-secondary-500 drop-shadow-sm">
          404
        </h1>
        <h2 className="text-3xl font-bold text-slate-900 mt-4 mb-2">Page Not Found</h2>
        <p className="text-slate-600 mb-8">
          Oops! The page you're looking for seems to have taken a rest day. Let's get you back to your workout.
        </p>
        <Link to="/" className="btn-primary py-3 px-8 text-lg inline-block">
          Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default NotFoundPage;
