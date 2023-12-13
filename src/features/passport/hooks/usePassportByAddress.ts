import { useEffect } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { PATTERN_CYBER } from 'src/utils/config';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getPassport } from '../passports.redux';

type Props = {
  address: string | null | undefined;
};

// add 'refresh' prop
function usePassportByAddress(address: Props['address']) {
  const queryClient = useQueryClient();

  const passports = useAppSelector((state) => state.passports);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!queryClient || !address) {
      return;
    }

    if (!address.match(PATTERN_CYBER)) {
      return;
    }

    if (!passports[address]) {
      dispatch(getPassport({ address, queryClient }));
    }
  }, [address, queryClient, dispatch, passports]);

  const { data, loading } = (address && passports[address]) || {};

  return {
    passport: data,
    loading,
    // error: null,
  };
}

export default usePassportByAddress;
