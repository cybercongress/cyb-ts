import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { useQueryClient } from 'src/contexts/queryClient';
import { activePassport } from './utils';
import GetCitizenship from './citizenship';
import PasportMoonCitizenship from './PasportMoonCitizenship';
import { RootState } from 'src/redux/store';

const STAGE_LOADING = 0;
const STAGE_INIT = 1;
const STAGE_READY = 2;

function PortalCitizenship() {
  const queryClient = useQueryClient();
  const [stagePortal, setStagePortal] = useState(STAGE_LOADING);

  const { defaultAccount } = useSelector((state: RootState) => state.pocket);
  const addressActive = defaultAccount?.account?.cyber?.bech32;

  useEffect(() => {
    const getPassport = async () => {
      if (!queryClient) {
        return;
      }

      try {
        if (!addressActive) {
          setStagePortal(STAGE_INIT);
          return;
        }

        const response = await activePassport(queryClient, addressActive);

        if (response) {
          setStagePortal(STAGE_READY);
        } else {
          setStagePortal(STAGE_INIT);
        }
      } catch (error) {
        setStagePortal(STAGE_INIT);
      }
    };

    getPassport();
  }, [queryClient, addressActive, stagePortal]);

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

export default PortalCitizenship;
