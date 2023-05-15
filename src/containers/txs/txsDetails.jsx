/* eslint-disable camelcase */
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDevice } from 'src/contexts/device';
import InformationTxs from './informationTxs';
import Msgs from './msgs';
import ActionBarContainer from '../Search/ActionBarContainer';
import { CYBER } from '../../utils/config';
import { MainContainer } from '../portal/components';

const getTxs = async (txs) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${CYBER.CYBER_NODE_URL_LCD}/cosmos/tx/v1beta1/txs/${txs}`,
    });
    return response.data;
  } catch (e) {
    console.log(e);
    return null;
  }
};

const initValueInformation = {
  txHash: '',
  height: '',
  status: '',
  timestamp: '',
  memo: '',
};

function TxsDetails() {
  const { isMobile: mobile } = useDevice();
  const { txHash } = useParams();
  const [msgs, setMsgs] = useState(null);
  const [information, setInformation] = useState(initValueInformation);
  const [messageError, setMessageError] = useState('');

  useEffect(() => {
    const getTxsResponse = async () => {
      const response = await getTxs(txHash);
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
        setMsgs(messages);
      }
    };
    getTxsResponse();

    // return () => {

    // };
  }, [txHash]);

  console.log('msgs', msgs);

  return (
    <>
      <MainContainer width="82%">
        <InformationTxs data={information} messageError={messageError} />
        {msgs !== null && <Msgs data={msgs} />}
      </MainContainer>
      {!mobile && (
        <ActionBarContainer valueSearchInput={txHash} keywordHash={txHash} />
      )}
    </>
  );
}

export default TxsDetails;
