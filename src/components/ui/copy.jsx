import React from 'react';

export const Copy = ({ text }) => {
  return (
    <button
      className="copy-address"
      type="button"
      aria-label="Save"
      onClick={() => {
        navigator.clipboard.writeText(text);
      }}
    />
  );
};
