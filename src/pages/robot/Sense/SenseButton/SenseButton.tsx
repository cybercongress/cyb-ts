import { Link } from 'react-router-dom';
import styles from './SenseButton.module.scss';
import { routes } from 'src/routes';
import cx from 'classnames';
import useSenseSummary from '../useSenseSummary';
import { EntryType } from 'src/services/CozoDb/types/entities';
import { Tooltip } from 'src/components';

function SenseButton({ className }) {
  const { data } = useSenseSummary();

  console.log('-senseSummary-', data);

  let unreadParticleCount;
  let unreadChatsCount;

  data?.map(({ entryType, unreadCount }) => {
    switch (entryType) {
      case EntryType.particle:
        unreadParticleCount = unreadCount;
        break;

      case EntryType.chat:
        unreadChatsCount = unreadCount;
        break;

      default:
        break;
    }
  });

  return (
    <Link
      className={cx(styles.senseBtn, className)}
      to={routes.robot.routes.sense.path}
    >
      <Tooltip tooltip="unread chats">
        <span>{unreadChatsCount}</span>
      </Tooltip>
      <Tooltip tooltip="cyberlinks' notifications">
        <span>{unreadParticleCount}</span>
      </Tooltip>

      <span>all</span>
    </Link>
  );
}

export default SenseButton;
