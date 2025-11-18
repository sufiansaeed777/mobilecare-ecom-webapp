// src/components/SuccessModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaCheckCircle } from 'react-icons/fa';

function SuccessModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* Green header with success icon */}
      <Modal.Header
        closeButton
        style={{ backgroundColor: '#198754', color: '#fff' }}
      >
        <Modal.Title>
          <FaCheckCircle style={{ marginRight: '8px' }} />
          Payment Successful!
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0">
          Thank you for your payment. Your order is confirmed!
        </p>
      </Modal.Body>

      <Modal.Footer>
        {/* Light-colored button for contrast against the green header */}
        <Button 
          variant="light" 
          onClick={handleClose}
          style={{ color: '#198754', fontWeight: 'bold' }}
        >
          Great!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default SuccessModal;
