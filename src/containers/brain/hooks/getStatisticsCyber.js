import { useEffect, useState } from 'react';
import {
  getValidators,
  getInlfation,
  getcommunityPool,
  getTotalSupply,
  stakingPool,
  getIndexStats,
} from '../../../utils/search/utils';
import { getProposals } from '../../../utils/governance';

function useGetStatisticsCyber() {
  const [knowledge, setKnowledge] = useState({
    linksCount: 0,
    cidsCount: 0,
    accountsCount: 0,
    inlfation: 0,
    stakedCyb: 0,
    activeValidatorsCount: 0,
  });
  const [government, setGovernment] = useState({
    proposals: 0,
    communityPool: 0,
  });

  useEffect(() => {
    getGovernment();
    getStatisticsBrain();
  }, []);

  const getGovernment = async () => {
    let communityPool = 0;
    let proposals = 0;

    const dataCommunityPool = await getcommunityPool();
    if (dataCommunityPool !== null) {
      communityPool = Math.floor(parseFloat(dataCommunityPool[0].amount));
    }

    const dataProposals = await getProposals();
    if (dataProposals !== null && dataProposals.length > 0) {
      proposals = dataProposals[dataProposals.length - 1].id;
    }

    setGovernment({ proposals, communityPool });
  };

  const getStatisticsBrain = async () => {
    let totalCyb = 0;
    let bondedTokens = 0;
    let stakedCyb = 0;
    let inlfation = 0;
    let linksCount = 0;
    let cidsCount = 0;
    let accountsCount = 0;
    let activeValidatorsCount = 0;

    const dataIndexStatus = await getIndexStats();
    if (dataIndexStatus !== null) {
      linksCount = dataIndexStatus.linksCount;
      cidsCount = dataIndexStatus.cidsCount;
      accountsCount = dataIndexStatus.accountsCount;
    }
    const validatorsStatistic = await getValidators();
    if (validatorsStatistic !== null) {
      activeValidatorsCount = validatorsStatistic.length;
    }

    const datagetTotalSupply = await getTotalSupply();
    if (datagetTotalSupply !== null) {
      totalCyb = datagetTotalSupply;
    }

    const datastakingPool = await stakingPool();
    if (datastakingPool !== null) {
      bondedTokens = datastakingPool.bonded_tokens;
    }
    if (bondedTokens > 0 && totalCyb > 0) {
      stakedCyb = bondedTokens / totalCyb;
    }

    const dataInlfation = await getInlfation();
    if (dataInlfation !== null) {
      inlfation = dataInlfation;
    }
    setKnowledge({
      linksCount,
      cidsCount,
      accountsCount,
      inlfation,
      stakedCyb,
      activeValidatorsCount,
    });
  };

  return {
    government,
    knowledge,
  };
}

export default useGetStatisticsCyber;
