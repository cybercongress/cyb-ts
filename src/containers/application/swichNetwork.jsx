import React, { useContext, useEffect } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { CYBER } from '../../utils/config';
import { fromBech32, selectNetworkImg } from '../../utils/utils';
import { BandwidthBar, ButtonNetwork, Tooltip } from '../../components';
import styles from './styles.scss';
import { AppContext } from '../../context';

const forEachObjbech32 = (data, prefix) => {
  const newObj = {};
  Object.keys(data).forEach((key) => {
    const valueObj = data[key];
    if (Object.prototype.hasOwnProperty.call(valueObj, 'cyber')) {
      const { bech32 } = valueObj.cyber;
      const bech32NewPrefix = fromBech32(bech32, prefix);
      newObj[key] = {
        ...valueObj,
        cyber: {
          ...valueObj.cyber,
          bech32: bech32NewPrefix,
        },
      };
    }
  });
  return newObj;
};

const updateAddress = async (prefix) => {
  const localStoragePocketAccount = await localStorage.getItem('pocketAccount');
  const localStoragePocket = await localStorage.getItem('pocket');

  if (localStoragePocket !== null) {
    const localStoragePocketData = JSON.parse(localStoragePocket);
    const newObjPocketData = forEachObjbech32(localStoragePocketData, prefix);
    localStorage.setItem('pocket', JSON.stringify(newObjPocketData));
  }
  if (localStoragePocketAccount !== null) {
    const localStoragePocketAccountData = JSON.parse(localStoragePocketAccount);
    const newObjAccountData = forEachObjbech32(
      localStoragePocketAccountData,
      prefix
    );
    localStorage.setItem('pocketAccount', JSON.stringify(newObjAccountData));
  }
};

function SwichNetwork({ onClickOpenMenu, bandwidth, countLink, amounPower }) {
  const [controlledVisible, setControlledVisible] = React.useState(false);
  const { networks } = useContext(AppContext);
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({
      trigger: 'click',
      closeOnOutsideClick: false,
      visible: controlledVisible,
      onVisibleChange: setControlledVisible,
      placement: 'bottom',
    });

  const onClickChain = async (chainId, prefix) => {
    localStorage.setItem('chainId', chainId);
    await updateAddress(prefix);
    window.location.reload();
  };

  const renderItemChain = Object.keys(networks)
    .filter((itemKey) => itemKey !== CYBER.CHAIN_ID)
    .map((key) => (
      // <ButtonNetwork
      //   // disabled={CYBER.CHAIN_ID === key}
      //   onClick={() =>
      //     onClickChain(key, networks[key].BECH32_PREFIX_ACC_ADDR_CYBER)
      //   }
      //   network={key}
      // />
      <button
        type="button"
        className={styles.containerBtnItemSelect}
        onClick={() =>
          onClickChain(key, networks[key].BECH32_PREFIX_ACC_ADDR_CYBER)
        }
      >
        <div className={styles.networkBtn}>
          <img
            style={{ width: '60px', height: '60px', position: 'relative' }}
            alt="cyb"
            src={selectNetworkImg(key)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '27px 0',
            color: '#1FCBFF',
            fontSize: '16px',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ whiteSpace: 'nowrap' }}>{key}</div>
        </div>
      </button>
    ));

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '100px 1fr',
          gap: '25px',
          alignItems: 'center',
          height: 100,
        }}
      >
        <button
          type="button"
          onClick={onClickOpenMenu}
          className={styles.networkBtn}
        >
          <img
            style={{ width: '60px', height: '60px', position: 'relative' }}
            alt="cyb"
            src={selectNetworkImg(CYBER.CHAIN_ID)}
          />
        </button>
        <div
          style={{
            display: 'flex',
            height: '100%',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '20px 0',
            color: '#1FCBFF',
            fontSize: 20,
          }}
        >
          <button
            className={styles.btnContainerText}
            type="button"
            style={{ fontSize: '20px' }}
            onClick={() => setControlledVisible((item) => !item)}
          >
            {CYBER.CHAIN_ID}
          </button>
          <div>
            <BandwidthBar
              height="10px"
              styleText={{ display: 'none' }}
              fontSize={12}
              colorText="#000"
              bwRemained={bandwidth.remained}
              bwMaxValue={bandwidth.maxValue}
              countLink={countLink}
              amounPower={amounPower}
            />
          </div>
        </div>
      </div>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({ className: styles.tooltipContainer })}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              background: '#000000',
              paddingLeft: '15px',
              width: '250px',
              paddingBottom: '15px',
            }}
          >
            {renderItemChain}
          </div>
        </div>
      )}
    </>
  );
}

export default SwichNetwork;
