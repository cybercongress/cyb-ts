import { useCallback, useEffect, useState } from 'react';
import { useIpfs } from 'src/contexts/ipfs';
import BtnPasport from '../portal/pasport/btnPasport';
import Select from '../teleport/components/select';
import {
  updateIpfsStateUrl,
  updateIpfsStateType,
  // updateUserGatewayUrl,
  renderOptions,
  ContainerKeyValue,
} from './ipfsComponents/utilsComponents';
import InfoIpfsNode from './ipfsComponents/infoIpfsNode';
import PendingIpfsSettings from './PendingIpfsSettings';
import ErrorIpfsSettings from './ErrorIpfsSettings';
import { ContainerGradientText, Input } from '../../components';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import { ContainerGradientText, Input, ActionBar } from 'src/components';

const dataOpts = ['external', 'embedded'];

function IpfsSettings() {
  const [valueSelect, setValueSelec] = useState('external');
  const [valueInput, setValueInput] = useState('');
  // const [valueInputGateway, setValueInputGateway] = useState('');
  const { node: ipfs, isLoading: pending, error: failed } = useIpfs();
  const { clear } = useQueueIpfsContent();

  useEffect(() => {
    // getIpfsConfig(ipfs, IPFS_CONFIG_GATEWAY_ADDR).then((addr) =>
    //   setValueInputGateway(addr)
    // );
    const lsTypeIpfs = localStorage.getItem('ipfsState');
    if (lsTypeIpfs !== null) {
      const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
      const { ipfsNodeType, urlOpts } = lsTypeIpfsData;
      setValueSelec(ipfsNodeType);
      setValueInput(urlOpts);
      // if (userGateway) {
      //   setValueInputGateway(userGateway);
      // }
    }
  }, [ipfs]);

  const onChangeSelect = (item) => {
    setValueSelec(item);
    updateIpfsStateType(item);
  };

  const setNewUrl = useCallback(() => {
    updateIpfsStateUrl(valueInput);
  }, [valueInput]);

  // const setNewUrlGateway = useCallback(async () => {
  //   await setIpfsConfig(ipfs, IPFS_CONFIG_GATEWAY_ADDR, valueInputGateway);
  //   updateUserGatewayUrl(valueInputGateway);
  // }, [valueInputGateway]);

  const onClickReConnect = () => {
    const event = new Event('reconnectIpfsClient');
    clear();
    document.dispatchEvent(event);
  };

  const stateProps = {
    valueInput,
    valueSelect,
    setValueInput,
    dataOpts,
    onClickReConnect,
    onChangeSelect,
    pending,
    setNewUrl,
  };

  if (pending) {
    return <PendingIpfsSettings />;
  }

  if (!pending && failed !== null) {
    return <ErrorIpfsSettings stateErrorIpfsSettings={stateProps} />;
  }

  return (
    // <MainContainer>
    <ContainerGradientText>
      <div style={{ width: '100%', display: 'grid', gap: '20px' }}>
        <ContainerKeyValue>
          <div>client</div>

          <Select
            width="300px"
            valueSelect={valueSelect}
            textSelectValue={valueSelect !== '' ? valueSelect : ''}
            onChangeSelect={(item) => onChangeSelect(item)}
            custom
            disabled={pending}
          >
            {renderOptions(dataOpts, valueSelect)}
          </Select>
        </ContainerKeyValue>

        {valueSelect === 'external' && (
          <>
            <ContainerKeyValue>
              <div>api</div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '300px',
                  gap: '20px',
                  position: 'relative',
                }}
              >
                <Input
                  value={valueInput}
                  onChange={(e) => setValueInput(e.target.value)}
                />
                <BtnPasport
                  style={{ maxWidth: '100px' }}
                  typeBtn="blue"
                  onClick={() => setNewUrl()}
                >
                  edit
                </BtnPasport>
              </div>
            </ContainerKeyValue>
            {/* <ContainerKeyValue>
              <div>gateway</div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '300px',
                  gap: '20px',
                  position: 'relative',
                }}
              >
                <Input
                  value={valueInputGateway}
                  onChange={(e) => setValueInputGateway(e.target.value)}
                />
                <BtnPasport
                  style={{ maxWidth: '100px' }}
                  typeBtn="blue"
                  onClick={() => setNewUrlGateway()}
                >
                  edit
                </BtnPasport>
              </div>
            </ContainerKeyValue> */}
          </>
        )}

        <InfoIpfsNode />

        <ActionBar
          button={{
            text: 'Reconnect',
            onClick: onClickReConnect,
          }}
        />
      </div>
    </ContainerGradientText>
    // </MainContainer>
  );
}

export default IpfsSettings;
