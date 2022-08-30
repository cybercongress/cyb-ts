import React, { useState, useEffect, useCallback } from 'react';
import { ActionBar, Pane, Button } from '@cybercongress/gravity';
import Long from 'long';
import { coin } from '@cosmjs/launchpad';
import coinDecimalsConfig from '../../utils/configToken';
import { CYBER, DEFAULT_GAS_LIMITS } from '../../utils/config';
import { fromBech32, trimString } from '../../utils/utils';
import { getCoinDecimals, reduceAmounToken } from '../teleport/utils';

const fee = {
  amount: [],
  gas: DEFAULT_GAS_LIMITS.toString(),
};

function ActionBarAssets({ typeIbcTxs, client, denom, tokens }) {
  const [amount, setAmount] = useState('');
  const [bal, setBal] = useState({ amount: 0, denom: '' });
  const [accounts, setAccounts] = useState({
    from: '',
    to: '',
  });

  useEffect(() => {
    const getBalanse = async () => {
      if (client !== null && denom !== null && typeIbcTxs !== null) {
        let coinMinimalDenom = denom;
        let coinDenom = denom;
        let counterpartyAccount;
        let prefix;
        if (
          typeIbcTxs === 'deposit' &&
          Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)
        ) {
          coinMinimalDenom = coinDecimalsConfig[denom].coinMinimalDenom;
          coinDenom = coinDecimalsConfig[denom].denom;
        }
        if (
          typeIbcTxs === 'withdraw' &&
          Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)
        ) {
          prefix = coinDecimalsConfig[denom].prefix;
          coinDenom = coinDecimalsConfig[denom].denom;
        }
        const [{ address }] = await client.signer.getAccounts();
        if (typeIbcTxs === 'deposit') {
          counterpartyAccount = fromBech32(
            address,
            CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
          );
        } else {
          counterpartyAccount = fromBech32(address, prefix);
        }
        const response = await client.queryClient.bank.balance(
          address,
          coinMinimalDenom
        );
        setBal({
          amount: getCoinDecimals(tokens, response.amount, denom),
          denom: coinDenom,
        });
        setAccounts({ from: address, to: counterpartyAccount });
        console.log('response', response);
      }
    };
    getBalanse();
  }, [client, denom, typeIbcTxs]);

  const depositOnClick = useCallback(async () => {
    let sourceChannel;
    let coinMinimalDenom = denom;
    if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)) {
      sourceChannel = coinDecimalsConfig[denom].sourceChannelId;
      coinMinimalDenom = coinDecimalsConfig[denom].coinMinimalDenom;
    }
    const [{ address }] = await client.signer.getAccounts();
    const sourcePort = 'transfer';
    const counterpartyAccount = fromBech32(
      address,
      CYBER.BECH32_PREFIX_ACC_ADDR_CYBER
    );
    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + 60000}000000`
    );
    const transferAmount = coin(
      reduceAmounToken(parseFloat(amount), denom, true),
      coinMinimalDenom
    );
    const msg = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: {
        sourcePort,
        sourceChannel,
        sender: address,
        receiver: counterpartyAccount,
        timeoutTimestamp,
        token: transferAmount,
      },
    };
    console.log('msg', msg);
    try {
      const response = await client.signAndBroadcast(address, [msg], fee, '');
      console.log(`response`, response);
    } catch (e) {
      console.error(`Caught error: `, e);
    }
  }, [denom, client, amount]);

  const withdrawOnClick = useCallback(async () => {
    let sourceChannel;
    let prefix;
    if (Object.prototype.hasOwnProperty.call(coinDecimalsConfig, denom)) {
      sourceChannel = coinDecimalsConfig[denom].destChannelId;
      prefix = coinDecimalsConfig[denom].prefix;
    }
    const [{ address }] = await client.signer.getAccounts();
    const sourcePort = 'transfer';
    const counterpartyAccount = fromBech32(address, prefix);
    const timeoutTimestamp = Long.fromString(
      `${new Date().getTime() + 60000}000000`
    );
    const transferAmount = coin(
      reduceAmounToken(parseFloat(amount), denom, true),
      denom
    );
    const msg = {
      typeUrl: '/ibc.applications.transfer.v1.MsgTransfer',
      value: {
        sourcePort,
        sourceChannel,
        sender: address,
        receiver: counterpartyAccount,
        timeoutTimestamp,
        token: transferAmount,
      },
    };
    console.log('msg', msg);
    try {
      const response = await client.signAndBroadcast(address, [msg], fee, '');
      console.log(`response`, response);
    } catch (e) {
      console.error(`Caught error: `, e);
    }
  }, [denom, client, amount]);

  if (typeIbcTxs === 'deposit') {
    return (
      <ActionBar>
        <div>
          {bal.amount} {bal.denom}
        </div>
        <div>from:{trimString(accounts.from, 10, 6)}</div>
        <div>to:{trimString(accounts.to, 10, 6)}</div>
        <input type="text" onChange={(e) => setAmount(e.target.value)} />
        <Button onClick={() => depositOnClick()}>deposit</Button>
      </ActionBar>
    );
  }

  if (typeIbcTxs === 'withdraw') {
    return (
      <ActionBar>
        <div>
          {bal.amount} {bal.denom}
        </div>
        <div>from:{trimString(accounts.from, 10, 6)}</div>
        <div>to:{trimString(accounts.to, 10, 6)}</div>
        <input type="text" onChange={(e) => setAmount(e.target.value)} />
        <Button onClick={() => withdrawOnClick()}>withdraw</Button>
      </ActionBar>
    );
  }

  return null;
}

export default ActionBarAssets;
