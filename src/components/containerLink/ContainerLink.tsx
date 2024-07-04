import { Link } from 'react-router-dom';
import cx from 'classnames';
import styles from './ContainerLink.module.scss';

type ContainerLinkProps = {
  to: string;
  position: 'sense' | 'hydrogen';
  children: React.ReactNode;
};

function ContainerLink({ to, position, children }: ContainerLinkProps) {
  return (
    <Link to={to} className={cx(styles.main, styles[position])}>
      {children}
    </Link>
  );
}

export default ContainerLink;
