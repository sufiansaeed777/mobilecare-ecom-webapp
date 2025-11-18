// src/components/StripeModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCcStripe } from 'react-icons/fa';

function StripeModal({ show, handleClose, onPaymentSuccess }) {
  const handlePayment = () => {
    // Simulate a delay for payment processing (replace with your Stripe integration)
    setTimeout(() => {
      alert('Stripe payment processed successfully!');
      onPaymentSuccess();
      handleClose();
    }, 2000);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCcStripe size={30} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Stripe Payment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img 
          src="/images/stripe-logo.png" 
          alt="Stripe" 
          style={{ width: '100px', marginBottom: '20px' }} 
        />
        <p>Use Stripe to complete your payment securely and easily.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePayment}>
          Pay with Stripe
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default StripeModal;
