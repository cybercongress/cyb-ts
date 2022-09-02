import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { fromAscii, fromBase64 } from '@cosmjs/encoding';
import { AppContext, AppContextSigner } from '../../context';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import InformationTxs from './informationTxs';
import Msgs from './msgs';
import { JsonView } from '../wasm/ui/ui';
import ActionBarWalletTxs from './ActionBarWalletTxs';
import { getTxsV1beta1 } from '../../utils/search/utils';
import { parseMsgs } from './utils';

const initValueInformation = {
  txHash: '',
  height: '',
  status: 'Unsigned',
  timestamp: '',
  memo: '',
};

function WalletTxs({ defaultAccount, mobile }) {
  const param = useParams();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [msgsData, setMsgsData] = useState([]);
  const [information, setInformation] = useState(initValueInformation);
  const [messageError, setMessageError] = useState('');
  const [txsMsgData, setTxsMsgData] = useState(null);

  useEffect(() => {
    try {
      if (param.dataMsg && addressActive !== null) {
        const { dataMsg } = param;
        const { bech32 } = addressActive;

        const msgs = [];
        const fromBase64Data = fromAscii(fromBase64(dataMsg));
        msgs.push(JSON.parse(fromBase64Data));
        const reduceMsgs = parseMsgs(msgs, bech32);
        console.log('reduceMsgs', reduceMsgs);
        setMsgsData(msgs);
      }
    } catch (error) {
      console.log('error', error);
    }
  }, [param, addressActive]);

  const updateFnc = async (hash) => {
    const response = await getTxsV1beta1(hash);
    console.log('response', response);
    if (response !== null && response.tx_response) {
      let status = false;
      let rawLog = '';
      const { code, raw_log, height, txhash, timestamp, tx } =
        response.tx_response;
      const { memo } = tx.body;
      if (code !== undefined) {
        if (code !== 0) {
          status = false;
          rawLog = raw_log;
        } else {
          status = true;
        }
      }
      setInformation({ status, memo, height, timestamp, txHash: txhash });
      setMessageError(rawLog);
    }
    if (response !== null && response.tx) {
      const { messages } = response.tx.body;
      setTxsMsgData(messages);
    }
  };

  return (
    <div>
      <main className="block-body">
        <InformationTxs
          data={information}
          messageError={messageError}
          marginBottom={30}
        />
        {msgsData.length > 0 && txsMsgData === null && (
          <JsonView src={msgsData} strLength={52} />
        )}
        {txsMsgData !== null && <Msgs data={txsMsgData} />}
      </main>
      {!mobile && (
        <ActionBarWalletTxs
          msgsData={msgsData}
          addressActive={addressActive}
          updateFnc={updateFnc}
          txsMsgData={txsMsgData}
        />
      )}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(WalletTxs);
