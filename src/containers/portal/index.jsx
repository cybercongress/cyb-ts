import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { ActionBar, Button } from '@cybercongress/gravity';
import { useHistory } from 'react-router-dom';
import {
  ContainerGradient,
  Signatures,
  ScrollableTabs,
  MainContainer,
  ActionBarSteps,
  BtnGrd,
} from './components';
import Input from '../teleport/components/input';
import { AppContext } from '../../context';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { activePassport } from './utils';
import PasportCitizenship from './pasport';
import GetCitizenship from './citizenship';
import Info from './citizenship/Info';
import { steps } from './citizenship/utils';

const styleSteps = { width: '120px', height: '40px' };
const items = [
  'nickname',
  'rules',
  'avatar',
  'install keplr',
  'setup keplr',
  'connect keplr',
  'passport look',
];

const STAGE_LOADING = 0;
const STAGE_INIT = 1;
const STAGE_READY = 2;

function PortalCitizenship({ defaultAccount }) {
  const history = useHistory();
  const { keplr, jsCyber } = useContext(AppContext);
  // const { addressActive } = useSetActiveAddress(defaultAccount);
  const [stagePortal, setStagePortal] = useState(STAGE_LOADING);
  const [citizenship, setCitizenship] = useState(null);

  useEffect(() => {
    const getPasport = async () => {
      if (stagePortal === STAGE_LOADING) {
        setStagePortal(STAGE_LOADING);
        if (jsCyber !== null) {
          const addressActive = getActiveAddress(defaultAccount);
          if (addressActive !== null) {
            const response = await activePassport(
              jsCyber,
              addressActive.bech32
            );
            console.log('response', response);
            if (response !== null) {
              console.log('response', response);
              setCitizenship(response);
              setStagePortal(STAGE_READY);
            } else {
              setStagePortal(STAGE_INIT);
            }
          } else {
            setStagePortal(STAGE_INIT);
          }
        } else {
          setStagePortal(STAGE_LOADING);
        }
      }
    };
    getPasport();
  }, [jsCyber, defaultAccount, stagePortal]);

  const getActiveAddress = (address) => {
    const { account } = address;
    let addressPocket = null;
    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cyber')
    ) {
      const { keys, bech32 } = account.cyber;
      addressPocket = {
        bech32,
        keys,
      };
    }
    return addressPocket;
  };

  const checkKeplr = () => {
    console.log(`window.keplr `, window.keplr);
    console.log(`window.getOfflineSignerAuto`, window.getOfflineSignerAuto);
  };

  if (stagePortal === STAGE_LOADING) {
    return <div>...</div>;
  }

  if (stagePortal === STAGE_INIT) {
    return <GetCitizenship />;
  }

  if (stagePortal === STAGE_READY) {
    const nickname = citizenship !== null ? citizenship.extension.nickname : '';
    return (
      <>
        <MainContainer>
          <Info stepCurrent={steps.STEP_CHECK_GIFT} nickname={nickname || ''} />
          <PasportCitizenship citizenship={citizenship} />
        </MainContainer>
        <ActionBarSteps>
          <BtnGrd
            text="check gift"
            onClick={() => history.push('/portalGift')}
          />
        </ActionBarSteps>
      </>
    );
  }

  return null;
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(PortalCitizenship);
