import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';

import { AppContext } from '../../context';
import { activePassport } from './utils';
import GetCitizenship from './citizenship';
import PasportMoonCitizenship from './PasportMoonCitizenship';

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
  const { jsCyber } = useContext(AppContext);
  const [stagePortal, setStagePortal] = useState(STAGE_LOADING);

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

  if (stagePortal === STAGE_LOADING) {
    return <div>...</div>;
  }

  if (stagePortal === STAGE_INIT) {
    return <GetCitizenship />;
  }

  if (stagePortal === STAGE_READY) {
    return <PasportMoonCitizenship />;
  }

  return null;
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(PortalCitizenship);
