import { ChangeEventHandler, useCallback, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  ActionBar,
  Button,
  Display,
  DisplayTitle,
  Input,
  MainContainer,
} from 'src/components';
import { resetSignerState, updateMemo } from 'src/redux/features/signer';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';

import ReactJson from 'react-json-view';
import { useSigningClient } from 'src/contexts/signerClient';
import { CybSignerClient } from 'src/utils/CybSignerClient';
import { StdFee } from '@cosmjs/launchpad';
import * as styles from './Sign.style';

const parseFee = (fee: string | null): number | StdFee | 'auto' => {
  const num = Number(fee);
  if (!Number.isNaN(num)) {
    return num;
  }

  try {
    const obj = JSON.parse(fee || '');
    return obj as StdFee;
  } catch (error) {
    return 'auto';
  }
};

export default function Sign() {
  const { signingClient } = useSigningClient();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const dispatch = useAppDispatch();
  const { resolve, reject, fee, memo, messages } = useAppSelector(
    (state) => state.signer
  );

  console.log({ params: params.get('q') });
  // "bostrom14r6j7h4n2hmuam8tj224mw8g3earax5t35lypt"
  // [{"typeUrl":"/cyber.graph.v1beta1.MsgCyberlink","value":{"neuron":"bostrom14r6j7h4n2hmuam8tj224mw8g3earax5t35lypt","links":[{"from":"QmQ4pGUWgTo9NCsg1WqKYVbivMTcbycZFiiRMETTf89uHB","to":"QmX7PTVeGBjcJNefjkMEpFkZadDSy8LU1sJaYcYqBCRrhr"}]}}]
  // {"amount":[],"gas":"200000"}

  useEffect(() => {
    if (
      signingClient instanceof CybSignerClient &&
      !reject &&
      !resolve &&
      params
    ) {
      const address = params.get('address');
      const qMessages = params.getAll('messages').map((msg) => JSON.parse(msg));
      const qFee = parseFee(params.get('fee'));

      const qMemo = params.get('memo') ?? '';

      if (address && qMessages) {
        signingClient.signAndBroadcast(address, qMessages, qFee, qMemo);
      }
    }
  }, [signingClient, reject, resolve, params]);

  const onMemoChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      dispatch(updateMemo(event.target.value));
    },
    [dispatch]
  );

  const onAdd = useCallback(() => {
    if (!resolve) {
      return;
    }

    navigate(-1);
    resolve({});
  }, [navigate, resolve]);

  const onDiscard = useCallback(() => {
    if (!reject) {
      return;
    }
    navigate(-1);
    dispatch(resetSignerState());
    reject(new Error('User rejected transaction'));
  }, [dispatch, navigate, reject]);

  return (
    <>
      <MainContainer>
        <div>
          <h2 style={styles.heading}>Confirm transaction</h2>
          {messages && messages.length > 0 && (
            <div style={{ paddingTop: '23px', paddingBottom: '46px' }}>
              <Display title={<DisplayTitle title="Messages:" />}>
                <ReactJson
                  src={messages}
                  theme="twilight"
                  displayObjectSize={false}
                  displayDataTypes={false}
                />
              </Display>
            </div>
          )}
          <div>
            <h3>Memo (optional)</h3>
            <Input
              value={memo}
              onChange={onMemoChange}
              disabled={!resolve && !reject}
            />
          </div>
          <div style={styles.txWrapper}>
            TxFee{' '}
            {typeof fee === 'number' ? fee : (fee as any)?.amount?.[0] ?? 0}{' '}
            Boot
          </div>
        </div>
      </MainContainer>
      <ActionBar>
        <Button onClick={onDiscard} disabled={!reject}>
          Discard
        </Button>
        <Button onClick={onAdd} disabled={!resolve}>
          Approve
        </Button>
      </ActionBar>
    </>
  );
}
