import React from 'react';

export const Dots = ({ big }) => (
  <div className={big ? 'loader schedule' : 'loader'}>
    <span>.</span>
    <span>.</span>
    <span>.</span>
  </div>
);
