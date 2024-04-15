import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDevice } from 'src/contexts/device';
import InformationTxs from './informationTxs';
import Msgs from './msgs';
import ActionBarContainer from '../Search/ActionBarContainer';
import { MainContainer } from '../portal/components';
import { getTxs } from './api/data';
import { ValueInformation } from './type';
import { mapResponseDataGetTxs } from './api/mapping';
import { useAdviser } from 'src/features/adviser/context';

function TxsDetails() {
  const { isMobile: mobile } = useDevice();
  const { txHash } = useParams();
  const [msgs, setMsgs] = useState();
  const [information, setInformation] = useState<ValueInformation>();
  const { setAdviser } = useAdviser();

  useEffect(() => {
    getTxs(txHash || '').then((response) => {
      if (!response) {
        return;
      }

      const { info, messages, rawLog } = mapResponseDataGetTxs(response);
      setInformation({ ...info });
      setMsgs(messages);

      if (rawLog) {
        setAdviser(rawLog, 'red');
      }
    });
  }, [txHash, setAdviser]);

  return (
    <>
      <MainContainer width="82%">
        <InformationTxs data={information} />
        {msgs && <Msgs data={msgs} />}
      </MainContainer>
      {!mobile && (
        <ActionBarContainer valueSearchInput={txHash} keywordHash={txHash} />
      )}
    </>
  );
}

export default TxsDetails;
