import React from 'react';

export function Popup({ open, text, onClose }) {
  return (
    <div className={`container-popups ${open ? 'popups-open' : 'popups-none'}`}>
      <div className="text-popups">{text}</div>
      <button className="btn-close-popups" onClick={onClose}>
        X
      </button>
    </div>
  );
}
