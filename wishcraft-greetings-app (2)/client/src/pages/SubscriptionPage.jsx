import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import axiosInstance from '../api/axiosInstance';
import { useRazorpay } from '../hooks/useRazorpay';
import { useAuth } from '../hooks/useAuth';
import './SubscriptionPage.css';

const SubscriptionPage = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scriptLoaded, initiatePayment } = useRazorpay();
  const { user, updateUser } = useAuth();

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data } = await axiosInstance.get('/subscriptions/plans');
        setPlans(data);
      } catch (err) {
        toast.error('Failed to load plans');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleSubscribe = async (plan) => {
    if (!scriptLoaded) {
      toast.loading('Loading payment gateway...');
      return;
    }

    await initiatePayment(plan.name, plan.price, (subscription) => {
      // Update user context with new subscription
      updateUser({
        subscription: {
          plan: subscription.plan,
          expiresAt: subscription.endDate
        }
      });
      // Redirect to home after successful payment
      setTimeout(() => {
        window.location.href = '/';
      }, 1500);
    });
  };

  return (
    <motion.div className="subscription-page" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="subscription-page__hero">
        <motion.span className="subscription-page__crown" animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 2 }}>👑</motion.span>
        <h1 className="subscription-page__title">Go Premium</h1>
        <p className="subscription-page__subtitle">Access all templates and features</p>
      </div>
      <div className="container">
        {loading ? (
          <div className="subscription-page__loading">Loading plans...</div>
        ) : (
          <div className="subscription-page__plans">
            {plans.map((plan, i) => (
              <motion.div key={plan.id} className={`subscription-page__plan ${plan.popular ? 'subscription-page__plan--popular' : ''}`} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                {plan.popular && <span className="subscription-page__badge">Most Popular</span>}
                <h3 className="subscription-page__plan-name">{plan.name}</h3>
                <div className="subscription-page__price">
                  <span className="subscription-page__currency">₹</span>
                  <span className="subscription-page__amount">{plan.price}</span>
                  <span className="subscription-page__period">/{plan.period}</span>
                </div>
                <ul className="subscription-page__features">
                  {plan.features.map((f, j) => (
                    <li key={j} className="subscription-page__feature"><span className="subscription-page__check">✓</span>{f}</li>
                  ))}
                </ul>
                <button 
                  className="subscription-page__cta" 
                  onClick={() => handleSubscribe(plan)}
                  disabled={!scriptLoaded}
                >
                  {!scriptLoaded ? 'Loading...' : 'Subscribe Now'}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default SubscriptionPage;
