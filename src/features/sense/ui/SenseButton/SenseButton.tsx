import { Link } from 'react-router-dom';
import styles from './SenseButton.module.scss';
import { routes } from 'src/routes';
import cx from 'classnames';
import { Tooltip } from 'src/components';
import { useAppSelector } from 'src/redux/hooks';
import { selectUnreadCounts } from '../../redux/sense.redux';
import { Tooltip } from 'src/components';

type Props = {
  className?: string;
};

function SenseButton({ className }: Props) {
  const { particles, neurons } = useAppSelector(selectUnreadCounts);
  const total = particles + neurons;

  return (
    <Link
      className={cx(styles.senseBtn, className)}
      to={routes.robot.routes.sense.path}
    >
      {/* <Tooltip tooltip="unread chats" placement="right">
        <span>{unreadCounts.neurons}</span>
      </Tooltip>
      <Tooltip tooltip="cyberlinks' notifications" placement="right">
        <span>{unreadCounts.particles}</span>
      </Tooltip> */}

      <Tooltip tooltip="sense notifications">
        <span>{total}</span>
      </Tooltip>
      <span>all</span>
    </Link>
  );
}

export default SenseButton;
