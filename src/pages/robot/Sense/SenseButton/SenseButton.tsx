import React from 'react';
import { Link } from 'react-router-dom';
import styles from './SenseButton.module.scss';
import { routes } from 'src/routes';
import { useBackend } from 'src/contexts/backend';
import { useQuery } from '@tanstack/react-query';
import cx from 'classnames';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentAddress } from 'src/redux/features/pocket';

function SenseButton({ className }) {
  const { senseApi } = useBackend();

  const address = useAppSelector(selectCurrentAddress);

  const { data } = useQuery({
    queryKey: ['senseApi', 'getSummary', address],
    queryFn: async () => {
      return senseApi!.getSummary(address!);
    },
    enabled: Boolean(senseApi && address),
  });

  const unread = data?.[0]?.unread || 0;

  return (
    <Link
      className={cx(styles.senseBtn, className)}
      to={routes.robot.routes.sense.path}
    >
      <span>⚪️</span>
      <span>⚪️</span>
      <span>{unread}</span>
    </Link>
  );
}

export default SenseButton;
