/* eslint-disable no-restricted-syntax */
import { useState, useEffect } from 'react';
import {
  getGraphQLQuery,
  getIndexStats,
  getAllValidators,
  getTxCosmos,
} from '../../../utils/search/utils';
import { DISTRIBUTION, TAKEOFF, COSMOS } from '../../../utils/config';
import { fromBech32 } from '../../../utils/utils';
import { getEstimation } from '../../../utils/fundingMath';
import { getRelevance } from '../../../utils/game-monitors';

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
    const currentPrize = Math.floor(
      (DISTRIBUTION.delegation / TAKEOFF.ATOMsALL) * amount
    );

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
    const currentPrize = Math.floor(
      (DISTRIBUTION.lifetime / TAKEOFF.ATOMsALL) * amount
    );
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
      const dataTx = await getTxCosmos();
      let amountTakeoff = 0;
      if (dataTx !== null && dataTx.count > 0) {
        if (dataTx.total_count > dataTx.count) {
          const allPage = Math.ceil(dataTx.total_count / dataTx.count);
          for (let index = 1; index < allPage; index++) {
            // eslint-disable-next-line no-await-in-loop
            const response = await getTxCosmos(index + 1);
            if (response !== null && Object.keys(response.txs).length > 0) {
              dataTx.txs = [...dataTx.txs, ...response.txs];
            }
          }
        }
        const { txs } = dataTx;
        let temE = 0;
        for (let item = 0; item < txs.length; item += 1) {
          let estimation = 0;
          const address = txs[item].tx.value.msg[0].value.from_address;
          const cyberAddress = fromBech32(address, 'cyber');
          const val =
            Number.parseInt(
              txs[item].tx.value.msg[0].value.amount[0].amount,
              10
            ) / COSMOS.DIVISOR_ATOM;
          estimation = getEstimation(temE, val);
          amountTakeoff += val;
          temE += estimation;
          if (data[cyberAddress]) {
            data[cyberAddress] = {
              ...data[cyberAddress],
              takeoff: data[cyberAddress].takeoff + estimation * 10 ** 12,
              cybWon: data[cyberAddress].cybWon + estimation * 10 ** 12,
            };
          } else {
            data[cyberAddress] = {
              takeoff: estimation * 10 ** 12,
              address: cyberAddress,
              cybWon: estimation * 10 ** 12,
            };
          }
        }
      }
      setAmount(amountTakeoff);
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
          dataValidators.forEach(item => {
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
    const prize = Math.floor(
      (DISTRIBUTION.relevance / TAKEOFF.ATOMsALL) * amount
    );
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
              const cybAbsolute = item.share * prize;
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
