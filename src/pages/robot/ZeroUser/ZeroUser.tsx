import { Link } from 'react-router-dom';
import { ContainerGradientText } from 'src/components';
import { routes } from 'src/routes';
import styles from './ZeroUser.module.scss';
import layoutStyles from '../Layout/Layout.module.scss';

function ZeroUser() {
  return (
    <ContainerGradientText status="green" className={layoutStyles.container}>
      <p className={styles.text}>
        You need a bostrom address to start using robot, <br /> add it in the{' '}
        <Link to={routes.keys.path}>keys</Link> page by connecting your wallet.{' '}
        <br />
        Get your first <Link to={routes.citizenship.path}>citizenship</Link> to
        unlock all features of cyb.
      </p>
    </ContainerGradientText>
  );
}

export default ZeroUser;
