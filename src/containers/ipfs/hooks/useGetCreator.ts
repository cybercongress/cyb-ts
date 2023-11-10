import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Option } from 'src/types';
import { CreatorCyberLink } from 'src/types/cyberLink';
import { getCreator } from '../../../utils/search/utils';

function useGetCreator(cid) {
  const { data } = useQuery(
    ['useGetCreator', cid],
    async () => {
      return getCreator(cid);
    },
    {
      enabled: Boolean(cid),
    }
  );
  const [creator, setCreator] = useState<Option<CreatorCyberLink>>(undefined);

  useEffect(() => {
    const getCreatorFunc = async () => {
      if (data && data.tx_responses && data.tx_responses.length > 0) {
        const { tx_responses: txResponses } = data;
        let addressCreator = '';

        if (txResponses[0].tx.body.messages[0].neuron) {
          addressCreator = txResponses[0].tx.body.messages[0].neuron;
        }

        if (txResponses[0].tx.body.messages[0].sender) {
          addressCreator = txResponses[0].tx.body.messages[0].sender;
        }

        const [{ timestamp }] = txResponses;

        setCreator({
          address: addressCreator,
          timestamp,
        });
      }
    };
    getCreatorFunc();
  }, [data]);

  return { creator };
}

export default useGetCreator;
