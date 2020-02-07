import React from 'react';

export const Link = ({ to, children, blank }) => (
  <a target={blank ? '_blank' : '_self'} href={to}>
    {children}
  </a>
);

export const Cid = ({ cid, children }) => (
  <a target="_blank" href={`https://ipfs.io/ipfs/${cid}`}>
    {children || cid}
  </a>
);
