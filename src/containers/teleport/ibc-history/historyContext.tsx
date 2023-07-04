/* eslint-disable */
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { db as dbIbcHistory } from './db';
import { HistoriesItem, StatusTx } from './HistoriesItem';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';
import useSetActiveAddress from 'src/hooks/useSetActiveAddress';
import { AccountValue } from 'src/types/defaultAccount';
import { Coin } from '@cosmjs/launchpad';
import { parseRawLog } from '@cosmjs/stargate/build/logs';
import { parseEvents } from '../utils';
import { SigningStargateClient } from '@cosmjs/stargate';
import { SigningCyberClient } from '@cybercongress/cyber-js';
import { Option } from 'src/types';
import { PromiseExtended } from 'dexie';
import { CYBER } from 'src/utils/config';
import { TxsType } from '../type';
import TracerTx from '../tx/TracerTx';
import networkList from 'src/utils/networkListIbc';

const findRpc = (chainId: string): Option<string> => {
  if (Object.prototype.hasOwnProperty.call(networkList, chainId)) {
    return networkList[chainId].rpc;
  }

  return undefined;
};

type HistoryContext = {
  ibcHistory: Option<HistoriesItem[]>;
  changeHistory: () => void;
  addHistoriesItem: (itemHistories: HistoriesItem) => void;
  pingTxsIbc: (
    cliet: SigningStargateClient | SigningCyberClient,
    uncommitedTx: UncommitedTx
  ) => void;
  useGetHistoriesItems: () => Option<PromiseExtended<HistoriesItem[]>>;
  updateStatusByTxHash: (txHash: string, status: StatusTx) => void;
  traceHistoryStatus: (item: HistoriesItem) => Promise<StatusTx>;
};

const valueContext = {
  ibcHistory: undefined,
  changeHistory: () => {},
  addHistoriesItem: () => {},
  pingTxsIbc: () => {},
  useGetHistoriesItems: () => {},
  updateStatusByTxHash: () => {},
  traceHistoryStatus: () => {},
};

export const HistoryContext = React.createContext<HistoryContext>(valueContext);

export const useIbcHistory = () => {
  const context = useContext(HistoryContext);

  return context;
};

const historiesItemsByAddress = (addressActive: AccountValue | null) => {
  if (addressActive) {
    return dbIbcHistory.historiesItems
      .where({ address: addressActive.bech32 })
      .toArray();
  }
  return [];
};

type UncommitedTx = {
  txHash: string;
  address: string;
  sourceChainId: string;
  destChainId: string;
  sender: string;
  recipient: string;
  createdAt: number;
  amount: Coin;
};

function HistoryContextProvider({ children }: { children: React.ReactNode }) {
  const [ibcHistory, setIbcHistory] =
    useState<Option<HistoriesItem[]>>(undefined);
  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const [update, setUpdate] = useState(0);
  const { addressActive } = useSetActiveAddress(defaultAccount);

  const traceHistoryStatus = async (item: HistoriesItem): Promise<StatusTx> => {
    if (
      item.status === StatusTx.COMPLETE ||
      item.status === StatusTx.REFUNDED
    ) {
      return item.status;
    }

    if (item.status === StatusTx.TIMEOUT) {
      const sourceChainId = findRpc(item.sourceChainId);
      if (!sourceChainId) return item.status;

      const txTracer = new TracerTx(sourceChainId, '/websocket');

      await txTracer.traceTx({
        'timeout_packet.packet_src_channel': item.sourceChannelId,
        'timeout_packet.packet_sequence': item.sequence,
      });

      txTracer.close();
      return StatusTx.REFUNDED;
    }

    const promises: Promise<any>[] = [];

    const destChainId = findRpc(item.destChainId);

    if (!destChainId) return item.status;

    const txTracer = new TracerTx(destChainId, '/websocket');

    promises.push(
      txTracer.traceTx({
        'recv_packet.packet_dst_channel': item.destChannelId,
        'recv_packet.packet_sequence': item.sequence,
      })
    );

    const result = await Promise.race(promises);

    if (result) {
      return StatusTx.COMPLETE;
    }

    return StatusTx.TIMEOUT;

    // if (item.timeoutTimestamp && item.timeoutTimestamp !== '0') {

    // }
  };

  const useGetHistoriesItems = useCallback(() => {
    if (addressActive) {
      return dbIbcHistory.historiesItems
        .where({
          address: addressActive.bech32,
        })
        .toArray();
    }
    return undefined;
  }, [addressActive]);

  useEffect(() => {
    const getItem = async () => {
      if (addressActive) {
        const response = await dbIbcHistory.historiesItems
          .where({
            address: addressActive.bech32,
          })
          .toArray();
        if (response) {
          setIbcHistory(response.reverse());
        }
      }
    };
    getItem();
  }, [addressActive, update]);

  const pingTxsIbc = async (
    cliet: SigningStargateClient | SigningCyberClient,
    uncommitedTx: UncommitedTx
  ) => {
    const ping = async () => {
      const response = await cliet.getTx(uncommitedTx.txHash);
      if (response) {
        const result = parseRawLog(response.rawLog);
        const dataFromEvent = parseEvents(result);
        if (dataFromEvent) {
          const itemHistories = { ...uncommitedTx, ...dataFromEvent };
          addHistoriesItem({
            ...itemHistories,
            status: StatusTx.PENDING,
          });
        }
        return;
      }
      setTimeout(ping, 1500);
    };
    ping();
  };

  const addHistoriesItem = (itemHistories: HistoriesItem) => {
    dbIbcHistory.historiesItems.add(itemHistories);
    setUpdate((item) => item + 1);
  };

  const updateStatusByTxHash = async (txHash: string, status: StatusTx) => {
    const itemCollection = dbIbcHistory.historiesItems.where({ txHash });
    const itemByTxHash = await itemCollection.toArray();
    if (itemByTxHash && itemByTxHash[0].status !== status) {
      itemCollection.modify({ status });
    }
  };

  const changeHistory = () => {
    // console.log('history', history);
    // setValue((item) => ({ ...item, history: { ...item.history, history } }));
  };

  return (
    <HistoryContext.Provider
      value={{
        ibcHistory,
        changeHistory,
        addHistoriesItem,
        pingTxsIbc,
        useGetHistoriesItems,
        updateStatusByTxHash,
        traceHistoryStatus,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

export default HistoryContextProvider;
