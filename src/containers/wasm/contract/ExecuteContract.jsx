import { useEffect, useState, useContext } from 'react';
import { GasPrice } from '@cosmjs/launchpad';
import txs from '../../../utils/txs';
import { JsonView } from '../ui/ui';
import { AppContext } from '../../../context';
import { CYBER } from '../../../utils/config';
import { JSONInputCard } from './InstantiationContract';
import styles from './stylesExecuteContract.scss';

const executePlaceholder = {
  transfer: {
    recipient: 'bostrom1p0r7uxstcw8ehrwuj4kn8qzzs0yypsjwxgd445',
    amount: '1',
  },
};

const coinsPlaceholder = [{ denom: CYBER.DENOM_CYBER, amount: '1' }];

// const fee = {
//   amount: [],
//   gas: DEFAULT_GAS_LIMITS.toString(),
// };

const gasPrice = GasPrice.fromString('0.001boot');

function ExecuteContract({ contractAddress }) {
  const { keplr } = useContext(AppContext);
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);

  const [memo, setMemo] = useState('');

  const [msgObject, setMsgObject] = useState({});
  const [coinsObject, setCoinsObject] = useState({});

  const [executeResponse, setExecuteResponse] = useState({});

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

    setError(null);
  }, [coinsObject, executeResponse, msgObject]);

  const executeContract = async () => {
    if (!msgObject.result || keplr === null) {
      return;
    }

    setExecuting(true);

    try {
      const [{ address }] = await keplr.signer.getAccounts();

      const executeResponseResult = await keplr.execute(
        address,
        contractAddress,
        msgObject.result,
        txs.calculateFee(400000, gasPrice),
        memo,
        coinsObject.result
      );

      console.log(`executeResponseResult`, executeResponseResult);
      setExecuteResponse({ result: executeResponseResult });
    } catch (e) {
      console.log(`e`, e);
      setExecuteResponse({ error: `Execute error: ${e}` });
    }

    setExecuting(false);
  };

  return (
    <div className={styles.containerExecuteContract}>
      <JSONInputCard
        placeholder={executePlaceholder}
        setState={setMsgObject}
        title="Execute contract"
        height="200px"
      />

      <JSONInputCard
        placeholder={coinsPlaceholder}
        setState={setCoinsObject}
        title="Coins to transfer"
        height="120px"
      />

      <div className={styles.containerExecuteContractInputContainer}>
        <div className={styles.containerExecuteContractInputContainerItem}>
          <span>Memo</span>
          <input
            className="form-control"
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
          />
        </div>
      </div>

      {executing ? (
        <button type="button" className="btn btn-primary" disabled>
          Executing...
        </button>
      ) : (
        <button
          type="button"
          className="btn btn-primary"
          onClick={executeContract}
          disabled={!msgObject.result || keplr === null}
        >
          Execute contract
        </button>
      )}

      {executeResponse.result && (
        <div className={styles.containerExecuteContractResult}>
          <span>Response:</span>
          <JsonView src={executeResponse.result} />
        </div>
      )}

      {error !== null && (
        <div className={styles.containerExecuteContractResult}>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}

export default ExecuteContract;
