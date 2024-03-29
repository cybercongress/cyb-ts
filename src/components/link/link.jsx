import { Link } from 'react-router-dom';
import styles from './cid.modules.scss';

export function LinkWindow({ to, children, ...props }) {
  return (
    <a target="_blank" {...props} rel="noopener noreferrer" href={to}>
      {children}
    </a>
  );
}

export function Cid({ cid, children }) {
  return (
    <Link to={`/ipfs/${cid}`} className={styles.cid}>
      {children || cid}
    </Link>
  );
}
