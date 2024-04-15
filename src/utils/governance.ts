import axios from 'axios';
import { GetTxsEventResponse } from 'cosmjs-types/cosmos/tx/v1beta1/service';
import { LCD_URL } from 'src/constants/config';

import { Cosmos as CosmosApi } from 'src/generated/Cosmos';
import { dataOrNull } from './axios';

const lcdCosmosApi = new CosmosApi({ baseURL: LCD_URL });

export const getProposals = async () => {
  const response = await lcdCosmosApi.proposals();

  return dataOrNull(response);
};

export const getProposalsDetail = (id: string) =>
  new Promise((resolve) => {
    lcdCosmosApi
      .proposal(id)
      .then((response) => {
        resolve(response.data.proposal);
      })
      .catch((e) => {
        console.error(e);
      });
  });

export const getStakingPool = () =>
  new Promise((resolve) => {
    lcdCosmosApi
      .pool()
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  });

export const getTallying = () =>
  new Promise((resolve) => {
    lcdCosmosApi
      .govParams('tallying')
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  });

export const getProposer = async (id) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/gov/proposals/${id}/proposer`,
    });
    return response.data.result;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const getMinDeposit = async () => {
  const response = await lcdCosmosApi.govParams('deposit');
  return response.data;
};

export const getTableVoters = async (id, offset = 0, limit = 20) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${LCD_URL}/cosmos/tx/v1beta1/txs?pagination.offset=${
        offset * limit
      }&pagination.limit=${limit}&orderBy=ORDER_BY_DESC&events=proposal_vote.proposal_id%3D${id}`,
    });
    const r: Omit<GetTxsEventResponse, 'txResponses'> & {
      tx_responses: GetTxsEventResponse['txResponses'];
    } = response.data;

    return r;
  } catch (error) {
    return null;
  }
};

export const getTallyingProposals = async (id: string) =>
  new Promise((resolve) => {
    lcdCosmosApi
      .tallyResult(id)
      .then((response) => {
        resolve(response.data);
      })
      .catch((e) => {
        console.error(e);
      });
  });

export const reduceTxsVoters = (txs) => {
  return txs.reduce((prevObj, item) => {
    const { txhash, timestamp } = item;
    const messagesItems = item.tx.body.messages.reduce((mPrevObj, value) => {
      let v = value;

      if (value['@type'] === '/cosmos.authz.v1beta1.MsgExec') {
        v = value.msgs?.[0];
      }

      return { ...mPrevObj, ...v };
    }, {});
    return [...prevObj, { txhash, timestamp, ...messagesItems }];
  }, []);
};
