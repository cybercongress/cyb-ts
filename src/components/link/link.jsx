import React from 'react';
import { Link } from 'react-router-dom';

export const LinkWindow = ({ to, children, ...props }) => (
  <a target="_blank" {...props} rel="noopener noreferrer" href={to}>
    {children}
  </a>
);

export const Cid = ({ cid, children }) => (
  <Link to={`/ipfs/${cid}`}>{children || cid}</Link>
);
