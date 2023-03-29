import React from 'react';
import { Link } from 'react-router-dom';

export function LinkWindow({ to, children, ...props }) {
  return (
    <a target="_blank" {...props} rel="noopener noreferrer" href={to}>
      {children}
    </a>
  );
}

export function Cid({ cid, children }) {
  return <Link to={`/ipfs/${cid}`}>{children || cid}</Link>;
}
