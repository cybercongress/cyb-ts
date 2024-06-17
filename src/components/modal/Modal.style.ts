import { CSSProperties } from 'react';

export const backdrop: CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.5)',
  zIndex: 9999,
};

export const wrapper: CSSProperties = {
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  position: 'fixed',
  minWidth: '500px',
  backgroundColor: 'black',
  zIndex: 10000,
};
