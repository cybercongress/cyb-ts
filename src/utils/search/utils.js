import axios from 'axios';
import { indexedNode } from '../config';

const IPFS = require('ipfs-api');

const Unixfs = require('ipfs-unixfs');
const { DAGNode, util: DAGUtil } = require('ipld-dag-pb');

const nodeUrl = indexedNode;

let ipfsApi;

const getIpfsConfig = async () => {
  if (window.getIpfsConfig) {
    return window.getIpfsConfig();
  }

  return {
    host: 'localhost',
    port: 5001,
    protocol: 'http',
  };
};

export const initIpfs = async () => {
  if (ipfsApi) {
    return;
  }

  const ipfsConfig = await getIpfsConfig();

  ipfsApi = new IPFS(ipfsConfig);
};

const getIpfs = async () => {
  if (ipfsApi) {
    return ipfsApi;
  }

  await initIpfs();

  return ipfsApi;
};

export const getContentByCid = (cid, timeout) =>
  getIpfs().then(ipfs => {
    const timeoutPromise = () =>
      new Promise((resolve, reject) => {
        setTimeout(reject, timeout, 'ipfs get timeout');
      });

    const ipfsGetPromise = () =>
      new Promise((resolve, reject) => {
        ipfs.get(cid, (error, files) => {
          if (error) {
            reject(error);
          }

          const buf = files[0].content;

          resolve(buf.toString());
        });
      });

    return Promise.race([timeoutPromise(), ipfsGetPromise()]);
  });

export const formatNumber = (number, toFixed) => {
  let formatted = +number;

  if (toFixed) {
    formatted = +formatted.toFixed(toFixed);
  }

  return formatted.toLocaleString('en').replace(/,/g, ' ');
};

export const getIpfsHash = string =>
  new Promise((resolve, reject) => {
    const unixFsFile = new Unixfs('file', Buffer.from(string));

    const buffer = unixFsFile.marshal();
    DAGNode.create(buffer, (err, dagNode) => {
      if (err) {
        reject(new Error('Cannot create ipfs DAGNode'));
      }

      DAGUtil.cid(dagNode, (error, cid) => {
        resolve(cid.toBaseEncodedString());
      });
    });
  });

export const search = async keywordHash =>
  axios({
    method: 'get',
    url: `${indexedNode}/api/search?cid=%22${keywordHash}%22&page=0&perPage=10`,
  }).then(response => (response.data.result ? response.data.result.cids : []));

export const getRankGrade = rank => {
  let from;
  let to;
  let value;

  switch (true) {
    case rank > 0.01:
      from = 0.01;
      to = 1;
      value = 1;
      break;
    case rank > 0.001:
      from = 0.001;
      to = 0.01;
      value = 2;
      break;
    case rank > 0.000001:
      from = 0.000001;
      to = 0.001;
      value = 3;
      break;
    case rank > 0.0000000001:
      from = 0.0000000001;
      to = 0.000001;
      value = 4;
      break;
    case rank > 0.000000000000001:
      from = 0.000000000000001;
      to = 0.0000000001;
      value = 5;
      break;
    case rank > 0.0000000000000000001:
      from = 0.0000000000000000001;
      to = 0.000000000000001;
      value = 6;
      break;
    case rank > 0:
      from = 0;
      to = 0.0000000000000000001;
      value = 7;
      break;
    default:
      from = 'n/a';
      to = 'n/a';
      value = 'n/a';
      break;
  }

  return {
    from,
    to,
    value,
  };
};

export const getStatistics = () =>
  new Promise(resolve => {
    const indexStatsPromise = axios({
      method: 'get',
      url: `${nodeUrl}/api/index_stats`,
    }).then(response => response.data.result);

    const stakingPromise = axios({
      method: 'get',
      url: `${nodeUrl}/api/staking/pool`,
    }).then(response => response.data.result);

    const bandwidthPricePromise = axios({
      method: 'get',
      url: `${nodeUrl}/api/current_bandwidth_price`,
    }).then(response => response.data.result);

    const latestBlockPromise = axios({
      method: 'get',
      url: `${nodeUrl}/api/block`,
    }).then(response => response.data.result);

    const supplyTotalPropsise = axios({
      method: 'get',
      url: `${nodeUrl}/lcd/supply/total`,
    }).then(response => response.data.result);

    Promise.all([
      indexStatsPromise,
      stakingPromise,
      bandwidthPricePromise,
      latestBlockPromise,
      supplyTotalPropsise,
    ]).then(
      ([indexStats, staking, bandwidthPrice, latestBlock, supplyTotal]) => {
        const response = {
          ...indexStats,
          bondedTokens: staking.bonded_tokens,
          bandwidthPrice: bandwidthPrice.price,
          txCount: latestBlock.block_meta.header.total_txs,
          supplyTotal: supplyTotal[0].amount,
        };

        resolve(response);
      }
    );
  });

export const getValidators = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${nodeUrl}/api/validators`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );
