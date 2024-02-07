import { useEffect, useRef } from 'react';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getSenseList, reset } from '../redux/sense.redux';
import { useBackend } from 'src/contexts/backend';

function useSenseManager() {
  const currentAddress = useAppSelector(selectCurrentAddress);
  const dispatch = useAppDispatch();

  const lastAddress = useRef<string>();
  const { senseApi } = useBackend();

  useEffect(() => {
    if (!currentAddress) {
      return;
    }

    if (lastAddress.current && lastAddress.current !== currentAddress) {
      dispatch(reset());
    }

    lastAddress.current = currentAddress;

    if (senseApi) {
      dispatch(getSenseList(senseApi));
    }
  }, [currentAddress, dispatch, senseApi]);

  return null;
}

export default useSenseManager;
