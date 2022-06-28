import React, { useEffect, useState, useContext } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { MainContainer, InfoCard } from './components';
import { AppContext } from '../../context';
import { activePassport } from './utils';
import Release from './release';
import PortalGift from './gift';
import styles from './styles.scss';

const spacePussy = require('../../image/space-pussy.svg');
const arrowSpacePussy = require('../../image/arrowSpacePussy.svg');

const STAGE_LOADING = 0;
const STAGE_INIT = 1;
const STAGE_PROVE = 2;
const STAGE_RELEASE = 3;

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

function MainPartal({ defaultAccount }) {
  const history = useHistory();
  const { jsCyber } = useContext(AppContext);
  const [stagePortal, setStagePortal] = useState(STAGE_LOADING);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const getPasport = async () => {
      if (stagePortal === STAGE_LOADING) {
        setStagePortal(STAGE_LOADING);
        if (jsCyber !== null) {
          const addressActive = getActiveAddress(defaultAccount);
          if (addressActive !== null) {
            const responseActivePassport = await activePassport(
              jsCyber,
              addressActive.bech32
            );
            if (responseActivePassport !== null) {
              const { addresses } = responseActivePassport.extension;
              if (addresses !== null) {
                setStagePortal(STAGE_RELEASE);
              } else {
                setStagePortal(STAGE_PROVE);
              }
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

  const onClickSpacePussy = () => {
    setScale(6);
    setTimeout(() => {
      history.push('/citizenship');
      // setScale(1);
    }, 2305);
  };

  if (stagePortal === STAGE_LOADING) {
    return <div>...</div>;
  }

  if (stagePortal === STAGE_INIT) {
    return (
      <MainContainer minHeight="100vh">
        {scale === 1 && (
          <InfoCard>
            The measure of intelligence is ability to change. Albert Einstein
          </InfoCard>
        )}

        <div
          style={{
            position: 'fixed',
            zIndex: '3',
            left: '50%',
            marginRight: '-50%',
            transform: `translate(-50%, 70px) scale(${scale})`,
            transition: 'all 2.3s cubic-bezier(0.67, 0.01, 0.37, 1.01) 0s',
          }}
        >
          <img style={{ width: '100%' }} src={spacePussy} alt="spacePussy" />
          <button
            type="button"
            onClick={() => onClickSpacePussy()}
            className={styles.buttonSpacePussy}
          >
            <div className={styles.textSpacePussy}>cyberverse</div>
            <img
              className={styles.arrowSpacePussy}
              src={arrowSpacePussy}
              alt="arrowSpacePussy"
            />
          </button>
        </div>
      </MainContainer>
    );
  }

  if (stagePortal === STAGE_PROVE) {
    return <PortalGift />;
  }

  if (stagePortal === STAGE_RELEASE) {
    return <Release />;
  }

  return null;
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(MainPartal);
