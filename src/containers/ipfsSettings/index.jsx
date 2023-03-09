import React, { useCallback, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { ContainerGradientText, MainContainer } from '../portal/components';
import BtnPasport from '../portal/pasport/btnPasport';
import Select from '../teleport/components/select';
import Input from '../teleport/components/input';
import {
  updateIpfsStateUrl,
  updateIpfsStateType,
  updateUserGatewayUrl,
  renderOptions,
  ContainerKeyValue,
} from './ipfsComponents/utilsComponents';
import InfoIpfsNode from './ipfsComponents/infoIpfsNode';
import PendingIpfsSettings from './PendingIpfsSettings';
import ErrorIpfsSettings from './ErrorIpfsSettings';

const dataOpts = ['external', 'embedded'];

function IpfsSettings({ ipfs, failed, ready, pending }) {
  const [valueSelect, setValueSelec] = useState('external');
  const [valueInput, setValueInput] = useState('');
  const [valueInputGateway, setValueInputGateway] = useState('');

  useEffect(() => {
    const lsTypeIpfs = localStorage.getItem('ipfsState');
    if (lsTypeIpfs !== null) {
      const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
      const { ipfsNodeType, urlOpts, userGateway } = lsTypeIpfsData;
      setValueSelec(ipfsNodeType);
      setValueInput(urlOpts);
      if (userGateway) {
        setValueInputGateway(userGateway);
      }
    }
  }, []);

  const onChangeSelect = (item) => {
    setValueSelec(item);
    updateIpfsStateType(item);
  };

  const setNewUrl = useCallback(() => {
    updateIpfsStateUrl(valueInput);
  }, [valueInput]);

  const setNewUrlGateway = useCallback(() => {
    updateUserGatewayUrl(valueInputGateway);
  }, [valueInputGateway]);

  const onClickReConnect = () => {
    const event = new Event('reconnectIpfsClient');
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
    <MainContainer>
      <ContainerGradientText
        userStyleContent={{ width: '100%', display: 'grid', gap: '20px' }}
      >
        <BtnPasport
          style={{ maxWidth: '100px' }}
          typeBtn="blue"
          onClick={() => onClickReConnect()}
        >
          reconnect
        </BtnPasport>

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
            <ContainerKeyValue>
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
            </ContainerKeyValue>
          </>
        )}

        <InfoIpfsNode ipfs={ipfs} />
      </ContainerGradientText>
    </MainContainer>
  );
}

const mapStateToProps = (store) => {
  return {
    ipfs: store.ipfs.ipfs,
    failed: store.ipfs.failed,
    ready: store.ipfs.ready,
    pending: store.ipfs.pending,
  };
};

export default connect(mapStateToProps)(IpfsSettings);
