// src/components/CreditCardModal.js
import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { FaCreditCard } from 'react-icons/fa';

function CreditCardModal({ show, handleClose, onPaymentSuccess }) {
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');
  const [processing, setProcessing] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate payment processing delay; replace this with your actual integration logic
    setTimeout(() => {
      alert('Credit Card payment processed successfully!');
      onPaymentSuccess();
      handleClose();
      setProcessing(false);
    }, 2000);
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaCreditCard size={30} style={{ marginRight: '10px', verticalAlign: 'middle' }} />
          Credit Card Payment
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="cardHolder">
            <Form.Label>Card Holder Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="John Doe"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cardNumber">
            <Form.Label>Card Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="expiry">
            <Form.Label>Expiry Date</Form.Label>
            <Form.Control
              type="text"
              placeholder="MM/YY"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="cvc">
            <Form.Label>CVC</Form.Label>
            <Form.Control
              type="text"
              placeholder="123"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={processing} className="w-100">
            {processing ? 'Processing...' : 'Pay Now'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default CreditCardModal;
