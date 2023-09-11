import styles from './styles.module.scss';

const cx = require('classnames');

export function ButtonContainerAvatar({ children, uploadNew, ...props }) {
  return (
    <button
      className={cx(styles.buttonContainerAvatar, { [styles.new]: uploadNew })}
      {...props}
      type="button"
    >
      {children}
    </button>
  );
}

function ContainerAvatar({ children }) {
  return <div className={styles.containetAvatar}>{children}</div>;
}
export default ContainerAvatar;
