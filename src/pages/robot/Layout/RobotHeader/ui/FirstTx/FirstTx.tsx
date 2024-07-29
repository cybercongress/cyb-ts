import { useMemo } from 'react';
import { Time } from 'src/components';
import BigNumber from 'bignumber.js';
import { getNowUtcNumber } from 'src/utils/date';
import { Link } from 'react-router-dom';
import useGetTimeCreatePassport from './api/api';

type Props = {
  address: string;
};

function FirstTx({ address }: Props) {
  const data = useGetTimeCreatePassport(address);

  const time = useMemo(() => {
    if (!data) {
      return undefined;
    }

    const timestamp = data?.tx_responses[0].timestamp as string | undefined;

    if (!timestamp) {
      return undefined;
    }

    return new BigNumber(getNowUtcNumber())
      .minus(Date.parse(timestamp))
      .toNumber();
  }, [data]);

  if (!time) {
    return null;
  }

  return (
    <Link to="./time">
      <Time msTime={time} />
    </Link>
  );
}

export default FirstTx;
