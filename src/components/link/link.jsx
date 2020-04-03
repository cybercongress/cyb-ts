import React from 'react';

export const LinkWindow = ({ to, children }) => (
  <a target="_blank" rel="noopener noreferrer" href={to}>
    {children}
  </a>
);

export const Cid = ({ cid, children }) => (
  <a target="_blank" href={`https://ipfs.io/ipfs/${cid}`}>
    {children || cid}
  </a>
);
