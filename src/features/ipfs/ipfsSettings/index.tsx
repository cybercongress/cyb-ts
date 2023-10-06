import { useCallback, useEffect, useState } from 'react';
import { useIpfs } from 'src/contexts/ipfs';
import {
  ContainerGradientText,
  Input,
  ActionBar,
  Button,
} from 'src/components';
import { Pane } from '@cybercongress/gravity';

import { useAdviser } from 'src/features/adviser/context';
import BtnPassport from '../../../containers/portal/pasport/btnPasport';
import Select from '../../../containers/teleport/components/select';
import {
  updateIpfsStateUrl,
  updateIpfsStateType,
  updateUserGatewayUrl,
  renderOptions,
  ContainerKeyValue,
} from './ipfsComponents/utilsComponents';
import InfoIpfsNode from './ipfsComponents/infoIpfsNode';
import ErrorIpfsSettings from './ErrorIpfsSettings';
import ComponentLoader from './ipfsComponents/ipfsLoader';
import Drive from '../Drive';
const dataOpts = ['external', 'embedded', 'helia'];

function IpfsSettings() {
  const [valueSelect, setValueSelect] = useState('external');
  const [valueInput, setValueInput] = useState('');
  const [valueInputGateway, setValueInputGateway] = useState('');
  const { isLoading: pending, error: failed } = useIpfs();

  useEffect(() => {
    const lsTypeIpfs = localStorage.getItem('ipfsState');
    if (lsTypeIpfs !== null) {
      const lsTypeIpfsData = JSON.parse(lsTypeIpfs);
      const { ipfsNodeType, urlOpts, userGateway } = lsTypeIpfsData;
      setValueSelect(ipfsNodeType);
      setValueInput(urlOpts);
      if (userGateway) {
        setValueInputGateway(userGateway);
      }
    }
  }, []);

  const adviserContext = useAdviser();

  useEffect(() => {
    adviserContext.setAdviser(
      pending ? 'trying to connect to ipfs...' : null,
      'yellow'
    );
  }, [adviserContext, pending]);

  const onChangeSelect = (item) => {
    setValueSelect(item);
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

  if (!pending && failed) {
    return <ErrorIpfsSettings stateErrorIpfsSettings={stateProps} />;
  }

  return (
    <ContainerGradientText>
      <div style={{ display: 'grid', gap: '20px' }}>
        <Drive />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <ContainerKeyValue>
              <div>client</div>

              <Select
                width="300px"
                valueSelect={valueSelect}
                textSelectValue={valueSelect !== '' ? valueSelect : ''}
                onChangeSelect={(item) => onChangeSelect(item)}
                custom
                // disabled={pending}
              >
                {renderOptions(dataOpts)}
              </Select>
            </ContainerKeyValue>

            {valueSelect === 'external' && (
              <>
                <ContainerKeyValue>
                  <div>api</div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '280px 50px',
                      gap: '20px',
                      position: 'relative',
                    }}
                  >
                    <Input
                      value={valueInput}
                      onChange={(e) => setValueInput(e.target.value)}
                    />
                    <BtnPassport
                      style={{ maxWidth: '100px' }}
                      typeBtn="blue"
                      onClick={() => setNewUrl()}
                    >
                      edit
                    </BtnPassport>
                  </div>
                </ContainerKeyValue>
                <ContainerKeyValue>
                  <div>gateway</div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '280px 50px',
                      gap: '20px',
                      position: 'relative',
                    }}
                  >
                    <Input
                      value={valueInputGateway}
                      onChange={(e) => setValueInputGateway(e.target.value)}
                    />
                    <BtnPassport
                      style={{ maxWidth: '100px' }}
                      typeBtn="blue"
                      onClick={() => setNewUrlGateway()}
                    >
                      edit
                    </BtnPassport>
                  </div>
                </ContainerKeyValue>
              </>
            )}
          </div>
          <div>
            <InfoIpfsNode />
          </div>
        </div>

        {pending && (
          <ComponentLoader
            style={{ margin: '20px auto 10px', width: '100px' }}
          />
        )}
        <Pane
          width="100%"
          display="flex"
          marginBottom={20}
          padding={10}
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
        >
          <Button onClick={onClickReConnect}>Reconnect</Button>
        </Pane>
        {/* <ActionBar>
          <Button onClick={onClickReConnect}>Reconnect</Button>
          <Button onClick={console.log}>Sync drive</Button>
        </ActionBar> */}
      </div>
    </ContainerGradientText>
  );
}

export default IpfsSettings;
