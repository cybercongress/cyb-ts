import useQueryClientMethod from './useQueryClientMethod';
import { CyberClient } from '@cybercongress/cyber-js';

type Params = Parameters<CyberClient['stakingParams']>;

function useStakingParams() {
  return useQueryClientMethod<Params>('stakingParams');
}

export default useStakingParams;
