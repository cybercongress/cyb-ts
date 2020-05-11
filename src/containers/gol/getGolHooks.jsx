import { useEffect, useState } from 'react';
import { getDelegator } from '../../utils/utils';
import {
  getTxCosmos,
  getAmountATOM,
  getGraphQLQuery,
  getValidatorsInfo,
} from '../../utils/search/utils';
import { cybWon } from '../../utils/fundingMath';
import { DISTRIBUTION } from '../../utils/config';
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

function useGetAtom() {
  const [atom, setAtom] = useState(0);
  const [won, setWon] = useState(0);

  useEffect(() => {
    const feachData = async () => {
      const dataTx = await getTxCosmos();
      if (dataTx !== null) {
        if (dataTx) {
          const dataAtom = getAmountATOM(dataTx.txs);
          setAtom(dataAtom);
          setWon(Math.floor(cybWon(dataAtom)));
        }
      }
    };
    feachData();
  }, []);

  return { atom, won };
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
  const { won } = useGetAtom();
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
          (won / DISTRIBUTION.takeoff) * DISTRIBUTION.relevance
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
  }, [block, address, won]);

  useEffect(() => {
    const feachData = async () => {
      const prize = Math.floor(
        (won / DISTRIBUTION.takeoff) * DISTRIBUTION.load
      );
      const data = await getLoad(address);
      console.log('getLoad', data * prize);
      if (data > 0 && prize > 0) {
        const cybAbsolute = data * prize;
        setTotal(stateTotal => stateTotal + cybAbsolute);
        setGol(stateGol => ({ ...stateGol, load: cybAbsolute }));
      }
    };
    feachData();
  }, [address, won]);

  useEffect(() => {
    const feachData = async () => {
      const prize = Math.floor(won);
      const data = await getTakeoff(address);
      console.log('getTakeoff', data * prize);

      if (data > 0 && prize > 0) {
        const cybAbsolute = data * prize;
        setTotal(stateTotal => stateTotal + cybAbsolute);
      }
    };
    feachData();
  }, [address, won]);

  useEffect(() => {
    if (validatorAddress !== null) {
      const feachData = async () => {
        const prize = Math.floor(
          (won / DISTRIBUTION.takeoff) * DISTRIBUTION.delegation
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
  }, [won, validatorAddress]);

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
          (won / DISTRIBUTION.takeoff) * DISTRIBUTION.lifetime
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
  }, [won, consensusAddress]);

  return total;
}

export default useGetGol;
