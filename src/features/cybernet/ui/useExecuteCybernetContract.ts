import useExecuteContractWithWaitAndAdviser, {
  Props as ExecuteContractProps,
} from '../_move/useExecuteContractWithWaitAndAdviser';
import { CYBERNET_CONTRACT_ADDRESS } from '../constants';

type Props = Omit<ExecuteContractProps, 'contractAddress'>;

function useExecuteCybernetContract({ query, funds, onSuccess }: Props) {
  return useExecuteContractWithWaitAndAdviser({
    contractAddress: CYBERNET_CONTRACT_ADDRESS,
    query,
    funds,
    onSuccess,
  });
}

export default useExecuteCybernetContract;
