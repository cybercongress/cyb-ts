import axios from 'axios';
import { CYBER } from './config';

export const getProposals = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/cosmos/gov/v1beta1/proposals`,
    });

    return response.data.proposals;
  } catch (error) {
    console.log('getProposals error', error);
    return [];
  }
};

export const getProposalsDetail = (id) =>
  new Promise((resolve) =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/cosmos/gov/v1beta1/proposals/${id}`,
    })
      .then((response) => {
        resolve(response.data.proposal);
      })
      .catch((e) => {})
  );

export const getStakingPool = () =>
  new Promise((resolve) =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/staking/pool`,
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((e) => {})
  );

export const getTallying = () =>
  new Promise((resolve) =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/parameters/tallying`,
    })
      .then((response) => {
        resolve(response.data.result);
      })
      .catch((e) => {})
  );

export const getProposer = async (id) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/proposals/${id}/proposer`,
    });
    return response.data.result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getMinDeposit = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/parameters/deposit`,
    });
    return response.data.result;
  } catch (error) {
    console.log('error :>> ', error);
    return null;
  }
};

export const getTableVoters = async (id, offset = 0, limit = 20) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${
        CYBER.CYBER_NODE_URL_LCD
      }/cosmos/tx/v1beta1/txs?pagination.offset=${
        offset * limit
      }&pagination.limit=${limit}&orderBy=ORDER_BY_DESC&events=proposal_vote.proposal_id%3D${id}`,
    });

    return response.data;
  } catch (error) {
    return [];
  }
};

export const getTallyingProposals = async (id) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/proposals/${id}/tally`,
    });
    return response.data.result;
  } catch (e) {
    console.log(e);
    return null;
  }
};

export const reduceTxsVoters = (txs) => {
  return txs.reduce((prevObj, item) => {
    const { txhash, timestamp } = item;
    const messagesItems = item.tx.body.messages.reduce(
      (mPrevObj, itemM) => ({ ...mPrevObj, ...itemM }),
      {}
    );
    return [...prevObj, { txhash, timestamp, ...messagesItems }];
  }, []);
};
