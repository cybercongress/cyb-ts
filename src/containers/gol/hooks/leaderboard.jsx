/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import {
  getGraphQLQuery,
  getIndexStats,
  getAllValidators,
} from '../../../utils/search/utils';
import {
  DISTRIBUTION,
  TAKEOFF,
  DISTRIBUTION_PRIZE,
  COSMOS,
} from '../../../utils/config';
import { fromBech32 } from '../../../utils/utils';

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

const GET_RELEVANCE = `
query getRelevanceLeaderboard {
  relevance_leaderboard {
    subject
    share
  }
}
`;

const GET_TAKEOFF = `
  query takeoff {
    takeoff_leaderboard {
      cybs
      donors
    }
  }
`;

function setLeaderboard() {
  const [data, setData] = useState({});
  const [progress, setProgress] = useState(0);
  const [dataLoad, setDataLoad] = useState({});
  const [amount, setAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [discipline, setDiscipline] = useState({
    lifetime: false,
    delegation: false,
    takeoff: false,
    load: false,
    relevance: false,
  });

  const getLoad = async (amountTakeoff) => {
    let load = [];
    const currentPrize = DISTRIBUTION_PRIZE.load;
    const dataGraphQLQuery = await getGraphQLQuery(GET_LOAD);
    const responseIndexStats = await getIndexStats();
    const sumKarma = responseIndexStats.totalKarma;
    if (Object.keys(dataGraphQLQuery).length > 0) {
      load = dataGraphQLQuery.karma_view;
    }
    const loadObj = await load.reduce((obj, item) => {
      const cybWon =
        (parseFloat(item.karma) / parseFloat(sumKarma)) * currentPrize;
      if (data[item.subject]) {
        data[item.subject] = {
          loadObj: cybWon,
          ...data[item.subject],
          cybWon: data[item.subject].cybWon + cybWon,
        };
      } else {
        data[item.subject] = {
          address: item.subject,
          cybWon,
          loadObj: cybWon,
        };
      }
      return {
        ...obj,
        [item.subject]: {
          address: item.subject,
          cybWon,
          loadObj: cybWon,
        },
      };
    }, {});
    setDiscipline((item) => ({
      ...item,
      load: true,
    }));
    setDataLoad(loadObj);
    setProgress(50);
  };

  const getDelegation = async (validators, total, dataV) => {
    const currentPrize = DISTRIBUTION_PRIZE.delegation;
    if (validators.length > 0) {
      validators.forEach((item) => {
        const cyb = (item.tokens / total) * currentPrize;
        if (data[item.cyberAddress]) {
          data[item.cyberAddress] = {
            getDelegation: cyb,
            ...data[item.cyberAddress],
            cybWon: data[item.cyberAddress].cybWon + cyb,
          };
        } else {
          data[item.cyberAddress] = {
            getDelegation: cyb,
            address: item.cyberAddress,
            cybWon: cyb,
          };
        }
      });
      setDiscipline((item) => ({
        ...item,
        delegation: true,
      }));
      // setData(tempData);
      // setData(temp => ({ ...temp, ...data }));
    }
  };

  const getLifetime = async (validators, dataV) => {
    const currentPrize = DISTRIBUTION_PRIZE.lifetime;
    const dataGraphQL = await getGraphQLQuery(GET_LIFETIME);
    if (Object.keys(dataGraphQL.pre_commit_view).length > 0) {
      const sumPrecommits =
        dataGraphQL.pre_commit_view_aggregate.aggregate.sum.precommits;
      const dataPreCommit = dataGraphQL.pre_commit_view;
      dataPreCommit.forEach((itemQ, index) => {
        const cyb = (itemQ.precommits / sumPrecommits) * currentPrize;
        validators.forEach((itemRPC) => {
          if (itemRPC.consensusPubkey === itemQ.consensus_pubkey) {
            if (data[itemRPC.cyberAddress]) {
              data[itemRPC.cyberAddress] = {
                cybLifeTime: cyb,
                ...data[itemRPC.cyberAddress],
                cybWon: data[itemRPC.cyberAddress].cybWon + cyb,
              };
            } else {
              data[itemRPC.cyberAddress] = {
                cybLifeTime: cyb,
                address: itemRPC.cyberAddress,
                cybWon: cyb,
              };
            }
          }
        });
      });
      setDiscipline((item) => ({
        ...item,
        lifetime: true,
      }));
      // setData(temp => ({ ...temp, ...tempData }));
    }
  };

  useEffect(() => {
    const feachData = async () => {
      const { takeoff_leaderboard: takeoffLeaderboard } = await getGraphQLQuery(
        GET_TAKEOFF
      );
      if (takeoffLeaderboard && takeoffLeaderboard.length > 0) {
        for (let item = 0; item < takeoffLeaderboard.length; item += 1) {
          let estimation = 0;
          const address = takeoffLeaderboard[item].donors;
          const cyberAddress = fromBech32(address, 'cyber');
          estimation = takeoffLeaderboard[item].cybs;
          if (data[cyberAddress]) {
            data[cyberAddress] = {
              ...data[cyberAddress],
              takeoff: data[cyberAddress].takeoff + estimation,
              cybWon: data[cyberAddress].cybWon + estimation,
            };
          } else {
            data[cyberAddress] = {
              takeoff: estimation,
              address: cyberAddress,
              cybWon: estimation,
            };
          }
        }
      }
      setAmount(TAKEOFF.FINISH_AMOUNT);
      setDiscipline((item) => ({
        ...item,
        takeoff: true,
      }));
    };
    feachData();
  }, []);

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
          dataValidators.forEach((item) => {
            const cyberAddress = fromBech32(item.operator_address, 'cyber');
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
        getDelegation(validators, total);
        getLifetime(validators);
      }
    };
    feachData();
  }, [dataLoad]);

  useEffect(() => {
    const currentPrize = DISTRIBUTION_PRIZE.relevance;
    const feachData = async () => {
      if (Object.keys(dataLoad).length > 0) {
        const responseRelevanceQ = await getGraphQLQuery(GET_RELEVANCE);
        if (
          responseRelevanceQ &&
          responseRelevanceQ !== null &&
          Object.keys(responseRelevanceQ.relevance_leaderboard).length > 0
        ) {
          const lastItem = responseRelevanceQ.relevance_leaderboard
            .slice(-1)
            .pop();
          setProgress(80);
          responseRelevanceQ.relevance_leaderboard.forEach((item, index) => {
            if (Object.prototype.hasOwnProperty.call(dataLoad, item.subject)) {
              const cybAbsolute = item.share * currentPrize;
              data[item.subject] = {
                ...data[item.subject],
                relevance: cybAbsolute,
                cybWon: data[item.subject].cybWon + cybAbsolute,
              };
              if (lastItem.subject === item.subject) {
                setDiscipline((items) => ({
                  ...items,
                  relevance: true,
                }));
              }
            }
          });
        }
      }
    };
    feachData();
  }, [dataLoad]);

  useEffect(() => {
    const { lifetime, delegation, takeoff, load, relevance } = discipline;
    if (lifetime && delegation && takeoff && load && relevance) {
      setLoading(false);
    }
  }, [discipline]);

  return { data, loading, progress };
}

export default setLeaderboard;
