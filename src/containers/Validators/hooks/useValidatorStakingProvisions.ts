import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useCyberClient } from 'src/contexts/queryCyberClient';
import { fromAscii } from '@cosmjs/encoding';
import { Decimal } from '@cosmjs/math';
import BigNumber from 'bignumber.js';

function useValidatorStakingProvisions() {
  const { rpc } = useCyberClient();
  const { data: resAnnPro } = useQuery({
    queryKey: ['mint', 'annualProvisions'],
    queryFn: () => rpc.cosmos.mint.v1beta1.annualProvisions(),
  });
  const { data: resDistParams } = useQuery({
    queryKey: ['distribution', 'params'],
    queryFn: () => rpc.cosmos.distribution.v1beta1.params(),
  });

  const stakingProvisions = useMemo(() => {
    if (!resAnnPro || !resDistParams) {
      return undefined;
    }

    const annualProvisions = Decimal.fromAtomics(
      fromAscii(resAnnPro.annualProvisions),
      18
    ).toString();
    const { communityTax } = resDistParams.params;

    return new BigNumber(annualProvisions)
      .multipliedBy(new BigNumber(1).minus(communityTax))
      .toString(10);
  }, [resAnnPro, resDistParams]);

  return { stakingProvisions };
}

export default useValidatorStakingProvisions;
