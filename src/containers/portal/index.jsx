import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { ActionBar, Button } from '@cybercongress/gravity';
import { useHistory } from 'react-router-dom';
import { ContainerGradient, Signatures, ScrollableTabs } from './components';
import Input from '../teleport/components/input';
import { AppContext } from '../../context';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { activePassport } from './utils';
import PasportCitizenship from './pasport';
import GetCitizenship from './citizenship';

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
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [stagePortal, setStagePortal] = useState(STAGE_READY);
  const [citizenship, setCitizenship] = useState(null);
// console.log('stagePortal', stagePortal)

  // useEffect(() => {
  //   const getPasport = async () => {
  //     setStagePortal(STAGE_LOADING);
  //     if (jsCyber !== null) {
  //       if (addressActive !== null) {
  //         const response = await activePassport(jsCyber, addressActive.bech32);
  //         if (response !== null) {
  //           console.log('response', response);
  //           setCitizenship(response);
  //           setStagePortal(STAGE_READY);
  //         } else {
  //           setStagePortal(STAGE_INIT);
  //         }
  //       } else {
  //         setStagePortal(STAGE_INIT);
  //       }
  //     } else {
  //       setStagePortal(STAGE_LOADING);
  //     }
  //   };
  //   getPasport();

  //   return () => {
  //     setCitizenship(null);
  //   };
  // }, [jsCyber, addressActive]);

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
    return (
      <>
        <main
          style={{ minHeight: 'calc(100vh - 162px)', overflow: 'hidden' }}
          className="block-body"
        >
          <div
            style={{
              width: '60%',
              margin: '0px auto',
              display: 'grid',
              gap: '20px',
            }}
          >
            <PasportCitizenship citizenship={citizenship} />
          </div>
        </main>
        <ActionBar>
          <Button onClick={() => history.push('/portalGift')}>
            check gift
          </Button>
        </ActionBar>
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
