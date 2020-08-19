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

const BLOCK_SUBSCRIPTION = `
  query newBlock {
    block(limit: 1, order_by: { height: desc }) {
      height
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

const getQuerySubject = (address, block) => `
query newBlock {
  relevance_aggregate(where: {height: {_eq: ${block}}}) {
    aggregate {
      sum {
        rank
      }
    }
  }
  rewards_view(where: {_and: [{block: {_eq: ${block}}}, {subject: {_eq: "${address}"}}]}) {
    object
    subject
    rank
    order_number
  }
}
`;

const getQueryLinkages = (arrLink, block) => `
query linkages {
  linkages_view(
    where: {
      _and: [
        { height: { _eq: ${block} } }
        {
          _or: ${arrLink}
        }
      ]
    }
  ) {
    object
    linkages
  }
}
`;

const getJson = data => {
  const json = JSON.stringify(data);
  const unquoted = json.replace(/"([^"]+)":/g, '$1:');
  return unquoted;
};

const getRelevanceData = async (address, block) => {
  const responseRelevance = await getGraphQLQuery(
    getQuerySubject(address, block)
  );
  if (responseRelevance !== null) {
    const arrLink = [];
    responseRelevance.rewards_view.forEach(item => {
      arrLink.push({
        object: {
          _eq: item.object,
        },
      });
    });

    const arrLinkQuery = getJson(arrLink);

    const dataQ = await getGraphQLQuery(getQueryLinkages(arrLinkQuery, block));

    return { dataQ, responseRelevance };
  }
  return [];
};

function setLeaderboard() {
  const [data, setData] = useState({});
  const [progress, setProgress] = useState(0);
  const [block, setBlock] = useState(null);
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
    setDiscipline(item => ({
      ...item,
      load: true,
    }));
    setDataLoad(loadObj);
  };

  const getDelegation = async (validators, total, dataV) => {
    const currentPrize = Math.floor(
      (DISTRIBUTION.delegation / TAKEOFF.ATOMsALL) * amount
    );

    if (validators.length > 0) {
      validators.forEach(item => {
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
      setDiscipline(item => ({
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
        validators.forEach(itemRPC => {
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
      setDiscipline(item => ({
        ...item,
        lifetime: true,
      }));
      // setData(temp => ({ ...temp, ...tempData }));
    }
  };

  useEffect(() => {
    const feachData = async () => {
      const responseBlock = await getGraphQLQuery(BLOCK_SUBSCRIPTION);
      if (responseBlock !== null) {
        setBlock(responseBlock.block[0].height);
      }
      const dataTx = await getTxCosmos();
      let amountTakeoff = 0;
      if (dataTx !== null && dataTx.count > 0) {
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
      setDiscipline(item => ({
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
      if (block > 0 && Object.keys(dataLoad).length > 0) {
        const lastItem = Object.keys(dataLoad)
          .slice(-1)
          .pop();
        const allItem = Object.keys(dataLoad).length;
        let index = 0;
        // eslint-disable-next-line no-restricted-syntax
        // eslint-disable-next-line guard-for-in
        for (const key in dataLoad) {
          // eslint-disable-next-line no-prototype-builtins
          if (dataLoad.hasOwnProperty(key)) {
            const status = Math.round((index / allItem) * 100);
            setProgress(status);
            // eslint-disable-next-line no-await-in-loop
            const relevance = await getRelevanceData(key, block);
            if (
              Object.keys(relevance).length > 0 &&
              Object.keys(relevance.dataQ.linkages_view).length > 0
            ) {
              // eslint-disable-next-line no-await-in-loop
              const dataRelevance = await getRelevance(
                relevance.responseRelevance,
                relevance.dataQ
              );
              if (dataRelevance > 0 && prize > 0) {
                const cybAbsolute = dataRelevance * prize;
                data[key] = {
                  ...data[key],
                  relevance: cybAbsolute,
                  cybWon: data[key].cybWon + cybAbsolute,
                };
              }
            }
            index += 1;
            if (lastItem === key) {
              setDiscipline(item => ({
                ...item,
                relevance: true,
              }));
            }
          }
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
