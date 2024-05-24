import useExecuteContractWithWaitAndAdviser, {
  Props as ExecuteContractProps,
} from '../_move/useExecuteContractWithWaitAndAdviser';
import { useCybernet } from './cybernet.context';

type Props = Omit<ExecuteContractProps, 'contractAddress'>;

function useExecuteCybernetContract({ query, funds, onSuccess }: Props) {
  const { selectedContract } = useCybernet();

  return useExecuteContractWithWaitAndAdviser({
    contractAddress: selectedContract.address,
    query,
    funds,
    onSuccess,
  });
}

export default useExecuteCybernetContract;
