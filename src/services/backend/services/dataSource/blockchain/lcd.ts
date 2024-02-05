/* eslint-disable no-await-in-loop */
import axios from 'axios';
import { T } from 'ramda';
import { CyberlinkTxHash, NeuronAddress, ParticleCid } from 'src/types/base';
import { CID_TWEET } from 'src/utils/consts';
import { dateToNumber } from 'src/utils/date';
import { fetchIterable } from './utils/fetch';

const PAGINATION_LIMIT = 10;

async function getTransactions(
  cyberLcdUrl: string,
  events: any,
  pagination = { limit: 20, offset: 0 },
  orderBy = 'ORDER_BY_UNSPECIFIED'
) {
  const { offset, limit } = pagination;
  const response = axios.get(`${cyberLcdUrl}/cosmos/tx/v1beta1/txs`, {
    params: {
      'pagination.offset': offset,
      'pagination.limit': limit,
      orderBy,
      events: events.map((evn) => `${evn.key}='${evn.value}'`),
    },
    paramsSerializer: {
      indexes: null,
    },
  });
  return response;
}

const fetchLinkByNeuron = async (
  cyberLcdUrl: string,
  {
    address,
    from,
    offset = 0,
  }: { address: NeuronAddress; from: ParticleCid; offset: number }
) => {
  const events = [
    {
      key: 'cyberlink.particleFrom',
      value: from,
    },
    {
      key: 'cyberlink.neuron',
      value: address,
    },
  ];
  const response = await getTransactions(
    cyberLcdUrl,
    events,
    { limit: PAGINATION_LIMIT, offset },
    'ORDER_BY_DESC'
  );
  //   console.log('-----req', address, offset, response?.request?.responseURL);

  const links: CyberlinkTxHash[] = [];

  response.data.tx_responses.forEach((item) => {
    const {
      txhash,
      timestamp,
      tx: {
        body: { messages },
      },
    } = item;
    messages.forEach((msg) => {
      msg.links.forEach((l) => {
        links.push({
          from: l.from,
          to: l.to,
          neuron: address,
          timestamp: dateToNumber(timestamp),
          transaction_hash: txhash,
        });
      });
    });
  });

  return links;
};

const fetchLinksByNeuronTimestampIterable = (
  cyberLcdUrl: string,
  address: NeuronAddress,
  fromParticle: ParticleCid,
  timestamp: number
) =>
  fetchIterable(fetchLinkByNeuron, cyberLcdUrl, {
    address,
    timestamp,
    from: fromParticle,
  });

// eslint-disable-next-line import/prefer-default-export
export const fetchLinksByNeuronTimestamp = async (
  cyberLcdUrl: string,
  address: NeuronAddress,
  from: ParticleCid,
  timestamp: number
) => {
  const result = [];
  while (true) {
    try {
      const items = await fetchLinkByNeuron(cyberLcdUrl, {
        address,
        from,
        offset: result.length,
      });

      const partialItems = items.filter((i) => timestamp <= i.timestamp);
      result.push(...partialItems);

      if (
        items.length === 0 ||
        timestamp >= items[0].timestamp ||
        items.length < PAGINATION_LIMIT
      ) {
        break;
      }
    } catch (e) {
      console.log(`>>x ${address} from: ${from} ts: ${timestamp}`);
      break;
    }
  }
  return result;
};
