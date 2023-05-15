import { useEffect, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useQueryClient } from 'src/contexts/queryClient';
import { getInlfation } from '../../../utils/search/utils';
import { getProposals } from '../../../utils/governance';
import { coinDecimals } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';

function useGetStatisticsCyber() {
  const queryClient = useQueryClient();
  const [knowledge, setKnowledge] = useState({
    linksCount: 0,
    cidsCount: 0,
    accountsCount: 0,
    inlfation: 0,
    staked: 0,
    activeValidatorsCount: 0,
  });
  const [government, setGovernment] = useState({
    proposals: 0,
    communityPool: 0,
  });

  useEffect(() => {
    const getGovernment = async () => {
      if (queryClient) {
        let communityPool = 0;
        let proposals = 0;

        const dataCommunityPool = await queryClient.communityPool();
        const { pool } = dataCommunityPool;
        if (dataCommunityPool !== null) {
          communityPool = Math.floor(coinDecimals(parseFloat(pool[0].amount)));
        }

        const dataProposals = await getProposals();
        if (dataProposals !== null && dataProposals.length > 0) {
          proposals = dataProposals.length + 1;
        }

        setGovernment({ proposals, communityPool });
      }
    };
    getGovernment();
  }, [queryClient]);

  useEffect(() => {
    const getStatisticsBrain = async () => {
      if (queryClient) {
        const totalCyb = {};
        let staked = 0;
        let inlfation = 0;

        const responseGraphStats = await queryClient.graphStats();
        const { cyberlinks, particles } = responseGraphStats;
        setKnowledge((item) => ({
          ...item,
          linksCount: cyberlinks,
          cidsCount: particles,
        }));

        const responseHeroesActive = await queryClient.validators(
          'BOND_STATUS_BONDED'
        );
        const { validators } = responseHeroesActive;
        setKnowledge((item) => ({
          ...item,
          activeValidatorsCount: validators.length,
        }));

        const datagetTotalSupply = await queryClient.totalSupply();
        if (Object.keys(datagetTotalSupply).length > 0) {
          datagetTotalSupply.forEach((item) => {
            totalCyb[item.denom] = parseFloat(item.amount);
          });
        }

        if (totalCyb[CYBER.DENOM_CYBER] && totalCyb[CYBER.DENOM_LIQUID_TOKEN]) {
          staked = new BigNumber(totalCyb[CYBER.DENOM_LIQUID_TOKEN])
            .dividedBy(totalCyb[CYBER.DENOM_CYBER])
            .toString(10);
        }
        setKnowledge((item) => ({
          ...item,
          staked,
        }));

        const dataInlfation = await getInlfation();
        if (dataInlfation !== null) {
          inlfation = dataInlfation;
        }
        setKnowledge((item) => ({
          ...item,
          inlfation,
        }));
      }
    };
    getStatisticsBrain();
  }, [queryClient]);

  return {
    ...government,
    ...knowledge,
  };
}

export default useGetStatisticsCyber;
