import React from 'react';

export const Dots = ({ big }) => (
  <div className={big ? 'loader-dot schedule' : 'loader-dot'}>
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </div>
);
