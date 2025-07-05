import React from 'react';
import './SuccessModal.css';

function SuccessModal({ open, message, onClose, actionLabel, onAction }) {
  if (!open) return null;
  return (
    <div className="success-modal-backdrop">
      <div className="success-modal">
        <div className="success-modal-content">
          <h2>Success!</h2>
          <p>{message}</p>
          <div className="success-modal-actions">
            {onAction && actionLabel && (
              <button className="success-modal-btn" onClick={onAction}>{actionLabel}</button>
            )}
            <button className="success-modal-btn" onClick={onClose}>OK</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal; 