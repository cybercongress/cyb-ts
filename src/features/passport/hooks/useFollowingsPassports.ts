import { useEffect } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';
import { selectFollowings } from 'src/redux/features/currentAccount';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import {
  getFollowingsPassports,
  selectFollowingsPassports,
} from '../passports.redux';

function useFollowingsPassports() {
  const queryClient = useQueryClient();

  const followings = useAppSelector(selectFollowings);
  const followingsPassports = useAppSelector(selectFollowingsPassports);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!queryClient) {
      return;
    }

    dispatch(getFollowingsPassports(queryClient));
  }, [queryClient, dispatch, followings]);

  return followingsPassports;
}

export default useFollowingsPassports;
