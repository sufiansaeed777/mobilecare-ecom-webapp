// src/pages/Payment.js
import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { FaCcStripe, FaPaypal, FaWallet, FaLock, FaShieldAlt, FaCreditCard, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import UnifiedStripeModal from '../components/UnifiedStripeModal';
import SuccessModal from '../components/SuccessModal';
import CancelModal from '../components/CancelModal';

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const [paymentError, setPaymentError] = useState('');
  const [isProcessing, setIsProcessing] = useState({
      paypal: false,
      stripe: false,
  });
  const [modals, setModals] = useState({
    success: false,
    cancel: false,
    wallet: false
  });

  // State to hold booking/cart data retrieved from localStorage
  const [paymentData, setPaymentData] = useState(() => {
      const defaultData = { totalPrice: 0, bookingData: null, cartItems: [], isValid: false };
      try {
        const storedBooking = localStorage.getItem('bookingInfo');
        if (!storedBooking) {
            console.warn("Payment page: No bookingInfo found in localStorage.");
            return defaultData;
        }
        const parsedData = JSON.parse(storedBooking);

        const bookingValid = !!(parsedData.bookingData?.name && parsedData.bookingData?.email && parsedData.bookingData?.address && parsedData.bookingData?.date && parsedData.bookingData?.time);
        const itemsValid = Array.isArray(parsedData.cartItems) && parsedData.cartItems.length > 0 && parsedData.cartItems.every(item => item.name && typeof item.cost === 'number' && item.cost >= 0);
        const priceValid = typeof parsedData.totalPrice === 'number' && parsedData.totalPrice > 0;

        const isValid = bookingValid && itemsValid && priceValid;

        if (!isValid) {
            console.error("Payment page: Stored bookingInfo is invalid or incomplete.", { bookingValid, itemsValid, priceValid, parsedData });
        }

        parsedData.totalPrice = Number(parsedData.totalPrice) || 0;
        parsedData.cartItems = Array.isArray(parsedData.cartItems) ? parsedData.cartItems : [];

        return { ...parsedData, isValid };
      } catch (error) {
          console.error('Payment data initialization error:', error);
          localStorage.removeItem('bookingInfo');
          return defaultData;
      }
  });

  // Utility functions
  const clearLocalStorage = useCallback(() => {
    console.log("Clearing bookingInfo from localStorage.");
    localStorage.removeItem('bookingInfo');
  }, []);

  const sendConfirmationEmail = useCallback(async (paymentMethod = 'Card', transactionId = null) => {
    if (!paymentData.isValid) {
      console.error("Send Email: Cannot send, invalid paymentData.");
      throw new Error('Cannot send confirmation: Booking data is invalid.');
    }
    console.log("Send Email: Sending confirmation requests...");
    
    // Send both booking confirmation and payment confirmation emails
    const emailPromises = [];
    
    // 1. Booking confirmation email
    emailPromises.push(
      fetch('/api/send-confirmation-email', {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingData: paymentData.bookingData,
          cartItems: paymentData.cartItems,
          totalPrice: paymentData.totalPrice
        })
      })
    );
    
    // 2. Payment confirmation email
    emailPromises.push(
      fetch('/api/send-payment-confirmation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingData: paymentData.bookingData,
          cartItems: paymentData.cartItems,
          totalPrice: paymentData.totalPrice,
          paymentMethod,
          transactionId
        })
      })
    );
    
    try {
      const responses = await Promise.all(emailPromises);
      
      // Check all responses
      for (const response of responses) {
        if (!response.ok) {
          let errorMsg = 'Email server responded with an error.';
          try { const eData = await response.json(); errorMsg = eData.error || errorMsg; } catch (_) { /* ignore */ }
          console.error(`Send Email: Server error - Status ${response.status}`, errorMsg);
        }
      }
      
      console.log('All confirmation email requests successfully processed by backend.');
    } catch (error) {
      console.error('Send Email: Fetch/Network error:', error);
      throw error;
    }
  }, [paymentData]);

  const handlePaymentSuccessActions = useCallback(() => {
      console.log("Payment Success Actions: Clearing cart and local storage.");
      clearCart();
      clearLocalStorage();
      setModals(prev => ({ ...prev, wallet: false, success: true, cancel: false }));
      setIsProcessing({ paypal: false, stripe: false });
  }, [clearCart, clearLocalStorage]);

  const handlePaymentSuccess = useCallback(async (isFromRedirect = false) => {
        console.log(`Handling Payment Success (From Redirect: ${isFromRedirect})`);
        setIsProcessing({ paypal: false, stripe: false });

        if (!paymentData.isValid) {
            console.error("Payment Success Handler: Invalid paymentData state.");
            setPaymentError('Payment completed, but booking data was missing or invalid. Please contact support with your payment details.');
            clearLocalStorage();
             setModals(prev => ({ ...prev, wallet: false, success: false, cancel: false }));
            return;
        }

        try {
            console.log("Payment Success Handler: Attempting to send confirmation email.");
            await sendConfirmationEmail('Card'); // Default to Card payment method
            handlePaymentSuccessActions();
        } catch (emailError) {
            console.error("Payment Success Handler: Email function threw error:", emailError);
             setPaymentError(`Payment succeeded but the confirmation email system failed: ${emailError.message}. Your booking is confirmed.`);
             handlePaymentSuccessActions();
        }
  }, [paymentData, sendConfirmationEmail, handlePaymentSuccessActions, clearLocalStorage]);

  const handlePaymentCancel = useCallback(() => {
        console.log("Handling Payment Cancel");
        setIsProcessing({ paypal: false, stripe: false });
        clearLocalStorage();
        setModals(prev => ({ ...prev, wallet: false, success: false, cancel: true }));
  }, [clearLocalStorage]);

  // Effect to handle status from URL query params
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const status = searchParams.get('status');
    const source = searchParams.get('source');

    console.log(`Payment Page Load: URL status='${status}', source='${source}'`);

    let processed = false;

    if (status && !processed) {
        processed = true;
        if (status === 'success') {
            console.log('Redirect Success detected.');
            handlePaymentSuccess(true);
        } else if (status === 'cancel') {
            console.log('Redirect Cancel detected.');
            handlePaymentCancel();
        }
        console.log('Cleaning URL parameters.');
        navigate(location.pathname, { replace: true });
    }
  }, [location.search, location.pathname, navigate, handlePaymentSuccess, handlePaymentCancel]);

  // Payment handlers
  const handleStripeCheckout = useCallback(async () => {
    if (!paymentData.isValid) { setPaymentError('Invalid booking information for Stripe Checkout.'); return; }
    setIsProcessing(prev => ({ ...prev, stripe: true }));
    setPaymentError('');
    try {
      console.log('Stripe Checkout: Requesting session with items:', paymentData.cartItems);
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cartItems: paymentData.cartItems })
      });

      if (!response.ok) {
          let errorMsg = 'Stripe session creation failed.';
          try { const e = await response.json(); errorMsg = e.error || errorMsg; } catch (_) { /* ignore */ }
          console.error(`Stripe Checkout: Server error ${response.status}`);
          throw new Error(errorMsg);
      }
      const { url, error } = await response.json();
      if (error) { throw new Error(error); }
      if (!url) { throw new Error('Missing Stripe payment gateway URL'); }

      console.log('Stripe Checkout: Redirecting to Stripe...');
      window.location.href = url;
    } catch (error) {
        console.error('Stripe Checkout Error:', error);
        setPaymentError(error.message || 'Failed to start Stripe payment.');
        setIsProcessing(prev => ({ ...prev, stripe: false }));
    }
  }, [paymentData]);

  const handlePayPalCheckout = useCallback(async () => {
    if (!paymentData.isValid) { setPaymentError('Invalid booking information for PayPal.'); return; }
     setIsProcessing(prev => ({ ...prev, paypal: true }));
     setPaymentError('');
    try {
        console.log('PayPal Checkout: Requesting approval URL for total:', paymentData.totalPrice);
        const response = await fetch('/api/create-paypal-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ totalPrice: paymentData.totalPrice })
        });
        if (!response.ok) {
             let errorMsg = 'PayPal order creation failed.';
            try { const e = await response.json(); errorMsg = e.error || errorMsg; } catch (_) { /* ignore */ }
            console.error(`PayPal Checkout: Server error ${response.status}`);
            throw new Error(errorMsg);
        }
        const { approvalUrl, error } = await response.json();
         if (error) { throw new Error(error); }
        if (!approvalUrl) { throw new Error('Missing PayPal approval URL'); }

        console.log('PayPal Checkout: Redirecting to PayPal...');
        window.location.href = approvalUrl;
    } catch (error) {
        console.error('PayPal Checkout Error:', error);
        setPaymentError(error.message || 'Failed to start PayPal payment.');
         setIsProcessing(prev => ({ ...prev, paypal: false }));
    }
  }, [paymentData]);

  const handlePaymentAction = useCallback((processor) => {
    setPaymentError('');
    if (!paymentData.isValid) {
        console.warn(`Payment Action (${processor}): Invalid paymentData, cannot proceed.`);
        setPaymentError('Cannot proceed: Booking information is invalid. Please return to booking.');
        return;
    }

    console.log(`Payment Action: Triggering processor '${processor}'`);
    switch (processor) {
      case 'stripe': handleStripeCheckout(); break;
      case 'paypal': handlePayPalCheckout(); break;
      case 'wallet': setModals(prev => ({ ...prev, wallet: true })); break;
      default: console.error('Invalid payment processor selected:', processor); setPaymentError('Invalid payment option.');
    }
  }, [paymentData.isValid, handleStripeCheckout, handlePayPalCheckout]);

  // Display error if booking data is invalid
   if (!paymentData.isValid && !modals.success && !modals.cancel) {
       return (
           <div className="container my-5 text-center">
               <h1 className="display-5" style={{ color: '#EF4444' }}>Payment Error</h1>
               <p className="lead">Could not load valid booking or cart information from the previous step.</p>
               <p>Please ensure you have selected items and completed the booking details correctly.</p>
               <Link to="/booking" className="btn" style={errorButtonStyle}>
                 <FaArrowLeft style={{ marginRight: '0.5rem' }} />
                 Return to Booking Page
               </Link>
           </div>
       );
   }

  return (
    <div className="container my-5">
      {/* Header Section */}
      <div className="text-center mb-5">
        <h1 className="display-4" style={styles.headerTitle}>Complete Your Payment</h1>
        <p className="lead" style={styles.headerSubtitle}>Review your total and choose a secure payment option.</p>
        <p style={styles.totalAmountStyle}>
            Total Amount: £{(paymentData.totalPrice || 0).toFixed(2)}
        </p>
        {/* General Error Display Area */}
        {paymentError && !modals.success && !modals.cancel && (
          <div style={styles.errorBoxStyle} role="alert">{paymentError}</div>
        )}
      </div>

      {/* Payment Options Grid */}
      <div className="row justify-content-center g-4">
        {/* PayPal Option - COMMENTED OUT FOR NOW */}
        {/* <PaymentOption
            icon={<FaPaypal size={60} style={{ color: '#1E3A8A' }} />}
            title="Pay with PayPal"
            action={() => handlePaymentAction('paypal')}
            isLoading={isProcessing.paypal}
        /> */}
        {/* Stripe Checkout Option */}
        <PaymentOption
            icon={<FaCcStripe size={60} style={{ color: '#1E3A8A' }} />}
            title="Credit/Debit Card"
            action={() => handlePaymentAction('stripe')}
            isLoading={isProcessing.stripe}
            buttonText="Pay with Card"
        />
        {/* Stripe Elements (Modal) Option */}
        <PaymentOption
            icon={<FaWallet size={60} style={{ color: '#1E3A8A' }} />}
            title="Wallet / Secure Card"
            action={() => handlePaymentAction('wallet')}
            buttonText="Use Apple/Google Pay or Card"
        />
      </div>

      {/* Footer Section */}
      <footer className="text-center mt-5">
        <p className="small" style={styles.footerText}>
          <FaLock size={12} style={styles.footerIcon} /> 
          Secure payments processed by PCI-DSS compliant partners.
        </p>
        <p className="small" style={styles.footerText}>
          By proceeding, you agree to our{' '} 
          <Link to="/terms" style={styles.footerLink}>Terms & Conditions</Link>
        </p>
      </footer>

      {/* --- Modals --- */}

      {/* Stripe Elements / Wallet Modal Instance */}
      {modals.wallet && paymentData.totalPrice > 0 && (
          <UnifiedStripeModal
              key={paymentData.totalPrice}
              show={modals.wallet}
              handleClose={() => {
                  console.log('Closing Wallet/Elements Modal.');
                  setModals(prev => ({ ...prev, wallet: false }));
                  setPaymentError('');
              }}
              onPaymentSuccess={() => handlePaymentSuccess(false)}
              totalPrice={paymentData.totalPrice}
          />
      )}

      {/* Success Modal Instance */}
       {modals.success && (
           <SuccessModal
                show={modals.success}
                handleClose={() => {
                    setModals(prev => ({ ...prev, success: false }));
                    console.log("Navigating to home after success.");
                    navigate('/');
                }}
            />
       )}

      {/* Cancel Modal Instance */}
      {modals.cancel && (
          <CancelModal
                show={modals.cancel}
                handleClose={() => {
                    setModals(prev => ({ ...prev, cancel: false }));
                    console.log("Navigating back to booking after cancel.");
                    navigate('/booking');
                }}
            />
      )}

    </div>
  );
}

