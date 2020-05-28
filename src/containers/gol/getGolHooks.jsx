import { useEffect, useState } from 'react';
import { getDelegator } from '../../utils/utils';
import {
  getTxCosmos,
  getAmountATOM,
  getGraphQLQuery,
  getValidatorsInfo,
} from '../../utils/search/utils';
import { getEstimation } from '../../utils/fundingMath';
import { DISTRIBUTION, TAKEOFF, COSMOS } from '../../utils/config';
import {
  getRelevance,
  getLoad,
  getRewards,
  getDelegation,
  getLifetime,
  getTakeoff,
} from '../../utils/game-monitors';

const BLOCK_SUBSCRIPTION = `
  query newBlock {
    block(limit: 1, order_by: { height: desc }) {
      height
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

const getQueryLifeTime = consensusAddress => `
query lifetimeRate {
  pre_commit_view(where: {consensus_pubkey: {_eq: "${consensusAddress}"}}) {
    precommits
  }
  pre_commit_aggregate {
    aggregate {
      count
    }
  }
}
`;

function useGetAtom(addressCyber) {
  const [atom, setAtom] = useState(0);
  const [estimation, setEstimation] = useState(0);

  useEffect(() => {
    const feachData = async () => {
      let estimationAll = 0;
      let amount = 0;
      let addEstimation = 0;

      const dataTxs = await getTxCosmos();
      const addressCosmos = getDelegator(addressCyber, 'cosmos');
      if (dataTxs && Object.keys(dataTxs.txs).length > 0) {
        const dataTx = dataTxs.txs;
        for (let item = 0; item < dataTx.length; item += 1) {
          let temE = 0;
          const address = dataTx[item].tx.value.msg[0].value.from_address;
          const val =
            Number.parseInt(
              dataTx[item].tx.value.msg[0].value.amount[0].amount,
              10
            ) / COSMOS.DIVISOR_ATOM;
          temE = getEstimation(estimationAll, val);
          if (address === addressCosmos) {
            addEstimation += temE;
          }
          amount += val;
          estimationAll += temE;
        }
      }
      setAtom(amount);
      setEstimation(addEstimation);
    };
    feachData();
  }, []);
  return { atom, estimation };
}

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

function useGetGol(address) {
  const { estimation, atom } = useGetAtom(address);
  const [validatorAddress, setValidatorAddress] = useState(null);
  const [consensusAddress, setConsensusAddress] = useState(null);
  const [gol, setGol] = useState({
    load: 0,
    relevance: 0,
  });
  const [total, setTotal] = useState(0);
  const [block, setBlock] = useState(null);

  useEffect(() => {
    const feachData = async () => {
      const responseBlock = await getGraphQLQuery(BLOCK_SUBSCRIPTION);
      if (responseBlock !== null) {
        setBlock(responseBlock.block[0].height);
      }
      const dataValidatorAddress = getDelegator(address, 'cybervaloper');
      const dataGetValidatorsInfo = await getValidatorsInfo(
        dataValidatorAddress
      );
      if (dataGetValidatorsInfo !== null) {
        setConsensusAddress(dataGetValidatorsInfo.consensus_pubkey);
        setValidatorAddress(dataValidatorAddress);
      }
    };
    feachData();
  }, [address]);

  useEffect(() => {
    if (block > 0) {
      const feachData = async () => {
        const relevance = await getRelevanceData(address, block);
        const prize = Math.floor(
          (DISTRIBUTION.relevance / TAKEOFF.ATOMsALL) * atom
        );
        if (Object.keys(relevance).length > 0) {
          const data = await getRelevance(
            relevance.responseRelevance,
            relevance.dataQ
          );
          console.log('getRelevance', data * prize);
          if (data > 0 && prize > 0) {
            const cybAbsolute = data * prize;
            setTotal(stateTotal => stateTotal + cybAbsolute);
            setGol(stateGol => ({ ...stateGol, relevance: cybAbsolute }));
          }
        }
      };
      feachData();
    }
  }, [block, address, atom]);

  useEffect(() => {
    const feachData = async () => {
      const prize = Math.floor((DISTRIBUTION.load / TAKEOFF.ATOMsALL) * atom);
      const data = await getLoad(address);
      console.log('getLoad', data * prize);
      if (data > 0 && prize > 0) {
        const cybAbsolute = data * prize;
        setTotal(stateTotal => stateTotal + cybAbsolute);
        setGol(stateGol => ({ ...stateGol, load: cybAbsolute }));
      }
    };
    feachData();
  }, [address, atom]);

  useEffect(() => {
    const feachData = async () => {
      const prize = Math.floor(estimation * 10 ** 12);
      console.log('Takeoff', prize);
      if (prize > 0) {
        setTotal(stateTotal => stateTotal + prize);
      }
    };
    feachData();
  }, [estimation]);

  useEffect(() => {
    if (validatorAddress !== null) {
      const feachData = async () => {
        const prize = Math.floor(
          (DISTRIBUTION.delegation / TAKEOFF.ATOMsALL) * atom
        );
        const data = await getDelegation(validatorAddress);
        console.log('getDelegation', data * prize);
        if (data > 0 && prize > 0) {
          const cybAbsolute = data * prize;
          setTotal(stateTotal => stateTotal + cybAbsolute);
        }
      };
      feachData();
    }
  }, [atom, validatorAddress]);

  useEffect(() => {
    if (validatorAddress !== null) {
      const feachData = async () => {
        const data = await getRewards(validatorAddress);
        console.log('getRewards', data);
        if (data > 0) {
          const cybAbsolute = data;
          setTotal(stateTotal => stateTotal + cybAbsolute);
        }
      };
      feachData();
    }
  }, [validatorAddress]);

  useEffect(() => {
    if (consensusAddress !== null) {
      const feachData = async () => {
        const prize = Math.floor(
          (DISTRIBUTION.lifetime / TAKEOFF.ATOMsALL) * atom
        );
        const dataLifeTime = await getGraphQLQuery(
          getQueryLifeTime(consensusAddress)
        );
        if (dataLifeTime !== null) {
          const data = await getLifetime({
            block: dataLifeTime.pre_commit_aggregate.aggregate.count,
            preCommit: dataLifeTime.pre_commit_view[0].precommits,
          });

          console.log('getLifetime', data * prize);
          if (data > 0 && prize > 0) {
            const cybAbsolute = data * prize;
            setTotal(stateTotal => stateTotal + cybAbsolute);
          }
        }
      };
      feachData();
    }
  }, [atom, consensusAddress]);

  return total;
}

export default useGetGol;
