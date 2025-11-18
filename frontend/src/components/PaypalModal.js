// src/components/PaypalModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaPaypal } from 'react-icons/fa';

function PaypalModal({ show, handleClose, onPaymentSuccess }) {
  const handlePayment = () => {
    // Simulate payment processing delay (replace with real PayPal integration)
    setTimeout(() => {
      alert('PayPal payment processed successfully!');
      onPaymentSuccess();
      handleClose();
    }, 2000);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaPaypal size={30} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          PayPal Payment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img 
          src="/images/paypal-logo.png" 
          alt="PayPal" 
          style={{ width: '100px', marginBottom: '20px' }} 
        />
        <p>Use PayPal to complete your payment securely and conveniently.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePayment}>
          Pay with PayPal
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default PaypalModal;
