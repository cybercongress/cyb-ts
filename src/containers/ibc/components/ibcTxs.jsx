import React from 'react';
import { Pane, Button, Input } from '@cybercongress/gravity';

function IbcTxs({ state }) {
  const {
    amount,
    setAmount,
    sourceChannel,
    setSourceChannel,
    recipientAddress,
    setRecipientAddress,
    cyberClient,
    sendIBCtransaction,
  } = state;
  return (
    <div style={{ maxWidth: '400px' }}>
      <Input
        placeholder="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
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
        disabled={cyberClient === null}
        onClick={() => sendIBCtransaction()}
        type="button"
      >
        send
      </Button>
    </div>
  );
}

export default IbcTxs;
