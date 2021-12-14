import React from 'react';
import { Pane, Button, Input } from '@cybercongress/gravity';

function IbcTxs({ ...props }) {
  const {
    id,
    amount,
    sourceChannel,
    recipientAddress,
    onChangeAmount,
    setSourceChannel,
    setRecipientAddress,
    onClickSend,
    disabledSend,
  } = props;
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        placeholder="amount"
        value={amount}
        onChange={(e) => onChangeAmount(e.target.value)}
      />
      <Input
        placeholder="sourceChannel"
        value={sourceChannel}
        onChange={(e) => setSourceChannel(e.target.value)}
        style={{ margin: '20px 0' }}
      />
      <Input
        placeholder="recipientAddress"
        value={recipientAddress}
        onChange={(e) => setRecipientAddress(e.target.value)}
        style={{ marginBottom: '20px' }}
      />

      <Button
        disabled={disabledSend}
        onClick={() => onClickSend(id)}
        type="button"
      >
        send
      </Button>
    </div>
  );
}

export default IbcTxs;
