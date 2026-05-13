import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRazorpay } from '../../hooks/useRazorpay';
import { useAuth } from '../../hooks/useAuth';
import Modal from '../common/Modal';
import './PremiumPopup.css';

const plans = [
  { id: 'basic', name: 'Basic', price: 49, period: 'mo', features: ['50+ Premium Templates', 'Basic Customization', 'Email Support'] },
  { id: 'standard', name: 'Standard', price: 99, period: 'mo', popular: true, features: ['150+ Premium Templates', 'Advanced Customization', 'Priority Support', 'No Watermark'] },
  { id: 'pro', name: 'Pro', price: 199, period: 'mo', features: ['Unlimited Templates', 'Full Customization', '24/7 Support', 'No Watermark', 'Early Access'] }
];

const PremiumPopup = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { scriptLoaded, initiatePayment } = useRazorpay();
  const { updateUser } = useAuth();

  const handlePlanClick = async (plan) => {
    if (!scriptLoaded) {
      // Fallback: navigate to subscription page if script not loaded
      navigate('/subscription');
      onClose();
      return;
    }

    await initiatePayment(plan.name, plan.price, (subscription) => {
      updateUser({
        subscription: {
          plan: subscription.plan,
          expiresAt: subscription.endDate
        }
      });
      onClose();
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="premium-popup__modal">
      <div className="premium-popup">
        <motion.div className="premium-popup__icon" animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
          👑
        </motion.div>
        <h2 className="premium-popup__title">See Premium Plans</h2>
        <p className="premium-popup__subtitle">Unlock 150+ templates and remove watermarks</p>

        <div className="premium-popup__plans">
          {plans.map((plan, i) => (
            <motion.div key={plan.id} className={`premium-popup__plan ${plan.popular ? 'premium-popup__plan--popular' : ''}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              {plan.popular && <span className="premium-popup__badge">Most Popular</span>}
              <h3 className="premium-popup__plan-name">{plan.name}</h3>
              <div className="premium-popup__price">
                <span className="premium-popup__currency">₹</span>
                <span className="premium-popup__amount">{plan.price}</span>
                <span className="premium-popup__period">/{plan.period}</span>
              </div>
              <ul className="premium-popup__features">
                {plan.features.map((f, j) => (
                  <li key={j} className="premium-popup__feature"><span className="premium-popup__check">✓</span>{f}</li>
                ))}
              </ul>
              <button className="premium-popup__cta" onClick={() => handlePlanClick(plan)} disabled={!scriptLoaded}>
                {!scriptLoaded ? 'Loading...' : `Choose ${plan.name}`}
              </button>
            </motion.div>
          ))}
        </div>

        <button className="premium-popup__later" onClick={onClose}>Maybe Later</button>
      </div>
    </Modal>
  );
};

export default PremiumPopup;
