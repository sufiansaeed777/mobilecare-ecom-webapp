// src/components/CancelModal.js
import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { FaTimesCircle } from 'react-icons/fa';

function CancelModal({ show, handleClose }) {
  return (
    <Modal show={show} onHide={handleClose} centered>
      {/* Red header with a times-circle icon */}
      <Modal.Header
        closeButton
        style={{ backgroundColor: '#dc3545', color: '#fff' }}
      >
        <Modal.Title>
          <FaTimesCircle style={{ marginRight: '8px' }} />
          Payment Canceled
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p className="mb-0">
          Your payment was not completed. Please try again or choose another method.
        </p>
      </Modal.Body>

      <Modal.Footer>
        {/* Light button for contrast against red header */}
        <Button 
          variant="light" 
          onClick={handleClose}
          style={{ color: '#dc3545', fontWeight: 'bold' }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CancelModal;
