import { ChangeEventHandler, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
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
import * as styles from './Sign.style';

export default function Sign() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resolve, reject, fee } = useAppSelector((state) => state.signer);
  const memo = useAppSelector((state) => state.signer.memo);
  const messages = useAppSelector((state) => state.signer.messages);

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
            <Input value={memo} onChange={onMemoChange} />
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
