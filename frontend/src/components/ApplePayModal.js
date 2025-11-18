// src/components/ApplePayModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaApple, FaTimes } from 'react-icons/fa';

function ApplePayModal({ show, handleClose, onPaymentSuccess }) {
  const handlePayment = () => {
    // Simulate a delay for payment processing (replace with real integration)
    setTimeout(() => {
      alert('Apple Pay payment processed successfully!');
      onPaymentSuccess();
      handleClose();
    }, 2000);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
      <Modal.Title>
        <FaApple size={30} style={{ marginRight: '10px', transform: 'translateY(-3px)' }} />
        Apple Pay Payment
        </Modal.Title>


      </Modal.Header>
      <Modal.Body className="text-center">
        <p>
          Use Apple Pay to complete your payment quickly and securely.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePayment}>
          Pay with Apple Pay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ApplePayModal;
