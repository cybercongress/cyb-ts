import { useEffect, useState, useContext } from 'react';
import { AppContext } from '../../context';

function useGetStatisticsCyber() {
  const { jsCyber } = useContext(AppContext);
  const [knowledge, setKnowledge] = useState({
    linksCount: 0,
    cidsCount: 0,
    accountsCount: 0,
    inlfation: 0,
    stakedCyb: 0,
    activeValidatorsCount: 0,
  });

  useEffect(() => {
    const getStatisticsBrain = async () => {
      if (jsCyber !== null) {
        const totalCyb = {};
        let stakedCyb = 0;

        const responseGraphStats = await jsCyber.graphStats();
        const { particles, cyberlinks } = responseGraphStats;
        setKnowledge((item) => ({
          ...item,
          linksCount: cyberlinks,
          cidsCount: particles,
        }));

        const responseHeroesActive = await jsCyber.validators(
          'BOND_STATUS_BONDED'
        );
        const { validators } = responseHeroesActive;
        setKnowledge((item) => ({
          ...item,
          activeValidatorsCount: validators.length,
        }));

        const datagetTotalSupply = await jsCyber.totalSupply();
        if (Object.keys(datagetTotalSupply).length > 0) {
          datagetTotalSupply.forEach((item) => {
            totalCyb[item.denom] = parseFloat(item.amount);
          });
        }

        if (totalCyb.boot && totalCyb.sboot) {
          const { boot, sboot } = totalCyb;
          stakedCyb = sboot / boot;
        }
        setKnowledge((item) => ({
          ...item,
          stakedCyb,
        }));
      }
    };
    getStatisticsBrain();
  }, [jsCyber]);

  return {
    knowledge,
  };
}

export default useGetStatisticsCyber;