// --- Styles defined outside component ---
const styles = {
    headerTitle: { 
        color: '#1E3A8A',
        fontWeight: 'bold' 
    },
    headerSubtitle: { 
        color: '#1f2937'
    },
    totalAmountStyle: { 
        fontSize: '1.5rem', 
        fontWeight: 'bold', 
        color: '#1E3A8A',
        margin: '1rem 0' 
    },
    errorBoxStyle: { 
        padding: '1rem', 
        margin: '1rem auto', 
        border: '1px solid #ef4444',
        backgroundColor: '#fee2e2',
        color: '#b91c1c',
        borderRadius: '8px',
        maxWidth: '600px', 
        textAlign: 'left' 
    },
    paymentCardStyle: { 
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        backgroundColor: '#fff', 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100%', 
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.2s ease'
    },
    paymentCardBodyStyle: { 
        textAlign: 'center', 
        display: 'flex', 
        flexDirection: 'column', 
        padding: '1.5rem', 
        flexGrow: 1 
    },
    paymentCardIconStyle: { 
        marginBottom: '1rem'
    },
    paymentCardTitleStyle: { 
        color: '#1E3A8A',
        fontSize: '1.1rem', 
        marginBottom: '1rem', 
        flexGrow: 1
    },
    paymentButtonStyleBase: {
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: '#1E3A8A',
        color: '#fff', 
        border: '1px solid #1E3A8A',
        borderRadius: '8px',
        padding: '0.75rem 1.2rem', 
        cursor: 'pointer', 
        fontSize: '0.95rem',
        fontWeight: '500', 
        textDecoration: 'none', 
        width: '100%', 
        marginTop: 'auto',
        transition: 'all 0.2s ease',
        minHeight: '48px',
        boxShadow: '0 2px 4px rgba(30, 58, 138, 0.1)',
    },
    paymentButtonStyleHover: { 
        background: '#1d4ed8',
        borderColor: '#1d4ed8'
    },
    footerText: { 
        color: '#6b7280'
    },
    footerIcon: { 
        marginRight: '5px', 
        color: '#1E3A8A'
    },
    footerLink: { 
        color: '#1E3A8A',
        textDecoration: 'underline' 
    },
};

