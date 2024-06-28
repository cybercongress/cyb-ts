import React from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Transition } from 'react-transition-group';
import cx from 'classnames';
import { useNetworks } from 'src/contexts/networks';
import { fromBech32, selectNetworkImg } from '../../../../utils/utils';
import { BandwidthBar } from '../../../../components';
import styles from './SwitchNetwork.module.scss';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import {
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initPocket } from 'src/redux/features/pocket';
import { Networks } from 'src/types/networks';
import { routes } from 'src/routes';
import { CHAIN_ID } from 'src/constants/config';

export const menuButtonId = 'menu-button';

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

const updateAddress = (prefix: any) => {
  const localStoragePocketAccount = localStorage.getItem('pocketAccount');
  const localStoragePocket = localStorage.getItem('pocket');

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

  const location = useLocation();
  // const navigate = useNavigate();
  const params = useParams();
  // const dispatch = useDispatch();

  const [controlledVisible, setControlledVisible] = React.useState(false);
  const { networks } = useNetworks();
  const { getTooltipProps, setTooltipRef, visible } = usePopperTooltip({
    trigger: 'click',
    closeOnOutsideClick: false,
    visible: controlledVisible,
    onVisibleChange: setControlledVisible,
    placement: 'bottom',
  });

  const onClickChain = async (chainId: Networks, prefix: any) => {
    localStorage.setItem('chainId', chainId);
    updateAddress(prefix);

    // dispatch(initPocket());

    let redirectHref = location.pathname;
    if (matchPath(routes.neuron.path, location.pathname)) {
      const newAddress = fromBech32(params.address, prefix);

      redirectHref = routes.neuron.getLink(newAddress);
    } else if (location.pathname.includes('@')) {
      redirectHref = routes.robot.path;
    }

    // TODO: remove reload page (need fix config)
    window.location.pathname = redirectHref;
  };

  const renderItemChain =
    networks &&
    Object.keys(networks)
      .filter((itemKey) => itemKey !== CHAIN_ID)
      .map((key) => (
        <button
          key={key}
          type="button"
          className={styles.containerBtnItemSelect}
          onClick={() => onClickChain(key, networks[key].BECH32_PREFIX)}
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
        className={styles.buttonWrapper}
        style={{
          display: 'grid',
          gridTemplateColumns: mediaQuery ? '100px 1fr' : '100px',
          gap: '25px',
          alignItems: 'center',
          height: 100,
        }}
      >
        <button
          id={menuButtonId}
          type="button"
          onClick={onClickOpenMenu}
          className={styles.networkBtn}
        >
          <img
            alt="cyb"
            src={selectNetworkImg(CHAIN_ID)}
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
          <div className={styles.containerInfoSwitch}>
            <button
              className={styles.btnContainerText}
              type="button"
              style={{ fontSize: '20px' }}
              onClick={() => setControlledVisible((item) => !item)}
            >
              {CHAIN_ID}
            </button>
            <div className={styles.containerBandwidthBar}>
              <BandwidthBar />
            </div>
          </div>
        )}
      </div>

      {/* {renderItemChain && Object.keys(renderItemChain).length > 0 && (
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
      )} */}
    </>
  );
}

export default SwitchNetwork;
