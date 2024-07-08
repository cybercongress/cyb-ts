import { ChangeEventHandler, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionBar, Button, Input, MainContainer } from 'src/components';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { resetSignerState, updateMemo } from 'src/redux/features/signer';

export default function Sign() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { resolve, reject } = useAppSelector((state) => state.signer);
  const memo = useAppSelector((state) => state.signer.memo);

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
          <h2 style={{ marginBottom: '25px' }}>Confirm transaction</h2>
          <div>
            <h3>Memo (optional)</h3>
            <Input value={memo} onChange={onMemoChange} />
          </div>
          <div style={{ textAlign: 'center', marginTop: '15px' }}>
            TxFee 0 Boot
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
