import { useMemo } from 'react';
import cx from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'src/routes';
import { renderSubItems } from 'src/components/appMenu/AppMenu';
import itemsMenu from 'src/utils/appsMenu';
import { CHAIN_ID } from 'src/constants/config';
import { useAppSelector } from 'src/redux/hooks';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import { Networks } from 'src/types/networks';
import { MenuItem, MenuItems } from '../../AppMenu';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import styles from './SwitchNetwork.module.scss';
import { selectNetworkImg } from '../../../../utils/utils';
import ChainInfo from './ui/ChainInfo/ChainInfo';

export const menuButtonId = 'menu-button';

function SwitchNetwork({ onClickOpenMenu, openMenu }) {
  const mediaQuery = useMediaQuery('(min-width: 768px)');
  const location = useLocation();
  const address = useAppSelector(selectCurrentAddress);
  const { passport } = usePassportByAddress(address);

  const isRobot =
    location.pathname.includes('@') || location.pathname.includes('neuron/');

  const passportChain = CHAIN_ID === Networks.BOSTROM && passport;

  let linkApp: string;
  if (passportChain) {
    linkApp = routes.robotPassport.getLink(passport.extension.nickname);
  } else if (address) {
    linkApp = routes.neuron.getLink(address);
  }

  const reduceRobotItems = (items: MenuItems) => {
    return items.reduce((acc: MenuItems, item: MenuItem) => {
      if (item.to === routes.robot.path) {
        item.subItems = !linkApp
          ? []
          : item.subItems.map((item) => ({
              ...item,
              to: `${linkApp}/${item.to}`,
            }));
      }

      return [...acc, { ...item }];
    }, []);
  };

  const getRoute = useMemo(() => {
    let { pathname } = location;
    let itemsMenuObj = itemsMenu();

    if (isRobot) {
      pathname = routes.robot.path;
    }

    itemsMenuObj = reduceRobotItems(itemsMenuObj);

    const findApp = itemsMenuObj.reduce((acc: MenuItems, item: MenuItem) => {
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
      <div className={styles.buttonWrapper}>
        <Link
          id={menuButtonId}
          to={getRoute[0]?.to || routes.oracle.path}
          className={styles.networkBtn}
        >
          <img
            alt="cyb"
            src={getRoute[0]?.icon || selectNetworkImg(CHAIN_ID)}
            className={styles.networkBtnImg}
          />
        </Link>
        {mediaQuery && <ChainInfo />}
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
