import { useEffect, useState } from 'react';
import { fromBech32 } from '../../utils/utils';
import {
  getAmountATOM,
  getGraphQLQuery,
  getValidatorsInfo,
} from '../../utils/search/utils';
import { getEstimation } from '../../utils/fundingMath';
import {
  DISTRIBUTION,
  DISTRIBUTION_PRIZE,
  TAKEOFF,
  COSMOS,
} from '../../utils/config';
import {
  getRelevance,
  getLoad,
  getRewards,
  getDelegation,
  getLifetime,
  getTakeoff,
} from '../../utils/game-monitors';

const QueryAddress = (subject) =>
  `  query getRelevanceLeaderboard {
        relevance_leaderboard(
          where: {
            subject: { _eq: "${subject}" }
          }
        ) {
          subject
          share
        }
      }
  `;

const getQueryLifeTime = (consensusAddress) => `
query lifetimeRate {
  pre_commit_view(where: {consensus_pubkey: {_eq: "${consensusAddress}"}}) {
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

const Query = (address) =>
  `query txs {
    takeoff_aggregate(where: {donors: {_eq: "${address}"}}) {
    aggregate {
      sum {
        cybs
      }
    }
  }
}`;

function useGetAtom(addressCyber) {
  const [estimation, setEstimation] = useState(0);

  useEffect(() => {
    const feachData = async () => {
      let addEstimation = 0;

      const addressCosmos = fromBech32(addressCyber, 'cosmos');
      const { takeoff_aggregate: takeoffAggregate } = await getGraphQLQuery(
        Query(addressCosmos)
      );
      if (
        takeoffAggregate &&
        takeoffAggregate.aggregate &&
        takeoffAggregate.aggregate.sum
      ) {
        addEstimation = takeoffAggregate.aggregate.sum.cybs;
      }
      setEstimation(addEstimation);
    };
    feachData();
  }, []);
  return { estimation };
}

function useGetGol(address) {
  const { estimation } = useGetAtom(address);
  const [validatorAddress, setValidatorAddress] = useState(null);
  const [consensusAddress, setConsensusAddress] = useState(null);
  const [gol, setGol] = useState({
    load: 0,
    relevance: 0,
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const feachData = async () => {
      const dataValidatorAddress = fromBech32(address, 'cybervaloper');
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
    const feachData = async () => {
      const responseDataQ = await getGraphQLQuery(QueryAddress(address));
      const prize = DISTRIBUTION_PRIZE.relevance;
      if (
        responseDataQ.relevance_leaderboard &&
        Object.keys(responseDataQ.relevance_leaderboard).length > 0
      ) {
        const shareData = responseDataQ.relevance_leaderboard[0].share;
        const cybAbsolute = shareData * prize;
        setTotal((stateTotal) => stateTotal + cybAbsolute);
        setGol((stateGol) => ({ ...stateGol, relevance: cybAbsolute }));
      }
    };
    feachData();
  }, [address]);

  useEffect(() => {
    const feachData = async () => {
      const prize = DISTRIBUTION_PRIZE.load;
      const data = await getLoad(address);
      if (data > 0 && prize > 0) {
        const cybAbsolute = data * prize;
        setTotal((stateTotal) => stateTotal + cybAbsolute);
        setGol((stateGol) => ({ ...stateGol, load: cybAbsolute }));
      }
    };
    feachData();
  }, [address]);

  useEffect(() => {
    const feachData = async () => {
      const prize = Math.floor(estimation * 10 ** 9);
      if (prize > 0) {
        setTotal((stateTotal) => stateTotal + prize);
      }
    };
    feachData();
  }, [estimation]);

  useEffect(() => {
    if (validatorAddress !== null) {
      const feachData = async () => {
        const prize = DISTRIBUTION_PRIZE.delegation;
        const data = await getDelegation(validatorAddress);
        if (data > 0 && prize > 0) {
          const cybAbsolute = data * prize;
          setTotal((stateTotal) => stateTotal + cybAbsolute);
        }
      };
      feachData();
    }
  }, [validatorAddress]);

  useEffect(() => {
    if (validatorAddress !== null) {
      const feachData = async () => {
        const data = await getRewards(validatorAddress);
        if (data > 0) {
          const cybAbsolute = data / 3;
          setTotal((stateTotal) => stateTotal + cybAbsolute);
        }
      };
      feachData();
    }
  }, [validatorAddress]);

  useEffect(() => {
    if (consensusAddress !== null) {
      const feachData = async () => {
        const prize = DISTRIBUTION_PRIZE.lifetime;
        const dataLifeTime = await getGraphQLQuery(
          getQueryLifeTime(consensusAddress)
        );
        if (dataLifeTime !== null) {
          const data = await getLifetime({
            block:
              dataLifeTime.pre_commit_view_aggregate.aggregate.sum.precommits,
            preCommit: dataLifeTime.pre_commit_view[0].precommits,
          });
          if (data > 0 && prize > 0) {
            const cybAbsolute = data * prize;
            setTotal((stateTotal) => stateTotal + cybAbsolute);
          }
        }
      };
      feachData();
    }
  }, [consensusAddress]);

  return total;
}

export default useGetGol;
