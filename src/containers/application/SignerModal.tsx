import { ChangeEventHandler, useCallback, useState } from 'react';
import { Button, Input } from 'src/components';
import Modal from 'src/components/modal/Modal';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { closeSignerModal } from 'src/redux/reducers/signer';

export default function SignerModal() {
  const dispatch = useAppDispatch();
  const {
    open: isOpen,
    resolve,
    reject,
  } = useAppSelector((state) => state.signer);
  const [memo, setMemo] = useState('');

  const onMemoChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setMemo(event.target.value);
    },
    [setMemo]
  );

  const onAdd = useCallback(() => {
    if (!resolve) {
      return;
    }

    resolve({});
  }, [resolve]);

  const onDiscard = useCallback(() => {
    if (!reject) {
      return;
    }
    dispatch(closeSignerModal());
    reject(new Error('User rejected transaction'));
  }, [dispatch, reject]);

  return (
    <Modal isOpen={isOpen}>
      <div>
        <h2 style={{ marginBottom: '25px' }}>Confirm transaction</h2>
        <div>
          <h3>Memo (optional)</h3>
          <Input value={memo} onChange={onMemoChange} />
        </div>
        <div style={{ textAlign: 'center', marginTop: '15px' }}>
          TxFee 0 Boot
        </div>
        <div
          style={{
            marginTop: '25px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Button onClick={onDiscard}>Discard</Button>
          <Button onClick={onAdd}>Approve</Button>
        </div>
      </div>
    </Modal>
  );
}
