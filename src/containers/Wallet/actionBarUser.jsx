import React, { useState } from 'react';
import { Pane, ActionBar, Button } from '@cybercongress/gravity';
import { SendLedger } from '../../components';
import txs from '../../utils/txs';
import { CYBER } from '../../utils/config';
import { downloadObjectAsJson } from '../../utils/utils';
import { deletPubkey } from './utils';

const MEMO = 'cyber.page, using CLI';
const STAGE_INIT = 1;
const STAGE_SEND_TX = 2;

function ActionBarUser({ selectAccount, updateAddress, defaultAccounts }) {
  const [stage, setStage] = useState(STAGE_INIT);
  const [amount, setAmount] = useState('');
  const [sendAddres, setSendAddres] = useState('');

  const generateTx = () => {
    let addressFrom = '';
    if (selectAccount && selectAccount !== null && selectAccount.cyber) {
      addressFrom = selectAccount.cyber.bech32;
    }
    const tx = txs.createSendCyber(
      null,
      sendAddres,
      amount,
      MEMO,
      CYBER.DENOM_CYBER,
      true,
      addressFrom
    );

    downloadObjectAsJson(tx, 'tx_send');
    resetStage();
  };

  const resetStage = () => {
    setStage(STAGE_INIT);
    setAmount('');
    setSendAddres('');
  };

  const changeDefaultAccounts = async () => {
    if (selectAccount !== null && selectAccount.cyber) {
      localStorage.setItem(
        'pocket',
        JSON.stringify({ [selectAccount.cyber.bech32]: selectAccount })
      );
    }
    if (updateAddress) {
      updateAddress();
    }
  };

  if (stage === STAGE_INIT) {
    return (
      <ActionBar>
        <Pane>
          <Button
            marginX={10}
            onClick={() => deletPubkey(selectAccount, updateAddress)}
          >
            Drop key
          </Button>
          <Button marginX={10} onClick={() => setStage(STAGE_SEND_TX)}>
            Send EUL
          </Button>
          {!defaultAccounts && (
            <Button marginX={10} onClick={() => changeDefaultAccounts()}>
              Default Accounts
            </Button>
          )}
        </Pane>
      </ActionBar>
    );
  }

  if (stage === STAGE_SEND_TX) {
    return (
      <SendLedger
        onClickBtn={() => generateTx()}
        onChangeInputAmount={(e) => setAmount(e.target.value)}
        valueInputAmount={amount}
        valueInputAddressTo={sendAddres}
        onChangeInputAddressTo={(e) => setSendAddres(e.target.value)}
        disabledBtn={amount.length === 0 || sendAddres.length === 0}
      />
    );
  }

  return null;
}

export default ActionBarUser;
