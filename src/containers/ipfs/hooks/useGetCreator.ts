import { useQuery } from '@tanstack/react-query';
import { CreatorCyberLink } from 'src/types/cyberLink';
import { Option } from 'src/types';
import { getCreator } from '../../../utils/search/utils';

function useGetCreator(cid: string) {
  const { data } = useQuery(
    ['useGetCreator', cid],
    async () => {
      return getCreator(cid);
    },
    {
      enabled: Boolean(cid),
    }
  );

  let creator: Option<CreatorCyberLink>;
  if (data?.tx_responses?.length > 0) {
    const { tx_responses: txResponses } = data;

    const { neuron, sender } = txResponses[0].tx.body.messages[0];
    const addressCreator = sender || neuron;

    const [{ timestamp }] = txResponses;

    creator = {
      address: addressCreator,
      timestamp,
    };
  }

  return {
    creator,
  };
}

export default useGetCreator;
