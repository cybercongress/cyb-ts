import React, { useState } from 'react';
import { SendLedger } from '../../components';
import txs from '../../utils/txs';
import { CYBER } from '../../utils/config';
import { downloadObjectAsJson } from '../../utils/utils';

const MEMO = 'cyb.ai, using CLI';
const STAGE_INIT = 1;
const STAGE_SEND_TX = 2;

function ActionBarUser({ selectAccount, updateAddress, defaultAccounts }) {
  const [stage, setStage] = useState(STAGE_SEND_TX);
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
    if (updateAddress) {
      updateAddress();
    }
  };

  const resetStage = () => {
    setStage(STAGE_INIT);
    setAmount('');
    setSendAddres('');
  };

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
