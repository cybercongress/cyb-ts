import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../../context';
import { getCreator } from '../../../utils/search/utils';

function useGetCreator(cid) {
  const { jsCyber } = useContext(AppContext);
  const [creator, setCreator] = useState({
    address: '',
    timestamp: '',
  });

  useEffect(() => {
    const getCreatorFunc = async () => {
      if (jsCyber !== null) {
        const response = await getCreator(cid);

        if (
          response !== null &&
          response.tx_responses &&
          response.tx_responses.length > 0
        ) {
          const { tx_responses: txResponses } = response;
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
      }
    };
    getCreatorFunc();
  }, [jsCyber, cid]);

  return { creator };
}

export default useGetCreator;
