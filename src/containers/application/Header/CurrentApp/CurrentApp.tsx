import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { routes } from 'src/routes';
import { CHAIN_ID } from 'src/constants/config';
import { useAppSelector } from 'src/redux/hooks';
import usePassportByAddress from 'src/features/passport/hooks/usePassportByAddress';
import { selectCurrentAddress } from 'src/redux/features/pocket';
import SubMenu from 'src/components/appMenu/SubMenu';
import useMediaQuery from '../../../../hooks/useMediaQuery';
import styles from './CurrentApp.module.scss';
import { selectNetworkImg } from '../../../../utils/utils';
import ChainInfo from './ui/ChainInfo/ChainInfo';
import findSelectAppByUrl from './utils/findSelectAppByUrl';
import AppSideBar from './ui/AppSideBar/AppSideBar';
import { menuButtonId } from './utils/const';

function CurrentApp() {
  const mediaQuery = useMediaQuery('(min-width: 768px)');
  const location = useLocation();
  const address = useAppSelector(selectCurrentAddress);
  const { passport } = usePassportByAddress(address);
  const [openMenu, setOpenMenu] = useState(true);

  const getRoute = useMemo(() => {
    const { pathname } = location;

    return findSelectAppByUrl(pathname, passport, address);
  }, [location, address, passport]);

  const toggleMenu = (newState: boolean) => {
    setOpenMenu(newState);
  };

  const closeMenu = () => {
    toggleMenu(false);
  };

  const toggleMenuFc = useMemo(() => () => toggleMenu(!openMenu), [openMenu]);

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
        <AppSideBar
          menuProps={{
            isOpen: mediaQuery || openMenu,
            toggleMenu: toggleMenuFc,
            closeMenu,
          }}
        >
          <SubMenu selectedApp={getRoute[0]} closeMenu={closeMenu} />
        </AppSideBar>
      )}
    </>
  );
}

export default CurrentApp;
