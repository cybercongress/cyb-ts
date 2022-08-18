import React, { useEffect, useState, useContext } from 'react';
import txs from '../../../utils/txs';
import { GasPrice } from '@cosmjs/launchpad';
import { Link } from 'react-router-dom';
import JSONInput from 'react-json-editor-ajrm';
import { AppContext } from '../../../context';
import { jsonInputStyle, FlexWrapCantainer } from '../ui/ui';
import { CYBER } from '../../../utils/config';
import { trimString } from '../../../utils/utils';
import styles from './stylesInstantiationContract.scss';
import { CardItem } from '../codes/code';
import RenderInstantiateMsg from './RenderInstantiateMsg';
import SelectFile from './renderAbi/SelectFile';
import useParseJsonSchema from './renderAbi/useParseJsonSchema';

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

const coinsPlaceholder = [{ denom: CYBER.DENOM_CYBER, amount: '1' }];
const gasPrice = GasPrice.fromString('0.001boot');

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

function InstantiationContract({ codeId, updateFnc }) {
  const { keplr } = useContext(AppContext);
  const [error, setError] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [executeResponse, setExecuteResponse] = useState({});

  const [memo, setMemo] = useState('');
  const [label, setLabel] = useState('');

  const [msgObject, setMsgObject] = useState({});
  const [coinsObject, setCoinsObject] = useState({});

  const [fileAbiExecute, setFileAbiExecute] = useState(null);
  const { dataObj: schemaExecute } = useParseJsonSchema(fileAbiExecute);

  let content;

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
    if (!msgObject.result || !label || keplr === null) {
      return;
    }

    setExecuting(true);

    try {
      const [{ address }] = await keplr.signer.getAccounts();

      const executeResponseResult = await keplr.instantiate(
        address,
        parseFloat(codeId),
        msgObject.result,
        label,
        txs.calculateFee(600000, gasPrice),
        {
          memo,
          funds: coinsObject.result,
        }
      );
      console.log(`executeResponseResult`, executeResponseResult);
      setExecuteResponse({ result: executeResponseResult });
    } catch (e) {
      setExecuteResponse({ error: `Execute error: ${e}` });
    }

    setExecuting(false);
  };

  const updateFncInst = () => {
    if (updateFnc) {
      updateFnc();
    }
    setFileAbiExecute(null);
    setLabel('');
    setMemo('');
  };

  if (fileAbiExecute === null) {
    if (label.length === 0) {
      content = (
        <div style={{ fontSize: '18px' }}>
          You must add a label{' '}
          <button type="button" className="btn-disabled" disabled>
            Upload schema
          </button>
        </div>
      );
    } else {
      content = (
        <div>
          <SelectFile
            text="Upload instantiate schema"
            useStateCallback={setFileAbiExecute}
          />
        </div>
      );
    }
  } else {
    content = (
      <RenderInstantiateMsg
        schema={schemaExecute}
        codeId={codeId}
        memo={memo}
        label={label}
        updateFnc={updateFncInst}
      />
    );
  }

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
            title="Contract"
            value={
              <Link to={`/contracts/${executeResponse.result.contractAddress}`}>
                {trimString(executeResponse.result.contractAddress, 10)}
              </Link>
            }
          />
          <CardItem
            title="Tx"
            value={
              <Link
                to={`/network/bostrom/tx/${executeResponse.result.transactionHash}`}
              >
                {trimString(executeResponse.result.transactionHash, 8, 8)}
              </Link>
            }
          />
        </div>
      )}

      <FlexWrapCantainer style={{ flexDirection: 'column' }}>
        {content}
      </FlexWrapCantainer>

      {error !== null && (
        <div>
          <div>{error}</div>
        </div>
      )}
    </div>
  );
}

export default InstantiationContract;
