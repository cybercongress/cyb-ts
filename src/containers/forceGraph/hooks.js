import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
// import { useSubscription } from '@apollo/react-hooks';
import { useIpfs } from 'src/contexts/ipfs';
import QUERY_GET_FOLLOWERS from './query';
import getIndexdDb from './utils';

const useGetDataGql = () => {
  const { node } = useIpfs();
  const { data: dataGql, loading: loadingGql } = useQuery(QUERY_GET_FOLLOWERS);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!loadingGql && node !== null) {
      if (dataGql !== null && dataGql.cyberlinks) {
        const { cyberlinks } = dataGql;

        cyberlinks.forEach(async (item) => {
          const response = await getIndexdDb(item.particle_to, node);
          if (response && response !== null) {
            setData((itemData) => [
              ...itemData,
              {
                to: response,
                subject: item.neuron,
                txhash: item.transaction_hash,
              },
            ]);
          }
        });
      }
    }
  }, [dataGql, loadingGql, node]);

  return { data };
};

export default useGetDataGql;
