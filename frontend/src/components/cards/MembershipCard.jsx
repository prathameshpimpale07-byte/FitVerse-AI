import { motion } from 'framer-motion';
import { FaCheck, FaCrown } from 'react-icons/fa';

const MembershipCard = ({ plan, onPurchase, isPopular }) => {
  return (
    <motion.div
      whileHover={{ y: -10, scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className={`clean-card relative overflow-hidden ${isPopular ? 'border-purple-500/60 shadow-sm' : ''}`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0">
          <div className="bg-gradient-to-r from-purple-500 to-orange-500 text-white text-xs font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1">
            <FaCrown /> POPULAR
          </div>
        </div>
      )}

      <div className="p-8 text-center">
        <span className="text-4xl mb-3 block">{plan.badge}</span>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
        <p className="text-slate-600 text-sm mb-6">{plan.description}</p>

        <div className="mb-6">
          <span className="text-5xl font-bold gradient-text">₹{plan.price}</span>
          <span className="text-slate-600 text-sm">/{plan.duration} days</span>
        </div>

        <div className="space-y-3 mb-8 text-left">
          {plan.features?.map((feature, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <FaCheck className="text-green-400 flex-shrink-0" />
              <span className="text-slate-600">{feature}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => onPurchase?.(plan)}
          className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 ${
            isPopular ? 'btn-primary' : 'btn-outline'
          }`}
        >
          Get Started
        </button>
      </div>
    </motion.div>
  );
};

export default MembershipCard;
