import React from 'react';

export const LinkWindow = ({ to, children, ...props }) => (
  <a target="_blank" {...props} rel="noopener noreferrer" href={to}>
    {children}
  </a>
);

export const Cid = ({ cid, children }) => (
  <a target="_blank" href={`https://ipfs.io/ipfs/${cid}`}>
    {children || cid}
  </a>
);
