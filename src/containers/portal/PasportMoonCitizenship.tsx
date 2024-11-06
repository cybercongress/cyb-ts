import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDevice } from 'src/contexts/device';
import { useQueryClient } from 'src/contexts/queryClient';
import {
  MainContainer,
  ActionBarSteps,
  MoonAnimation,
  Stars,
} from './components';
import useSetActiveAddress from '../../hooks/useSetActiveAddress';
import { activePassport, parseRowLog } from './utils';
import PasportCitizenship from './pasport';
import Info from './citizenship/Info';
import { steps } from './citizenship/utils';
import STEP_INFO from './gift/utils';
import ActionBarPortalGift from './gift/ActionBarPortalGift';
import ActionBarAddAvatar from './ActionBarAddAvatar';
import { Button } from '../../components';
import { routes } from 'src/routes';
import { useAppSelector } from 'src/redux/hooks';
import { selectCurrentPassport } from 'src/features/passport/passports.redux';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import { useAdviser } from 'src/features/adviser/context';
import { selectAccountsPassports } from 'src/features/passport/passports.redux';
import usePassportContract from 'src/features/passport/usePassportContract';
import { Citizenship } from 'src/types/citizenship';

const portalAmbient = require('../../sounds/portalAmbient112.mp3');

// const STAGE_LOADING = 0;
// const STAGE_READY = 2;

const STATE_AVATAR = 15;

const portalAmbientObg = new Audio(portalAmbient);
const playPortalAmbient = () => {
  portalAmbientObg.loop = true;
  portalAmbientObg.play();
};

const stopPortalAmbient = () => {
  portalAmbientObg.loop = false;
  portalAmbientObg.pause();
  portalAmbientObg.currentTime = 0;
};

function PassportMoonCitizenship() {
  const { isMobile: mobile } = useDevice();
  const defaultAccount = useAppSelector((state) => state.pocket.defaultAccount);
  const accountsPassports = useAppSelector(selectAccountsPassports);

  const citizenship = useAppSelector(selectCurrentPassport);
  // FIXME: backward compatibility

  const queryClient = useQueryClient();
  const { addressActive } = useSetActiveAddress(defaultAccount);
  const [selectedAddress, setSelectedAddress] = useState(null);
  // const [updateFunc, setUpdateFunc] = useState(0);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [appStep, setStepApp] = useState(STEP_INFO.STATE_INIT);
  const [txHash, setTxHash] = useState(null);

  const { setAdviser } = useAdviser();

  useEffect(() => {
    playPortalAmbient();

    return () => {
      stopPortalAmbient();
    };
  }, []);

  useEffect(() => {
    const confirmTx = async () => {
      if (queryClient && txHash !== null && txHash.status === 'pending') {
        const response = await queryClient.getTx(txHash.txHash);
        if (response && response !== null) {
          if (response.code === 0) {
            // setUpdateFunc((item) => item + 1);
            setTxHash((item) => ({
              ...item,
              status: 'confirmed',
            }));
            setStepApp(STEP_INFO.STATE_INIT);

            return;
          }
          if (response.code) {
            setTxHash((item) => ({
              ...item,
              status: 'error',
              rawLog: parseRowLog(response.rawLog.toString()),
            }));
            setStepApp(STEP_INFO.STATE_INIT);
            // setErrorMessage(response.rawLog);
            return;
          }
        }
        setTimeout(confirmTx, 1500);
      }
    };
    confirmTx();
  }, [queryClient, txHash]);

  useEffect(() => {
    const nickname = citizenship?.extension?.nickname || '';

    const content = (
      <Info stepCurrent={steps.STEP_CHECK_GIFT} nickname={nickname} />
    );

    setAdviser(content);
  }, [setAdviser, citizenship]);

  const onClickProveeAddress = () => {
    setStepApp(STEP_INFO.STATE_PROVE_CONNECT);
  };

  const onClickDeleteAddress = () => {
    setStepApp(STEP_INFO.STATE_DELETE_ADDRESS);
  };

  const onClickEditAvatar = () => {
    setStepApp(STATE_AVATAR);
  };

  const updateTxHash = (data) => {
    setTxHash(data);
  };

  const convertPassportToCitizenship = (passport: any): Citizenship => {
    return {
      owner: addressActive?.bech32,
      extension: {
        nickname: passport.extension?.nickname,
        avatar: passport.extension?.avatar,
        addresses: passport.extension?.addresses,
      },
    };
  };

  const activePassport = usePassportContract<Citizenship>({
    query: {
      active_passport: {
        address: addressActive?.bech32,
      },
    },
  });

  const passportIds = usePassportContract<{ tokens: string[] }>({
    query: {
      tokens: {
        owner: addressActive?.bech32,
      },
    },
  });

  function PassportLoader({
    tokenId,
    render,
  }: {
    tokenId: string;
    render: (passport: Citizenship) => JSX.Element | null;
  }) {
    const { data: passport } = usePassportContract<Citizenship>({
      query: {
        nft_info: {
          token_id: tokenId,
        },
      },
    });

    if (!passport) {
      return null;
    }
    console.debug('passport', passport);
    console.debug(
      'convertPassportToCitizenship(passport)',
      convertPassportToCitizenship(passport)
    );
    return render(passport);
  }

  return (
    <>
      <MainContainer>
        <Stars />
        {!mobile && <MoonAnimation />}

        {passportIds.data?.tokens.map((tokenId) => (
          <PassportLoader
            key={tokenId}
            tokenId={tokenId}
            render={(passport) => (
              <PasportCitizenship
                citizenship={convertPassportToCitizenship(passport)}
                initStateCard={false}
                txHash={txHash}
                onClickProveeAddress={onClickProveeAddress}
                onClickDeleteAddress={onClickDeleteAddress}
                onClickEditAvatar={onClickEditAvatar}
                /* updateFunc={setSelectedAddress} */
              />
            )}
          />
        ))}
      </MainContainer>
      {Math.floor(appStep) === STEP_INFO.STATE_INIT && (
        <ActionBarSteps>
          <Button link={routes.gift.path}>Check gift</Button>
        </ActionBarSteps>
      )}
      {Math.floor(appStep) !== STEP_INFO.STATE_INIT &&
        Math.floor(appStep) < STATE_AVATAR && (
          <ActionBarPortalGift
            // updateFunc={() => setUpdateFunc((item) => item + 1)}
            addressActive={addressActive}
            citizenship={citizenship}
            updateTxHash={updateTxHash}
            selectedAddress={selectedAddress}
            activeStep={appStep}
            setStepApp={setStepApp}
          />
        )}

      {Math.floor(appStep) === STATE_AVATAR && (
        <ActionBarAddAvatar
          step={appStep}
          setStep={setStepApp}
          updateTxHash={updateTxHash}
          citizenship={citizenship}
        />
      )}
    </>
  );
}

export default PassportMoonCitizenship;
