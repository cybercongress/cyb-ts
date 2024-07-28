import { useMemo } from 'react';
import { useAppSelector } from 'src/redux/hooks';
import { ServiceName } from 'src/services/backend/types/services';

export const useBackendServiceLoaded = (serviceName: ServiceName) =>
  useAppSelector(
    (state) => state.backend.services[serviceName].status === 'started'
  );

export const useFollowings = () => {
  // TODO: preload from DB

  const { friends, following } = useAppSelector(
    (state) => state.backend.community
  );

  // // TODO: preload from DB
  const followings = useMemo(() => {
    return Array.from(new Set([...friends, ...following]));
  }, [friends, following]);

  return followings;
};
