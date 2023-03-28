import { useState, useContext, useEffect } from 'react';
import { GasPrice } from '@cosmjs/launchpad';
import txs from '../../../utils/txs';
import { AppContext } from '../../../context';
import JsonSchemaParse from './renderAbi/JsonSchemaParse';

const gasPrice = GasPrice.fromString('0.001boot');

function RenderInstantiateMsg({ label, codeId, memo, schema, updateFnc }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const [contractResponse, setContractResponse] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        const response = await jsCyber.getTx(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          const { code, hash, height } = response;
          if (response.code === 0) {
            setContractResponse({
              result: {
                code,
                hash,
                height,
              },
              key: activeKey,
            });

            if (updateFnc) {
              updateFnc();
            }
            setExecuting(false);
            setTxHash(null);
            return;
          }
          if (response.code) {
            setExecuting(false);
            setContractResponse({
              result: {
                code,
                hash,
                height,
                rawLog: response.rawLog,
              },
              key: activeKey,
            });
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [jsCyber, txHash, activeKey]);

  const runExecute = async ({ formData }, key) => {
    if (keplr === null || !formData) {
      return;
    }

    setActiveKey(key);
    setExecuting(true);

    console.log(`formData`, formData);

    try {
      const [{ address }] = await keplr.signer.getAccounts();

      const executeResponseResult = await keplr.instantiate(
        address,
        parseFloat(codeId),
        formData,
        label,
        txs.calculateFee(600000, gasPrice),
        {
          memo,
        }
      );
      console.log(`executeResponseResult`, executeResponseResult);
      if (executeResponseResult.code === 0) {
        setTxHash(executeResponseResult.transactionHash);
      } else {
        setTxHash(null);
        setContractResponse({
          result: executeResponseResult,
          key,
        });
      }
    } catch (e) {
      console.log(`error runExecute`, e);
      // setQueryResponse({ error: `Query error: ${e.message}` });
    }
  };

  let itemAutoForm = [];

  if (schema.length > 0) {
    itemAutoForm = schema.map((items, key) => {
      // const bridge = makeBridge(items);
      // const key = uuidv4();
      return (
        <JsonSchemaParse
          executing={executing}
          activeKey={activeKey}
          schema={items}
          contractResponse={contractResponse}
          keyItem={key}
          onSubmitFnc={runExecute}
          // disabledOnSubmit={}
        />
      );
    });
  }

  return <>{itemAutoForm.length > 0 && itemAutoForm}</>;
}

export default RenderInstantiateMsg;
