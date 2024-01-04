import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { getSendBySenderRecipient } from 'src/utils/search/utils';
import { Nullable, Option } from 'src/types';
import { AccountValue } from 'src/types/defaultAccount';
import { useCallback, useEffect, useState } from 'react';
import { TxsResponse } from '@cosmjs/launchpad';
import { PATTERN_CYBER } from '../../../utils/config';

const limit = 5;

const concatResponse = (arr: undefined | InfiniteData<{ data: any }>) => {
  return (
    arr?.pages?.reduce((acc, page) => {
      return acc.concat(page.data.tx_responses);
    }, []) || []
  );
};

function useGetSendBySenderRecipient(
  addressSender: Option<string>,
  addressRecipient: Option<string>,
  callBack?: React.Dispatch<React.SetStateAction<number>>
) {
  const data = useInfiniteQuery(
    ['getSendBySenderRecipient', addressSender, addressRecipient],
    async ({ pageParam = 0 }) => {
      const address = {
        sender: addressSender,
        recipient: addressRecipient,
      };

      const offset = new BigNumber(limit).multipliedBy(pageParam).toNumber();

      const response = await getSendBySenderRecipient(address, offset, limit);

      if (callBack && offset === 0 && response) {
        callBack(response.pagination.total);
      }

      return {
        data: response,
        page: pageParam,
      };
    },
    {
      enabled:
        Boolean(addressSender) &&
        Boolean(addressSender?.match(PATTERN_CYBER)) &&
        Boolean(addressRecipient) &&
        Boolean(addressRecipient?.match(PATTERN_CYBER)),
      getNextPageParam: (lastPage) => {
        const {
          page,
          data: {
            pagination: { total },
          },
        } = lastPage;

        if (!total || (page + 1) * limit >= total) {
          return undefined;
        }

        return page + 1;
      },
    }
  );

  return {
    data: data.data,
    fetchNextPage: data.fetchNextPage,
    refetch: data.refetch,
    hasNextPage: data.hasNextPage,
  };
}

function useGetSendTxsByAddressByLcd(
  sender: Nullable<AccountValue>,
  addressRecipient: Option<string>
) {
  const [addressSender, setAddressSender] = useState<Option<string>>();
  const [dataTsx, setDataTxs] = useState<Option<TxsResponse[]>>(undefined);

  const {
    data: dataSend,
    refetch: refetchSend,
    fetchNextPage: fetchNextPageSend,
    hasNextPage: hasNextPageSend,
  } = useGetSendBySenderRecipient(addressSender, addressRecipient);
  const {
    data: dataReceive,
    refetch: refetchReceive,
    fetchNextPage: fetchNextPageReceive,
    hasNextPage: hasNextPageReceive,
  } = useGetSendBySenderRecipient(addressRecipient, addressSender);

  useEffect(() => {
    let firstSendItem = '0';
    let lastSendItem = '0';
    const dataSendArr: TxsResponse[] = concatResponse(dataSend);
    const dataReceiveArr: TxsResponse[] = concatResponse(dataReceive);

    let dataTxs: TxsResponse[] = [];

    if (dataSendArr.length) {
      lastSendItem = dataSendArr[dataSendArr.length - 1].height;
      firstSendItem = dataSendArr[0].height;
    }

    if (dataSendArr.length && dataReceiveArr.length) {
      dataReceiveArr.forEach((item) => {
        const height = parseFloat(item.height);
        if (height > parseFloat(firstSendItem)) {
          dataTxs.push(item);
        }

        if (
          height > parseFloat(lastSendItem) &&
          height < parseFloat(firstSendItem)
        ) {
          dataTxs.push(item);
        }

        if (height < parseFloat(lastSendItem)) {
          dataTxs.push(item);
        }
      });
      dataTxs = [...dataTxs, ...dataSendArr];
      dataTxs = dataTxs.sort(
        (itemA, itemB) => parseFloat(itemB.height) - parseFloat(itemA.height)
      );
    } else {
      dataTxs = [...dataSendArr, ...dataReceiveArr];
    }

    setDataTxs(dataTxs);
  }, [dataSend, dataReceive]);

  useEffect(() => {
    if (sender) {
      setAddressSender(sender.bech32);
    }
  }, [sender]);

  const fetchNextPage = useCallback(() => {
    fetchNextPageSend();
    fetchNextPageReceive();
  }, [fetchNextPageSend, fetchNextPageReceive]);

  const refetch = useCallback(() => {
    refetchSend();
    refetchReceive();
  }, [refetchSend, refetchReceive]);

  return {
    data: dataTsx,
    fetchNextPage,
    refetch,
    hasNextPage: Boolean(hasNextPageSend || hasNextPageReceive),
  };
}

export default useGetSendTxsByAddressByLcd;
