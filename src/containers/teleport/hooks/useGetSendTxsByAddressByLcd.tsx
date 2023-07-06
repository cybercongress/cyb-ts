import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query';
import BigNumber from 'bignumber.js';
import { getSendBySenderRecipient } from 'src/utils/search/utils';
import { Nullable, Option } from 'src/types';
import { AccountValue } from 'src/types/defaultAccount';
import { useCallback, useEffect, useState } from 'react';
import { SearchTxsResponse, TxsResponse } from '@cosmjs/launchpad';
import { PATTERN_CYBER } from '../../../utils/config';

const limit = 5;

const concatResponse = (arr: InfiniteData<{ data: any }>) => {
  return [].concat(
    ...arr.pages.map((item) => {
      return item.data;
    })
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
        data: response ? response.tx_responses : [],
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
        if (lastPage.data && lastPage.data.length === 0) {
          return undefined;
        }

        const nextPage = lastPage.page !== undefined ? lastPage.page + 1 : 0;
        return nextPage;
      },
    }
  );

  return { ...data };
}

function useGetSendTxsByAddressByLcd(
  sender: Nullable<AccountValue>,
  addressRecipient: string
) {
  const [addressSender, setAddressSender] = useState<Option<string>>();
  const [data, setData] = useState<Option<TxsResponse[]>>(undefined);
  const [totalSend, setTotalSend] = useState(0);
  const [totalReceive, setTotalReceive] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(true);

  const dataSend = useGetSendBySenderRecipient(
    addressSender,
    addressRecipient,
    setTotalSend
  );

  const dataReceive = useGetSendBySenderRecipient(
    addressRecipient,
    addressSender,
    setTotalReceive
  );

  useEffect(() => {
    setHasNextPage(true);
    let firstSendItem = '0';
    let lastSendItem = '0';
    let dataSendArr: TxsResponse[] = [];
    let dataReceiveArr: TxsResponse[] = [];

    let dataTxs: TxsResponse[] = [];

    if (dataSend.data && dataSend.data.pages.length) {
      dataSendArr = concatResponse(dataSend.data);
      if (dataSendArr.length) {
        lastSendItem = dataSendArr[dataSendArr.length - 1].height;
        firstSendItem = dataSendArr[0].height;
      }
    }

    if (dataReceive.data && dataReceive.data.pages.length) {
      dataReceiveArr = concatResponse(dataReceive.data);
      // firstReceiveItem = dataReceiveArr[0].height;
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

        if (
          height < parseFloat(lastSendItem) &&
          totalSend === dataSendArr.length
        ) {
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

    setData(dataTxs);

    const total = new BigNumber(totalReceive).plus(totalSend).toNumber();

    if (total === dataTxs.length) {
      setHasNextPage(false);
    }
  }, [dataSend.data, dataReceive.data, totalSend, totalReceive]);

  useEffect(() => {
    if (sender) {
      setAddressSender(sender.bech32);
    }
  }, [sender]);

  const fetchNextPage = useCallback(() => {
    dataSend.fetchNextPage();
    dataReceive.fetchNextPage();
  }, [dataSend, dataReceive]);

  const refetch = useCallback(() => {
    dataSend.refetch();
    dataReceive.refetch();
  }, [dataSend, dataReceive]);

  return { data, fetchNextPage, refetch, hasNextPage };
}

export default useGetSendTxsByAddressByLcd;
