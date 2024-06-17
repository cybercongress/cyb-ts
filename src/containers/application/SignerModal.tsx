import { ChangeEventHandler, useCallback, useState } from 'react';
import { Button, Input } from 'src/components';
import Modal from 'src/components/modal/Modal';

interface SignerModalProps {
  isOpen: boolean;
  onAdd(): void | Promise<void>;
}

export default function SignerModal({ isOpen, onAdd }: SignerModalProps) {
  const [memo, setMemo] = useState('');

  const onMemoChange = useCallback<ChangeEventHandler<HTMLInputElement>>(
    (event) => {
      setMemo(event.target.value);
    },
    [setMemo]
  );

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
          <Button onClick={onAdd}>Discard</Button>
          <Button onClick={onAdd}>Approve</Button>
        </div>
      </div>
    </Modal>
  );
}
