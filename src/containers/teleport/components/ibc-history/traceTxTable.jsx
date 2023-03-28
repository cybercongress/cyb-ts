import { useContext } from 'react';
import { HistoryContext } from './historyContext';

function TraceTxTable() {
  const test = useContext(HistoryContext);

  // useEffect(() => {
  //   test.changeHistory('res');
  // }, [test]);

  return <div>traceTxTable</div>;
}

export default TraceTxTable;
