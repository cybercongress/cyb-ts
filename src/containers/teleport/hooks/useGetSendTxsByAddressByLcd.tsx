import { useInfiniteQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { getSendBySenderRecipient } from 'src/utils/search/utils';
import { Nullable, Option } from 'src/types';
import { AccountValue } from 'src/types/defaultAccount';
import { useEffect, useState } from 'react';
import { PATTERN_CYBER } from '../../../utils/config';

const limit = 5;

const diff = (key, ...arrays) =>
  [].concat(
    ...arrays.map((arr, i) => {
      const others = arrays.slice(0);
      others.splice(i, 1);
      const unique = [...new Set([].concat(...others))];
      return arr.filter(
        (x) => !unique.some((y) => parseFloat(x[key]) === parseFloat(y[key]))
      );
    })
  );

function useGetSendTxsByAddressByLcd(
  sender: Nullable<AccountValue>,
  addressRecipient: string
) {
  const [addressSender, setAddressSender] = useState<Option<string>>();

  const {
    status,
    data,
    error,
    isFetching,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery(
    ['getSendBySenderRecipient', addressSender, addressRecipient],
    async ({ pageParam = 0 }) => {
      const addressSend = {
        recipient: addressRecipient,
        sender: addressSender,
      };
      const addressRecive = {
        recipient: addressSender,
        sender: addressRecipient,
      };
      const offset = new BigNumber(limit).multipliedBy(pageParam).toNumber();

      const resSend = await getSendBySenderRecipient(
        addressSend,
        offset,
        limit
      );
      const resRecive = await getSendBySenderRecipient(
        addressRecive,
        offset,
        limit
      );

      const lastSendItem =
        resSend.tx_responses[resSend.tx_responses.length - 1];
      const firstReciveItem = resRecive.tx_responses[0];
      console.log('lastSend', lastSendItem);
      console.log('firstRecive', firstReciveItem);

      const diffArr = diff(
        'height',
        resSend.tx_responses,
        resRecive.tx_responses
      );

      console.log('resSend', resSend);
      console.log('resRecive', resRecive);
      console.log('diffArr', diffArr);
      return { data: [], page: pageParam };
    },
    {
      enabled:
        Boolean(addressSender) &&
        Boolean(addressSender?.match(PATTERN_CYBER)) &&
        Boolean(addressRecipient) &&
        Boolean(addressRecipient?.match(PATTERN_CYBER)),
      getNextPageParam: (lastPage) => {
        if (lastPage.data && lastPage.data.length === 0) {
          return undefined;
        }

        const nextPage = lastPage.page !== undefined ? lastPage.page + 1 : 0;
        return nextPage;
      },
    }
  );

  useEffect(() => {
    if (sender) {
      setAddressSender(sender.bech32);
    }
  }, [sender]);
}

export default useGetSendTxsByAddressByLcd;
