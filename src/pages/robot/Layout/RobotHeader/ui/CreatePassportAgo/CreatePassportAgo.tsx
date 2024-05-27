import { useMemo } from 'react';
import useGetTimeCreatePassport from './api/api';

type Props = {
  address: string;
  nickname?: string;
};

function CreatePassportAgo({ address, nickname }: Props) {
  const data = useGetTimeCreatePassport(address);

  const time = useMemo(() => {
    let timestamp;
    if (!data || !nickname) {
      return timestamp;
    }

    timestamp = data.filter((item) => {
      console.log('item', item);
      return '';
    });

    return timestamp;
  }, [data, nickname]);

  return <div>CreatePassportAgo</div>;
}

export default CreatePassportAgo;
