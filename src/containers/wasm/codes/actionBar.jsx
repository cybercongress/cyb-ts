/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useState, useContext, useRef } from 'react';
import {
  ActionBar as ActionBarContainer,
  Button,
  Pane,
} from '@cybercongress/gravity';
import { GasPrice } from '@cosmjs/launchpad';
import txs from '../../../utils/txs';
import { AppContext } from '../../../context';
import { CYBER, LEDGER } from '../../../utils/config';
import {
  ActionBarContentText,
  Dots,
  TransactionSubmitted,
  Confirmed,
  TransactionError,
  Account,
} from '../../../components';
import { getTxs } from '../../../utils/search/utils';

const gasPrice = GasPrice.fromString('0.001boot');

const {
  STAGE_INIT,
  STAGE_ERROR,
  STAGE_CONFIRMING,
  STAGE_CONFIRMED,
  STAGE_SUBMITTED,
} = LEDGER;

function ActionBar({ updateFnc, addressActive }) {
  const { keplr, jsCyber } = useContext(AppContext);
  const inputOpenFileRef = useRef();
  const [wasm, setWasm] = useState(null);
  const [stage, setStage] = useState(STAGE_INIT);
  const [txHash, setTxHash] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [txHeight, setTxHeight] = useState(null);

  useEffect(() => {
    const confirmTx = async () => {
      if (jsCyber !== null && txHash !== null) {
        setStage(STAGE_CONFIRMING);
        const response = await getTxs(txHash);
        console.log('response :>> ', response);
        if (response && response !== null) {
          if (response.logs) {
            setStage(STAGE_CONFIRMED);
            setTxHeight(response.height);
            if (updateFnc) {
              updateFnc();
            }
            return;
          }
          if (response.code) {
            setStage(STAGE_ERROR);
            setTxHeight(response.height);
            setErrorMessage(response.raw_log);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jsCyber, txHash]);

  const uploadCode = async () => {
    setStage(STAGE_SUBMITTED);

    const wasmBytes = new Uint8Array(await wasm.arrayBuffer());
    try {
      const [{ address }] = await keplr.signer.getAccounts();

      if (addressActive !== null && addressActive.bech32 === address) {
        const response = await keplr.upload(
          address,
          wasmBytes,
          txs.calculateFee(4000000, gasPrice),
          CYBER.MEMO_KEPLR
        );
        if (response.code === 0) {
          setTxHash(response.transactionHash);
        } else {
          setTxHash(null);
          setErrorMessage(response.rawLog.toString());
          setStage(STAGE_ERROR);
        }
      } else {
        setErrorMessage(
          <span>
            Add address <Account margin="0 5px" address={address} /> to your
            pocket or make active{' '}
          </span>
        );
        setStage(STAGE_ERROR);
      }
    } catch (e) {
      console.log(`e`, e);
      setStage(STAGE_ERROR);
      setErrorMessage(e.toString());
    }
  };

  const onClickClear = () => {
    setWasm(null);
  };

  const showOpenFileDlg = () => {
    inputOpenFileRef.current.click();
  };

  const onFilePickerChange = (files) => {
    const file = files.current.files[0];
    setWasm(file);
  };

  const cleatState = () => {
    setWasm(null);
    setStage(STAGE_INIT);
    setTxHash(null);
    setTxHeight(null);
    setErrorMessage(null);
  };

  if (stage === STAGE_INIT) {
    return (
      <ActionBarContainer>
        <Pane width="65%" alignItems="flex-end" display="flex">
          <ActionBarContentText>
            <div>
              {wasm !== null && wasm.name ? wasm.name : 'Select .wasm file'}
            </div>
            <input
              ref={inputOpenFileRef}
              onChange={() => onFilePickerChange(inputOpenFileRef)}
              type="file"
              accept=".wasm"
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className={
                wasm !== null && wasm !== undefined
                  ? 'btn-add-close'
                  : 'btn-add-file'
              }
              onClick={
                wasm !== null && wasm !== undefined
                  ? onClickClear
                  : showOpenFileDlg
              }
            />
          </ActionBarContentText>
          <Button
            disabled={wasm === null || keplr === null}
            onClick={() => uploadCode()}
          >
            Upload
          </Button>
        </Pane>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_SUBMITTED) {
    return (
      <ActionBarContainer>
        <ActionBarContentText>
          check the transaction <Dots big />
        </ActionBarContentText>
      </ActionBarContainer>
    );
  }

  if (stage === STAGE_CONFIRMING) {
    return <TransactionSubmitted />;
  }

  if (stage === STAGE_CONFIRMED) {
    return (
      <Confirmed
        txHash={txHash}
        txHeight={txHeight}
        onClickBtnCloce={() => cleatState()}
      />
    );
  }

  if (stage === STAGE_ERROR && errorMessage !== null) {
    return (
      <TransactionError
        errorMessage={errorMessage}
        onClickBtn={() => cleatState()}
      />
    );
  }

  return null;
}

export default ActionBar;
