import { useEffect, useState } from 'react';
import { useQueryClient } from 'src/contexts/queryClient';

function useGetHeroes() {
  const queryClient = useQueryClient();
  const [validators, setValidators] = useState([]);
  const [loadingValidators, setLoadingValidators] = useState(true);
  const [countHeroes, setCountHeroes] = useState({
    active: 0,
    jailed: 0,
  });

  useEffect(() => {
    const feachHeroes = async () => {
      setLoadingValidators(true);
      let validatorsArr = [];
      if (queryClient) {
        const responseActive = await queryClient.validators(
          'BOND_STATUS_BONDED'
        );
        console.log(`responseActive`, responseActive);
        if (
          responseActive.validators &&
          Object.keys(responseActive.validators).length > 0
        ) {
          validatorsArr.push(...responseActive.validators);
          setCountHeroes((item) => ({
            ...item,
            active: item.active + Object.keys(responseActive.validators).length,
          }));
        }

        const responseJailed = await queryClient.validators(
          'BOND_STATUS_UNBONDING'
        );

        if (
          responseJailed.validators &&
          Object.keys(responseJailed.validators).length > 0
        ) {
          validatorsArr.push(...responseJailed.validators);
          setCountHeroes((item) => ({
            ...item,
            jailed: item.jailed + Object.keys(responseJailed.validators).length,
          }));
        }

        const responseUnbonded = await queryClient.validators(
          'BOND_STATUS_UNBONDED'
        );

        if (
          responseUnbonded.validators &&
          Object.keys(responseUnbonded.validators).length > 0
        ) {
          validatorsArr.push(...responseUnbonded.validators);
          setCountHeroes((item) => ({
            ...item,
            jailed:
              item.jailed + Object.keys(responseUnbonded.validators).length,
          }));
        }
      }
      if (validatorsArr.length > 0) {
        validatorsArr = validatorsArr
          .slice(0)
          .sort((a, b) => (+a.tokens > +b.tokens ? -1 : 1));
      }
      setValidators(validatorsArr);
      setLoadingValidators(false);
    };
    feachHeroes();
  }, [queryClient]);

  return { validators, countHeroes, loadingValidators };
}

export default useGetHeroes;
