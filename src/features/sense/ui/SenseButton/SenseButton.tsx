import { Link } from 'react-router-dom';
import styles from './SenseButton.module.scss';
import { routes } from 'src/routes';
import cx from 'classnames';
import { Tooltip } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectUnreadCounts } from '../../redux/sense.redux';

type Props = {
  className?: string;
};

function SenseButton({ className }: Props) {
  const unreadCounts = useAppSelector(selectUnreadCounts);

  return (
    <Link
      className={cx(styles.senseBtn, className)}
      to={routes.robot.routes.sense.path}
    >
      <Tooltip tooltip="unread chats" placement="right">
        <span>{unreadCounts.neurons}</span>
      </Tooltip>
      <Tooltip tooltip="cyberlinks' notifications" placement="right">
        <span>{unreadCounts.particles}</span>
      </Tooltip>

      <span>all</span>
    </Link>
  );
}

export default SenseButton;
