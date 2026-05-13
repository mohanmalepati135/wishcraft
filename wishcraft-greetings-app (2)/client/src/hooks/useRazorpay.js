import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';
import toast from 'react-hot-toast';

export const useRazorpay = () => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script
    const existingScript = document.getElementById('razorpay-script');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => setScriptLoaded(true);
    script.onerror = () => {
      toast.error('Failed to load payment gateway');
    };
    document.body.appendChild(script);

    return () => {
      // Don't remove script on unmount to avoid reloading
    };
  }, []);

  const initiatePayment = async (plan, price, onSuccess) => {
    if (!scriptLoaded) {
      toast.error('Payment gateway is loading. Please try again.');
      return;
    }

    if (!window.Razorpay) {
      toast.error('Payment gateway not available');
      return;
    }

    try {
      // Create order on backend
      const { data: orderData } = await axiosInstance.post('/razorpay/order', {
        plan: plan.toLowerCase(),
        price: price
      });

      const options = {
        key: orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'WishCraft',
        description: `${plan} Plan Subscription`,
        order_id: orderData.orderId,
        image: 'https://your-logo-url.com/logo.png', // Optional: your app logo
        handler: async (response) => {
          try {
            // Verify payment on backend
            const verifyRes = await axiosInstance.post('/razorpay/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              plan: plan.toLowerCase(),
              price: price
            });

            if (verifyRes.data.success) {
              toast.success('🎉 Payment successful! Subscription activated.');
              onSuccess?.(verifyRes.data.subscription);
            }
          } catch (err) {
            toast.error('Payment verification failed. Contact support.');
          }
        },
        prefill: {
          name: '',
          email: '',
          contact: ''
        },
        notes: {
          plan: plan,
          app: 'WishCraft'
        },
        theme: {
          color: '#7C3AED'
        },
        modal: {
          ondismiss: () => {
            toast('Payment cancelled', { icon: 'ℹ️' });
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on('payment.failed', (response) => {
        toast.error(`Payment failed: ${response.error.description}`);
      });

    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to initiate payment');
    }
  };

  return { scriptLoaded, initiatePayment };
};
