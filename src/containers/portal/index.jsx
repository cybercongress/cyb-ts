import { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import { useQueryClient } from 'src/contexts/queryClient';
import { activePassport } from './utils';
import GetCitizenship from './citizenship';
import PasportMoonCitizenship from './PasportMoonCitizenship';

const STAGE_LOADING = 0;
const STAGE_INIT = 1;
const STAGE_READY = 2;

function PortalCitizenship({ defaultAccount }) {
  const queryClient = useQueryClient();
  const [stagePortal, setStagePortal] = useState(STAGE_LOADING);

  useEffect(() => {
    const getPasport = async () => {
      if (stagePortal === STAGE_LOADING) {
        setStagePortal(STAGE_LOADING);
        if (queryClient) {
          const addressActive = getActiveAddress(defaultAccount);
          if (addressActive !== null) {
            const response = await activePassport(
              queryClient,
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
  }, [queryClient, defaultAccount, stagePortal]);

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
