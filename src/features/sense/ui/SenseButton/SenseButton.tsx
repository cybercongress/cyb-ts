import { Link } from 'react-router-dom';
import styles from './SenseButton.module.scss';
import { routes } from 'src/routes';
import cx from 'classnames';
import { Tooltip } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';

function SenseButton({ className }) {
  const summary = useAppSelector((store) => store.sense.summary);

  return (
    <Link
      className={cx(styles.senseBtn, className)}
      to={routes.robot.routes.sense.path}
    >
      <Tooltip tooltip="unread chats" placement="right">
        <span>{summary.unreadCount.neurons}</span>
      </Tooltip>
      <Tooltip tooltip="cyberlinks' notifications" placement="right">
        <span>{summary.unreadCount.particles}</span>
      </Tooltip>

      <span>all</span>
    </Link>
  );
}

export default SenseButton;
