import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Transition } from 'react-transition-group';
import cx from 'classnames';
import { useNetworks } from 'src/contexts/networks';
import { CYBER } from '../../../../utils/config';
import { fromBech32, selectNetworkImg } from '../../../../utils/utils';
import { BandwidthBar } from '../../../../components';
import styles from './SwitchNetwork.module.scss';
import useMediaQuery from '../../../../hooks/useMediaQuery';

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

const updateAddress = async (prefix: any) => {
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

function SwitchNetwork({ onClickOpenMenu, openMenu }) {
  const mediaQuery = useMediaQuery('(min-width: 768px)');
  const [controlledVisible, setControlledVisible] = React.useState(false);
  const { networks } = useNetworks();
  const { getTooltipProps, setTooltipRef, visible } = usePopperTooltip({
    trigger: 'click',
    closeOnOutsideClick: false,
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
    placement: 'bottom',
  });

  const onClickChain = async (chainId: string, prefix: any) => {
    localStorage.setItem('chainId', chainId);
    await updateAddress(prefix);
    window.location.reload();
  };

  const renderItemChain =
    networks &&
    Object.keys(networks)
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
          key={key}
          type="button"
          className={styles.containerBtnItemSelect}
          onClick={() =>
            onClickChain(key, networks[key].BECH32_PREFIX_ACC_ADDR_CYBER)
          }
        >
          <div className={styles.networkBtn}>
            <img
              className={styles.networkBtnImg}
              alt="cyb"
              src={selectNetworkImg(key)}
            />
          </div>
          <div
            style={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              // justifyContent: 'space-between',
              // padding: '27px 0',
              color: '#1FCBFF',
              fontSize: '16px',
              alignItems: 'flex-start',
            }}
          >
            <div className={styles.containerBtnItemSelect}>{key}</div>
          </div>
        </button>
      ));

  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: mediaQuery ? '100px 1fr' : '100px',
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
            alt="cyb"
            src={selectNetworkImg(CYBER.CHAIN_ID)}
            className={styles.networkBtnImg}
          />
          <div
            className={cx(styles.networkBtnImgIconMenu, {
              [styles.networkBtnImgIconMenuClose]: !openMenu,
            })}
          >
            <div />
            <div />
            <div />
          </div>
        </button>
        {mediaQuery && (
          <div
            style={{
              display: 'flex',
              height: '100%',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '27px 0',
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
              <BandwidthBar />
            </div>
          </div>
        )}
      </div>

      {renderItemChain && Object.keys(renderItemChain).length > 0 && (
        <Transition in={visible} timeout={300}>
          {(state) => {
            return (
              <div
                ref={setTooltipRef}
                {...getTooltipProps({ className: styles.tooltipContainer })}
              >
                <div
                  className={cx(styles.containerSwichNetworkList, [
                    styles[`containerSwichNetworkList${state}`],
                  ])}
                >
                  {renderItemChain}
                </div>
              </div>
            );
          }}
        </Transition>
      )}
    </>
  );
}

export default SwitchNetwork;
