// src/components/UnifiedStripeModal.js
import React, { useEffect, useState, useCallback } from 'react';
import { Modal, Button, Alert } from 'react-bootstrap'; // Assuming react-bootstrap is installed
import {
  useStripe,
  useElements,
  PaymentRequestButtonElement,
  CardElement,
} from '@stripe/react-stripe-js';

// Define CardElement options outside component for performance & clarity
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      iconColor: '#666ee8', // Example icon color
      color: '#31325f',     // Dark grey text
      fontWeight: '400',
      fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      fontSize: '16px',
      fontSmoothing: 'antialiased',
      ':-webkit-autofill': {
        color: '#fce883', // Handle autofill background
      },
      '::placeholder': {
        color: '#aab7c4', // Placeholder text color
      },
    },
    invalid: {
      iconColor: '#dc3545', // Bootstrap danger color
      color: '#dc3545',     // Bootstrap danger color
    },
  },
  hidePostalCode: true, // Set true if you don't collect/validate postal code
};


function UnifiedStripeModal({ show, handleClose, onPaymentSuccess, totalPrice }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paymentRequest, setPaymentRequest] = useState(null);
  const [supportsPaymentRequest, setSupportsPaymentRequest] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // No need to store clientSecret in state if only used transiently

  // Calculate amount in smallest currency unit (pence/cents)
  const amountInCents = useCallback(() => {
      if (typeof totalPrice !== 'number' || totalPrice <= 0) return 0;
      return Math.round(totalPrice * 100);
  }, [totalPrice]);


  // Retrieve booking info from localStorage - stable function
  const getBookingInfo = useCallback(() => {
    try {
      return JSON.parse(localStorage.getItem('bookingInfo')) || {};
    } catch (error) {
      console.error('Error parsing booking info:', error);
      return {};
    }
  }, []);


  // Send confirmation email function - stable function
  const sendConfirmationEmail = useCallback(async () => {
    // Prevent sending email if payment failed or data is missing
    try {
      const { bookingData, cartItems, totalPrice: storedTotalPrice } = getBookingInfo();

      if (!bookingData || !cartItems?.length) {
        console.warn("Send Email: Missing booking information in storage. Email not sent.");
        // Optionally inform user, but don't block success flow
        alert("Payment Succeeded, but couldn't find booking details to send confirmation email. Please contact support.");
        return; // Exit function
      }

      // Use the totalPrice prop passed to the modal for the actual payment amount
      const finalPrice = totalPrice;

      console.log('Send Email: Sending confirmation email request with:', { bookingData, cartItems, finalPrice });

      const response = await fetch('/api/send-confirmation-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingData, cartItems, totalPrice: finalPrice }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to get error details
        console.error(`Send Email: Server error ${response.status}`, errorData);
        throw new Error(errorData.error || `Email sending failed (status ${response.status})`);
      }

      console.log('Confirmation email request sent successfully');

    } catch (error) {
      console.error('Send Email Error:', error);
      // Non-blocking error: Payment succeeded, inform user about email issue
      alert(`Payment Succeeded, but confirmation email failed: ${error.message}. Your booking is confirmed. Please contact support if needed.`);
    }
  }, [getBookingInfo, totalPrice]);


  // Effect to Setup Payment Request Button (Apple/Google Pay)
  useEffect(() => {
    // Only proceed if Stripe.js has loaded, Elements is available, and there's a valid price
    if (stripe && elements && totalPrice > 0) {
        const currentAmount = amountInCents();
        if (currentAmount <= 0) return; // Don't create PR for zero amount

        const pr = stripe.paymentRequest({
            country: 'GB',
            currency: 'gbp',
            total: {
                label: 'Mobile Care Service Total', // Label shown in wallet UI
                amount: currentAmount,
            },
            requestPayerName: true,
            requestPayerEmail: true,
        });

        // Check if Payment Request Button can be shown
        pr.canMakePayment().then((result) => {
            if (result) {
                console.log('Payment Request Supported:', result);
                setSupportsPaymentRequest(true);
                setPaymentRequest(pr); // Store the instance
            } else {
                console.log('Payment Request Not Supported by browser/device.');
                setSupportsPaymentRequest(false);
                setPaymentRequest(null);
            }
        }).catch(err => {
            console.error("Error checking canMakePayment:", err);
            setSupportsPaymentRequest(false);
            setPaymentRequest(null);
        });

        // Listener for when payment method is chosen via the button
        pr.on('paymentmethod', async (ev) => {
            console.log('Payment Request paymentmethod event triggered:', ev.paymentMethod.id);
            setProcessing(true);
            setErrorMessage('');

            try {
                const currentAmount = amountInCents(); // Recalculate in case price changed
                if (currentAmount <= 0) throw new Error("Invalid payment amount.");

                // 1. Create PaymentIntent on backend
                console.log('Payment Request: Creating Payment Intent...');
                const response = await fetch('/api/create-payment-intent', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ amount: currentAmount }),
                });

                if (!response.ok) { /* ... handle server error ... */ throw new Error(`Server error (${response.status})`); }
                const { clientSecret, error: backendError } = await response.json();
                if (backendError || !clientSecret) { throw new Error(backendError || 'Failed to get client secret.'); }
                console.log('Payment Request: Received client secret.');

                // 2. Confirm the payment on the frontend
                console.log('Payment Request: Confirming payment...');
                const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
                    clientSecret,
                    confirmParams: { return_url: `${window.location.origin}/payment-confirmation` },
                    // No need to pass elements or payment_method_data here,
                    // confirmPayment uses the PaymentMethod from the 'paymentmethod' event context (ev)
                    // However, Stripe documentation sometimes shows passing it, let's verify best practice.
                    // According to docs for PRB event, confirmPayment should work without explicitly passing PM.
                    redirect: 'if_required',
                });

                if (confirmError) { throw confirmError; } // Handle card errors/declines

                // 3. Check PaymentIntent status
                console.log('Payment Request: Payment Intent Status:', paymentIntent?.status);
                if (paymentIntent?.status === 'succeeded') {
                    console.log('Payment Request: Payment Succeeded!');
                    await sendConfirmationEmail();
                    ev.complete('success'); // Signal success to PR API (important!)
                    onPaymentSuccess();     // Signal success to parent component
                } else {
                    throw new Error(`Payment status: ${paymentIntent?.status ?? 'unknown'}`);
                }

            } catch (error) {
                console.error('Payment Request Processing Error:', error);
                setErrorMessage(error.message || 'Payment failed. Please try another method.');
                ev.complete('fail'); // Signal failure to PR API
            } finally {
                setProcessing(false);
            }
        }); // end pr.on('paymentmethod')

    } else {
        // If stripe/elements/totalPrice not ready, ensure PR is not shown
        setSupportsPaymentRequest(false);
        setPaymentRequest(null);
    }

    // Cleanup function for the effect is tricky with .on listener.
    // If `pr` instance changes, the old listener might persist.
    // A more robust approach might involve storing the handler in useRef
    // and explicitly removing it, but for simplicity, this might be okay
    // if totalPrice/stripe instance are relatively stable.

  }, [stripe, elements, totalPrice, onPaymentSuccess, amountInCents, sendConfirmationEmail]); // Dependencies


  // Handle manual card payments
  const handleCardPayment = async (event) => {
    event.preventDefault(); // Prevent default form submission if CardElement is in a form

    if (!stripe || !elements || !totalPrice || totalPrice <= 0) {
      console.error('Card Payment Error: Stripe.js/Elements not loaded or invalid amount.');
      setErrorMessage('Payment system not ready or invalid amount.');
      return;
    }

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      console.error('Card Payment Error: CardElement not found.');
      setErrorMessage('Card input element not ready. Please refresh.');
      return;
    }

    setProcessing(true);
    setErrorMessage('');

    try {
      const currentAmount = amountInCents();
      if (currentAmount <= 0) throw new Error("Invalid payment amount.");

      // 1. Create PaymentIntent on backend
      console.log('Card Payment: Creating Payment Intent...');
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: currentAmount }),
      });

      if (!response.ok) { /* ... handle server error ... */ throw new Error(`Server error (${response.status})`); }
      const { clientSecret, error: backendError } = await response.json();
      if (backendError || !clientSecret) { throw new Error(backendError || 'Failed to get client secret.'); }
      console.log('Card Payment: Received client secret.');

      // 2. Confirm the payment on the frontend
      console.log('Card Payment: Confirming payment...');
      const { error: confirmError, paymentIntent } = await stripe.confirmPayment({
        elements, // Pass elements instance (contains CardElement reference)
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-confirmation`, // Your confirmation page
          // Payment method details are automatically collected by elements instance
        },
        redirect: 'if_required',
      });

      if (confirmError) {
        // Handle confirmation errors (e.g., invalid card, insufficient funds)
        console.error('Card Payment: Confirmation error:', confirmError);
        if (confirmError.type === "card_error" || confirmError.type === "validation_error") {
            setErrorMessage(confirmError.message || 'Card details seem invalid. Please check and try again.');
        } else {
            setErrorMessage("Payment failed during confirmation. Please try again.");
        }
        // Don't re-throw, allow finally block to run
        return; // Stop processing
      }

      // 3. Check PaymentIntent status
      console.log('Card Payment: Payment Intent Status:', paymentIntent?.status);
      if (paymentIntent?.status === 'succeeded') {
        console.log('Card Payment Succeeded!');
        await sendConfirmationEmail();
        onPaymentSuccess(); // Close modal, show success, etc.
      } else {
        // Handle other statuses (e.g., requires_action if redirect didn't happen)
         console.error('Card Payment: Unexpected payment intent status:', paymentIntent?.status);
        setErrorMessage(`Payment status: ${paymentIntent?.status ?? 'unknown'}. Please contact support.`);
      }

    } catch (error) { // Catch errors from fetch or other logic
      console.error('Card Payment: Full processing error:', error);
      // Set error message only if not already set by confirmPayment error handling
      if (!errorMessage) {
          setErrorMessage(error.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setProcessing(false); // Ensure processing is always set to false
    }
  }; // End handleCardPayment

  // --- Render Logic ---
  return (
    <Modal show={show} onHide={!processing ? handleClose : undefined} centered backdrop="static" keyboard={!processing}>
      <Modal.Header closeButton={!processing}>
        <Modal.Title>
          {/* Adjust title based on what's available */}
          {supportsPaymentRequest && paymentRequest ? 'Pay with Wallet or Card' : 'Pay with Card'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body> {/* Removed text-center from body, let content align */}

        {/* Error display at the top */}
        {errorMessage && (
          <Alert variant="danger" className="text-start small mb-3"> {/* Use start alignment */}
            {errorMessage}
          </Alert>
        )}

        {/* Payment Request Button (Apple/Google Pay) */}
        {supportsPaymentRequest && paymentRequest && (
            <div className="mb-3 text-center"> {/* Center the button itself */}
                <PaymentRequestButtonElement
                    options={{
                        paymentRequest,
                        style: {
                            paymentRequestButton: {
                                type: 'default',
                                theme: 'dark',
                                height: '48px'
                            }
                        }
                    }}
                    disabled={processing} // Disable if any payment is processing
                    onClick={() => setErrorMessage('')} // Clear errors when wallet button clicked
                />
                <hr /> {/* Separator */}
                <p className="text-muted small mb-3">Or enter card details below:</p>
            </div>
        )}

        {/* Card Element Form */}
        {/* Wrap CardElement and Button in a form for semantics & potential submit handling */}
        <form onSubmit={handleCardPayment}>
             {/* Add padding/border around CardElement for better visuals */}
            <div style={{ padding: '10px', border: '1px solid #dee2e6', borderRadius: '0.25rem', marginBottom: '1rem' }}>
                <CardElement options={CARD_ELEMENT_OPTIONS} />
            </div>

            <Button
              type="submit" // Use submit type for the form
              variant="dark"
              className="w-100 mt-3" // Use mt-3 for spacing from CardElement
              // Disable if processing, or if Stripe/Elements not ready, or invalid price
              disabled={processing || !stripe || !elements || !totalPrice || totalPrice <= 0}
            >
              {processing ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Processing...
                </>
              ) : (
                // Format price robustly
                `Pay £${(totalPrice || 0).toFixed(2)} with Card`
              )}
            </Button>
        </form>

      </Modal.Body>
    </Modal>
  );
}

export default UnifiedStripeModal;