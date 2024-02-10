import { SyncServiceParams } from '../../types';

export const changeMyAddress = (
  currentParams: SyncServiceParams | undefined,
  newParams: SyncServiceParams,
  restart: () => void
) => {
  if (
    currentParams?.myAddress &&
    currentParams?.myAddress !== newParams.myAddress
  ) {
    restart();
  }
  return newParams;
};
