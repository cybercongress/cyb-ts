import { useEffect } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { PATTERN_CYBER } from 'src/utils/config';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { getPassport } from '../passports.redux';

type Props = {
  address: string | null | undefined;
};

// add 'refresh' prop
function usePassportByAddress(
  address: Props['address'],
  {
    skip,
  }: {
    skip?: boolean;
  } = { skip: false }
) {
  const queryClient = useQueryClient();

  const currentPassport = useAppSelector((state) =>
    address ? state.passports[address] : null
  );
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (
      !queryClient ||
      !address ||
      skip ||
      (currentPassport && currentPassport.loading)
    ) {
      return;
    }

    if (!address.match(PATTERN_CYBER)) {
      return;
    }

    if (!currentPassport || currentPassport.data === undefined) {
      dispatch(getPassport({ address, queryClient }));
    }
  }, [address, queryClient, dispatch, currentPassport, skip]);

  const data = currentPassport?.data;

  return {
    // TODO: remove 'passport' prop
    passport: data,
    data,
    loading: currentPassport?.loading || false,
    // error: null,
  };
}

export default usePassportByAddress;
