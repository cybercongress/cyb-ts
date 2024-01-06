import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SenseButton.module.scss';
import { routes } from 'src/routes';
import { useBackend } from 'src/contexts/backend';
import { useQuery } from '@tanstack/react-query';
import cx from 'classnames';

function SenseButton({ className }) {
  const { senseApi } = useBackend();

  const { data } = useQuery({
    queryKey: ['senseApi', 'getSummary'],
    queryFn: async () => {
      return senseApi!.getSummary();
    },
    enabled: !!senseApi,
  });

  console.log('----data', data);

  const unread = data?.[0]?.unread || 0;

  return (
    <Link
      className={cx(styles.senseBtn, className)}
      to={routes.robot.routes.sense.path}
    >
      <span>⚪️</span>
      <span>⚪️</span>
      {unread > 0 && <span>{unread}</span>}
    </Link>
  );
}

export default SenseButton;