// src/components/GooglePayModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaGoogle } from 'react-icons/fa';

function GooglePayModal({ show, handleClose, onPaymentSuccess }) {
  const handlePayment = () => {
    // Simulate payment processing delay
    setTimeout(() => {
      alert('Google Pay payment processed successfully!');
      onPaymentSuccess();
      handleClose();
    }, 2000);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaGoogle size={30} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Google Pay Payment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <img
          src="/images/google-pay-logo.png"
          // Alternatively, you can use a hosted URL:
          // src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Google_Pay_Logo.svg/512px-Google_Pay_Logo.svg.png"
          alt="Google Pay"
          style={{ width: '100px', marginBottom: '20px' }}
        />
        <p>Use Google Pay to complete your payment swiftly and securely.</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handlePayment}>
          Pay with Google Pay
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default GooglePayModal;