const errorButtonStyle = {
    backgroundColor: '#1E3A8A',
    color: '#fff',
    marginTop: '1rem',
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center'
};

// --- Reusable Payment Option Component ---
const PaymentOption = React.memo(({ icon, title, action, buttonText, isLoading }) => {
    const [isHovered, setIsHovered] = useState(false);

    const currentButtonStyle = {
        ...styles.paymentButtonStyleBase,
        ...(isHovered && !isLoading ? styles.paymentButtonStyleHover : {}),
        cursor: isLoading ? 'wait' : 'pointer',
        opacity: isLoading ? 0.7 : 1,
    };

    const cardStyle = {
        ...styles.paymentCardStyle,
        transform: isHovered ? 'translateY(-3px)' : 'none',
        boxShadow: isHovered ? '0 8px 20px rgba(30, 58, 138, 0.15)' : styles.paymentCardStyle.boxShadow
    };

    return (
        <div className="col-lg-4 col-md-6 d-flex">
            <div 
                className="w-100" 
                style={cardStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <div style={styles.paymentCardBodyStyle}>
                    <div style={styles.paymentCardIconStyle}>{icon}</div>
                    <h4 style={styles.paymentCardTitleStyle}>{title}</h4>
                    <button
                        style={currentButtonStyle}
                        onClick={!isLoading ? action : undefined}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                             <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Processing...
                             </>
                         ) : (
                             buttonText || `Proceed with ${title.split(' ')[0]}`
                         )}
                    </button>
                </div>
            </div>
        </div>
    );
});

// Add CSS for focus effects
document.head.insertAdjacentHTML('beforeend', `
<style>
  .payment-btn:focus {
    box-shadow: 0 0 0 3px rgba(30, 58, 138, 0.25) !important;
    outline: none;
  }
</style>
`);

export default Payment;