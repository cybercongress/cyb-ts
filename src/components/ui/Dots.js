import React from 'react';

export function Dots({ big }) {
  return (
    <div className={big ? 'loader-dot schedule' : 'loader-dot'}>
      <span>.</span>
      <span>.</span>
      <span>.</span>
    </div>
  );
}
