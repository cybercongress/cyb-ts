import { useState, useContext, useEffect } from 'react';
import { AppContext } from '../context';

const useCheckStatusTx = (updateFnc) => {
  const { jsCyber } = useContext(AppContext);
  const [txHash, setTxHash] = useState(null);

  useEffect(() => {
    let timeOut = null;
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null && txHash?.status === 'pending') {
        const response = await jsCyber.getTx(txHash.txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setTxHash((item) => ({
              ...item,
              status: 'confirmed',
            }));
            if (updateFnc) {
              updateFnc();
            }
            return;
          }
          if (response.code) {
            setTxHash((item) => ({
              ...item,
              status: 'error',
              rawLog: response.rawLog.toString(),
            }));
            return;
          }
        }
        timeOut = setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();

    return () => {
      clearTimeout(timeOut);
    };
  }, [jsCyber, txHash]);

  useEffect(() => {
    let timeOutTxHash = null;
    const validValue = txHash !== null && txHash.status;
    const validStatus =
      txHash.status === 'error' || txHash.status === 'confirmed';

    if (validValue && validStatus) {
      timeOutTxHash = setTimeout(setTxHash(null), 10000);
    }

    return () => {
      clearTimeout(timeOutTxHash);
    };
  }, [txHash]);

  return { txHash, setTxHash };
};

export default { useCheckStatusTx };
