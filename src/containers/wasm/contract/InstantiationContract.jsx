import React, { useEffect, useState, useContext } from 'react';
import { calculateFee } from '@cosmjs/stargate';
import { GasPrice } from '@cosmjs/launchpad';
import { Link } from 'react-router-dom';
import JSONInput from 'react-json-editor-ajrm';
import { AppContext } from '../../../context';
import { jsonInputStyle } from '../ui/ui';
import { CYBER } from '../../../utils/config';
import { trimString } from '../../../utils/utils';
import styles from './stylesInstantiationContract.scss';
import { CardItem } from '../codes/code';

const executePlaceholder = {
  name: 'Nation coin',
  symbol: 'NTN',
  decimals: 0,
  initial_balances: [
    {
      address: 'bostrom1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjwxgd445',
      amount: '100000',
    },
  ],
  mint: {
    minter: 'bostrom1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjwxgd445',
    cap: '1000000',
  },
};

export const JSONInputCard = ({ title, placeholder, setState, height }) => (
  <div className={styles.containerJsonContractJSONInput}>
    <span className={styles.containerJsonContractJSONInputTitle}>{title}:</span>
    <JSONInput
      width="100%"
      height={height || '200px'}
      placeholder={placeholder}
      confirmGood={false}
      style={jsonInputStyle}
      onChange={({ jsObject }) => setState({ result: jsObject })}
    />
  </div>
);

const coinsPlaceholder = [{ denom: CYBER.DENOM_CYBER, amount: '1' }];
const gasPrice = GasPrice.fromString('0.001boot');

function InstantiationContract({ codeId, updateFnc }) {
  const { keplr, jsCyber } = useContext(AppContext);

  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);
  const [txHash, setTxHash] = useState(null);

  const [memo, setMemo] = useState('');
  const [label, setLabel] = useState('');

  const [msgObject, setMsgObject] = useState({});
  const [coinsObject, setCoinsObject] = useState({});
  const [executeResponse, setExecuteResponse] = useState({});

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        const response = await jsCyber.getTx(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.code === 0) {
            setExecuteResponse({ result: response });
            if (updateFnc) {
              updateFnc();
            }
            setExecuting(false);
            setTxHash(null);
            return;
          }
          if (response.code) {
            setExecuting(false);
            setError(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [txHash]);

  useEffect(() => {
    setMsgObject({ result: executePlaceholder });
    setCoinsObject({ result: coinsPlaceholder });
  }, []);

  useEffect(() => {
    if (msgObject.error) {
      setError(msgObject.error);
      return;
    }

    if (executeResponse.error) {
      setError(executeResponse.error);
      return;
    }

    if (coinsObject.error) {
      setError(coinsObject.error);
      return;
    }

    setError(undefined);
  }, [coinsObject, executeResponse, msgObject]);

  const executeContract = async () => {
    if (!msgObject.result || !label || keplr === null) return;

    setExecuting(true);

    try {
      const [{ address }] = await keplr.signer.getAccounts();

      const executeResponseResult = await keplr.instantiate(
        address,
        parseFloat(codeId),
        msgObject.result,
        label,
        calculateFee(600000, gasPrice),
        {
          memo,
          funds: coinsObject.result,
        }
      );
      if (executeResponseResult.code === 0) {
        setTxHash(executeResponseResult.transactionHash);
      } else {
        setTxHash(null);
        setError(executeResponseResult.rawLog.toString());
      }
    } catch (e) {
      setError(`Execute error: ${e}`);
      setExecuting(false);
    }
  };

  return (
    <div className={styles.containerJsonContract}>
      <JSONInputCard
        placeholder={executePlaceholder}
        setState={setMsgObject}
        title="Instantiate contract"
        height="200px"
      />

      <JSONInputCard
        placeholder={coinsPlaceholder}
        setState={setCoinsObject}
        title="Coins to transfer"
        height="120px"
      />

      <div className={styles.containerJsonContractInputContainer}>
        <div className={styles.containerJsonContractInputContainerItem}>
          <span>Label</span>
          <input
            className={styles.containerJsonContractInputContainerItemInput}
            value={label}
            onChange={(event) => setLabel(event.target.value)}
          />
        </div>
        <div className={styles.containerJsonContractInputContainerItem}>
          <span>Memo</span>
          <input
            className={styles.containerJsonContractInputContainerItemInput}
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </div>
      </div>

      <br />

      {executing ? (
        <button className="btn btn-primary" type="button" disabled>
          Executing...
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={executeContract}
          disabled={!msgObject.result || keplr === null}
        >
          Instantiate contract
        </button>
      )}

      {executeResponse.result && (
        <div className={styles.containerJsonContractResult}>
          <span>Response:</span>
          <CardItem
            title="Tx"
            value={
              <Link to={`/network/bostrom/tx/${executeResponse.result.hash}`}>
                {trimString(executeResponse.result.hash, 8, 8)}
              </Link>
            }
          />
        </div>
      )}

      {error !== null && (
        <div>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}

export default InstantiationContract;
