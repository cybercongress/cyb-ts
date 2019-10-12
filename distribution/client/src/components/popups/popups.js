import React from 'react';

export const Popup = ({ open, text, onClose }) => (
  <div className={`container-popups ${open ? 'popups-open' : 'popups-none'}`}>
    <div className="text-popups">{text}</div>
    <button className="btn-close-popups" onClick={onClose}>
      X
    </button>
  </div>
);
