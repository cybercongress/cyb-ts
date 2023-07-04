import { useEffect, useState } from 'react';
import { useIbcHistory } from './historyContext';
import { HistoriesItem } from './HistoriesItem';

function* toGenerator<R>(p: Promise<R>) {
  return (yield p) as R;
}

function useGetStatus(item: HistoriesItem) {
  const { traceHistoryStatus, updateStatusByTxHash } = useIbcHistory();

  const [status, setStatus] = useState(item.status);

  function* tryUpdateHistoryStatus(item: HistoriesItem) {
    const status = yield* toGenerator(traceHistoryStatus(item));

    return status;
  }

  async function helper(func: Generator) {
    const { value } = func.next();
    const output = await value;
    return output;
  }

  useEffect(() => {
    const getValue = async () => {
      const gen = await helper(tryUpdateHistoryStatus(item));

      updateStatusByTxHash(item.txHash, gen);

      setStatus(gen);
    };
    getValue();
  }, [item, updateStatusByTxHash]);

  return status;
}

export default useGetStatus;
