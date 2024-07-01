import { useCallback, useEffect, useState } from 'react';
import {
  Input,
  Button,
  Display,
  DisplayTitle,
} from 'src/components';
import { Pane } from '@cybercongress/gravity';

import { useAdviser } from 'src/features/adviser/context';
import Select from 'src/containers/warp/components/Select';
import { AdviserColors } from 'src/features/adviser/Adviser/Adviser';
import BtnPassport from '../../../containers/portal/pasport/btnPasport';
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
import { useBackend } from 'src/contexts/backend/backend';
import { IPFSNodes } from 'src/services/ipfs/types';

const dataOpts = [IPFSNodes.EXTERNAL, IPFSNodes.EMBEDDED, IPFSNodes.HELIA];

function IpfsSettings() {
  const [valueSelect, setValueSelect] = useState(IPFSNodes.HELIA);
  const [valueInput, setValueInput] = useState('');
  const [valueInputGateway, setValueInputGateway] = useState('');
  const { isIpfsInitialized, ipfsError: failed, loadIpfs } = useBackend();

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

  const { setAdviser } = useAdviser();

  useEffect(() => {
    let text;
    let status: AdviserColors = undefined;
    if (!isIpfsInitialized) {
      text = 'trying to connect to ipfs...';
      status = 'yellow';
    } else {
      text = (
        <>
          manage and store neurones public data drive <br />
          drive storing data forever before the 6th great extinction
        </>
      );
    }

    setAdviser(text, status);
  }, [setAdviser, isIpfsInitialized]);

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
    loadIpfs();
  };

  const stateProps = {
    valueInput,
    valueSelect,
    setValueInput,
    dataOpts,
    onClickReConnect,
    onChangeSelect,
    pending: !isIpfsInitialized,
    setNewUrl,
  };

  if (failed) {
    return <ErrorIpfsSettings stateErrorIpfsSettings={stateProps} />;
  }

  return (
    <Display title={<DisplayTitle title="drive" />}>
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
                disabled={!isIpfsInitialized}
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

        {!isIpfsInitialized && (
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
    </Display>
  );
}

export default IpfsSettings;
