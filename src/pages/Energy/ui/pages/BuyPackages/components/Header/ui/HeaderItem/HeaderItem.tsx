import { ReactNode } from 'react';
import styles from './HeaderItem.module.scss';

function HeaderItem({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className={styles.itemHeader}>
      <span className={styles.title}>{title}</span>
      <span className={styles.content}>{children}</span>
    </div>
  );
}

export default HeaderItem;
