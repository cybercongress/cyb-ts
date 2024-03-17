import React, { useMemo } from 'react';
import { usePopperTooltip } from 'react-popper-tooltip';
import { Transition } from 'react-transition-group';
import cx from 'classnames';
import { useNetworks } from 'src/contexts/networks';
import { CYBER } from '../../../../utils/config';
import { fromBech32, selectNetworkImg } from '../../../../utils/utils';
import { BandwidthBar } from '../../../../components';
import styles from './SwitchNetwork.module.scss';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import {
  Link,
  matchPath,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { initPocket } from 'src/redux/features/pocket';
import { Networks } from 'src/types/networks';
import { routes } from 'src/routes';
import { renderSubItems } from 'src/components/appMenu/AppMenu';
import itemsMenu from 'src/utils/appsMenu';
import { MenuItem, MenuItems } from '../../AppMenu';

export const menuButtonId = 'menu-button';

function SwitchNetwork({ onClickOpenMenu, openMenu }) {
  const mediaQuery = useMediaQuery('(min-width: 768px)');

  const location = useLocation();

  const getRoute = useMemo(() => {
    let { pathname } = location;
    if (
      location.pathname.includes('@') ||
      location.pathname.includes('neuron/')
    ) {
      pathname = routes.robot.path;
    }

    const findApp = itemsMenu().reduce((acc: MenuItems, item: MenuItem) => {
      if (item.to === pathname) {
        acc.push(item);
      } else if (
        item.subItems.filter((item) => item.to === pathname).length !== 0
      ) {
        acc.push(item);
      }
      return acc;
    }, []);

    return findApp;
  }, [location]);

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
        <Link
          id={menuButtonId}
          to={getRoute[0]?.to || routes.oracle.path}
          // onClick={onClickOpenMenu}
          className={styles.networkBtn}
        >
          <img
            alt="cyb"
            src={getRoute[0]?.icon || selectNetworkImg(CYBER.CHAIN_ID)}
            className={styles.networkBtnImg}
          />
          {/* <div
            className={cx(styles.networkBtnImgIconMenu, {
              [styles.networkBtnImgIconMenuClose]: !openMenu,
            })}
          >
            <div />
            <div />
            <div />
          </div> */}
        </Link>
        {mediaQuery && (
          <div className={styles.containerInfoSwitch}>
            <button
              className={styles.btnContainerText}
              type="button"
              style={{ fontSize: '20px' }}
            >
              {CYBER.CHAIN_ID}
            </button>
            <div className={styles.containerBandwidthBar}>
              <BandwidthBar />
            </div>
          </div>
        )}
      </div>

      {getRoute && getRoute[0] && (
        <div className={cx(styles.containerSubItems, styles.tooltipContainer)}>
          {renderSubItems(getRoute[0].subItems, location, undefined)}
        </div>
      )}
    </>
  );
}

export default SwitchNetwork;
