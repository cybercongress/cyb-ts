import { Link } from 'react-router-dom';
import styles from './SenseButton.module.scss';
import { routes } from 'src/routes';
import cx from 'classnames';
import { Tooltip } from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { useEffect } from 'react';
import { getSenseSummary } from '../../redux/sense.redux';
import { useBackend } from 'src/contexts/backend';

function SenseButton({ className }) {
  const summary = useAppSelector((store) => store.sense.summary);

  const dispatch = useAppDispatch();

  const { senseApi } = useBackend();

  useEffect(() => {
    if (!senseApi) {
      return;
    }

    function getSummary() {
      dispatch(getSenseSummary(senseApi));
    }

    getSummary();

    setInterval(() => {
      getSummary();
    }, 1000 * 30);
  }, [dispatch, senseApi]);

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
