import { useState, useEffect } from 'react';
import { GasPrice } from '@cosmjs/launchpad';
import { useQueryClient } from 'src/contexts/queryClient';
import { useSigningClient } from 'src/contexts/signerClient';
import txs from '../../../../utils/txs';
import { CYBER } from '../../../../utils/config';
import JsonSchemaParse from './JsonSchemaParse';

const gasPrice = GasPrice.fromString('0.001boot');

// const coinsPlaceholder = [{ denom: CYBER.DENOM_CYBER, amount: '1' }];

function RenderAbiExecute({ contractAddress, schema, updateFnc }) {
  const queryClient = useQueryClient();
  const { signer, signingClient } = useSigningClient();
  const [contractResponse, setContractResponse] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const [executing, setExecuting] = useState(false);
  const [activeKey, setActiveKey] = useState(null);

  useEffect(() => {
    const confirmTx = async () => {
      if (queryClient && txHash !== null) {
        const response = await queryClient.getTx(txHash);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryClient, txHash, activeKey]);

  const runExecute = async ({ formData }, key) => {
    if (!signer || !formData) {
      return;
    }

    setActiveKey(key);
    setExecuting(true);

    try {
      const [{ address }] = await signer.getAccounts();

      const executeResponseResult = await signingClient.execute(
        address,
        contractAddress,
        formData,
        txs.calculateFee(400000, gasPrice),
        CYBER.MEMO_KEPLR
        // coinsPlaceholder
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
          key={key}
          executing={executing}
          activeKey={activeKey}
          schema={items}
          contractResponse={contractResponse}
          keyItem={key}
          onSubmitFnc={runExecute}
        />
      );
    });
  }

  return itemAutoForm.length > 0 && itemAutoForm;
}

export default RenderAbiExecute;
