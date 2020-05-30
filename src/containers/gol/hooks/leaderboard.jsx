import React, { useState, useEffect, useMemo } from 'react';
import {
  getGraphQLQuery,
  getIndexStats,
  getAllValidators,
} from '../../../utils/search/utils';
import { DISTRIBUTION, TAKEOFF } from '../../../utils/config';
import { getDelegator } from '../../../utils/utils';

const GET_LOAD = `
query MyQuery {
  karma_view(order_by: {karma: desc}) {
    karma
    subject
  }
}
`;

const GET_LIFETIME = `
  query MyQuery {
    pre_commit_view(order_by: {precommits: desc}, limit: 50, offset: 0) {
      consensus_pubkey
      precommits
    }
    pre_commit_view_aggregate {
      aggregate {
        sum {
          precommits
        }
      }
    }
  }
  `;

function setLeaderboard(amount) {
  const [data, setData] = useState({});
  const [dataLoad, setDataLoad] = useState({});

  const getLoad = async amountTakeoff => {
    let load = [];
    const currentPrize = Math.floor(
      (DISTRIBUTION.load / TAKEOFF.ATOMsALL) * amountTakeoff
    );
    const dataGraphQLQuery = await getGraphQLQuery(GET_LOAD);
    const responseIndexStats = await getIndexStats();
    const sumKarma = responseIndexStats.totalKarma;
    if (Object.keys(dataGraphQLQuery).length > 0) {
      load = dataGraphQLQuery.karma_view;
    }
    const loadObj = await load.reduce((obj, item) => {
      const cybWon =
        (parseFloat(item.karma) / parseFloat(sumKarma)) * currentPrize;
      return {
        ...obj,
        [item.subject]: {
          address: item.subject,
          cybWon,
        },
      };
    }, {});
    setDataLoad(loadObj);
  };

  const getDelegation = async (validators, total, dataV) => {
    const currentPrize = Math.floor(
      (DISTRIBUTION.delegation / TAKEOFF.ATOMsALL) * amount
    );
    const tempData = dataV;
    if (validators.length > 0 && Object.keys(tempData).length > 0) {
      validators.forEach(item => {
        const cyb = (item.tokens / total) * currentPrize;
        if (tempData[item.cyberAddress]) {
          tempData[item.cyberAddress] = {
            getDelegation: 0,
            ...tempData[item.cyberAddress],
            cybWon: tempData[item.cyberAddress].cybWon + cyb,
          };
        } else {
          tempData[item.cyberAddress] = {
            getDelegation: 0,
            address: item.cyberAddress,
            cybWon: cyb,
          };
        }
      });
      // setData(tempData);
      setData(temp => ({ ...temp, ...tempData }));
    }
  };

  const getLifetime = async (validators, dataV) => {
    const currentPrize = Math.floor(
      (DISTRIBUTION.lifetime / TAKEOFF.ATOMsALL) * amount
    );
    const dataGraphQL = await getGraphQLQuery(GET_LIFETIME);
    const tempData = dataV;
    if (Object.keys(dataGraphQL.pre_commit_view).length > 0) {
      const sumPrecommits =
        dataGraphQL.pre_commit_view_aggregate.aggregate.sum.precommits;
      const dataPreCommit = dataGraphQL.pre_commit_view;
      dataPreCommit.forEach((itemQ, index) => {
        const cyb = (itemQ.precommits / sumPrecommits) * currentPrize;
        validators.forEach(itemRPC => {
          if (itemRPC.consensusPubkey === itemQ.consensus_pubkey) {
            if (tempData[itemRPC.cyberAddress]) {
              tempData[itemRPC.cyberAddress] = {
                cybLifeTime: 0,
                ...tempData[itemRPC.cyberAddress],
                cybWon: tempData[itemRPC.cyberAddress].cybWon + cyb,
              };
            }
          }
        });
      });
      setData(temp => ({ ...temp, ...tempData }));
      // console.log(tempData);
    }
  };

  useEffect(() => {
    const feachData = async () => {
      if (amount > 0) {
        await getLoad(amount);
      }
    };
    feachData();
  }, [amount]);

  useEffect(() => {
    const feachData = async () => {
      if (Object.keys(dataLoad).length > 0) {
        const dataValidators = await getAllValidators();
        let total = 0;
        const validators = [];
        if (dataValidators !== null) {
          dataValidators.forEach(item => {
            const cyberAddress = getDelegator(item.operator_address, 'cyber');
            total += parseFloat(item.tokens);
            validators.push({
              tokens: item.tokens,
              operatorAddress: item.operator_address,
              moniker: item.description.moniker,
              consensusPubkey: item.consensus_pubkey,
              cyberAddress,
            });
          });
        }
        getDelegation(validators, total, dataLoad);
        getLifetime(validators, dataLoad);
      }
    };
    feachData();
  }, [dataLoad]);

  return data;
}

export default setLeaderboard;
