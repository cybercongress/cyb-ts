import { Link } from 'react-router-dom';
import InfoCard, {
  Statuses,
} from 'src/containers/portal/components/InfoCard/InfoCard';
import { routes } from 'src/routes';
import styles from './IPFSConnectError.module.scss';

function IPFSConnectError() {
  return (
    <div className={styles.wrapper}>
      <InfoCard status={Statuses.red} className={styles.content}>
        <p>Could not connect to the IPFS API</p>
        <Link to={routes.robot.routes.drive.path}>Go to ipfs page</Link>
      </InfoCard>
    </div>
  );
}

export default IPFSConnectError;
