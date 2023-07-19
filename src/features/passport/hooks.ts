import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import { useQueryClient } from 'src/contexts/queryClient';
import { getPassport } from './passports.redux';
import { PATTERN_CYBER } from 'src/utils/config';

type Props = {
  address: string | null;
};

// add 'refresh' prop
function usePassportByAddress(address: Props['address']) {
  const passports = useSelector((state: RootState) => state.passports);
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

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
