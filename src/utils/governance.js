import axios from 'axios';
import { CYBER } from './config';

export const getProposals = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/proposals`,
    });

    return response.data.result;
  } catch (error) {
    console.log('getProposals error', error);
    return [];
  }
};

export const getProposalsDetail = id =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/proposals/${id}`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getStakingPool = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/staking/pool`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getTallying = () =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/parameters/tallying`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getProposer = id =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/proposals/${id}/proposer`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getProposalsDetailVotes = id =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/proposals/${id}/votes`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

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

export const getTableVoters = id =>
  new Promise(resolve =>
    axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/gov/proposals/${id}/votes`,
    })
      .then(response => {
        resolve(response.data.result);
      })
      .catch(e => {})
  );

export const getTallyingProposals = async id => {
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
