import { Link } from 'react-router-dom';
import styles from './cid.modules.scss';
import React from 'react';

export function LinkWindow({ to, children, ...props }) {
  return (
    <a target="_blank" {...props} rel="noopener noreferrer" href={to}>
      {children}
    </a>
  );
}

type Props = {
  cid: string;
  children?: React.ReactNode;
};

export function Cid({ cid, children }: Props) {
  return (
    <Link to={`/ipfs/${cid}`} className={styles.cid}>
      {children || cid}
    </Link>
  );
}
