import useAdviserTexts from './useAdviserTexts';
import useExecuteContract from './useExecuteContract';
import useWaitForTransaction from 'src/hooks/useWaitForTransaction';
import { Coin } from '@cosmjs/launchpad';

export type Props = {
  contractAddress: string;
  query: any;
  funds?: Coin[] | undefined;
  onSuccess?: (response: any) => void;
};

function useExecuteContractWithWaitAndAdviser({
  contractAddress,
  query,
  funds,
  onSuccess,
}: Props) {
  const { isLoading, isReady, error, mutate, transactionHash } =
    useExecuteContract({
      contractAddress,
      query,
      funds,
    });

  const waitForTx = useWaitForTransaction({
    hash: transactionHash,
    onSuccess,
  });

  const e = error || waitForTx.error;
  useAdviserTexts({
    isLoading: isLoading || waitForTx.isLoading,
    error: e,
    txHash: e && transactionHash,
  });

  return {
    mutate,
    isReady,
    isLoading: isLoading || waitForTx.isLoading,
  };
}

export default useExecuteContractWithWaitAndAdviser;
