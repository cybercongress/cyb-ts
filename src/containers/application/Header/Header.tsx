import SwitchNetwork from './SwitchNetwork/SwitchNetwork';
import Electricity from '../../home/electricity';
import SwitchAccount from './SwitchAccount/SwitchAccount';
import Commander from './Commander/Commander';
import styles from './Header.module.scss';
import { useEffect, useState } from 'react';
import cx from 'classnames';
import AdviserContainer from 'src/features/adviser/AdviserContainer';

type Props = {
  menuProps: {
    isOpen: boolean;
    toggleMenu: () => void;
  };
};

function Header({ menuProps }: Props) {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    function onScroll() {
      let updateScroll = false;
      if (window.scrollY > 40) {
        updateScroll = true;
      }

      if (scroll !== updateScroll) {
        setScroll(updateScroll);
      }
    }

    document.addEventListener('scroll', onScroll);

    return () => {
      document.removeEventListener('scroll', onScroll);
    };
  }, [scroll]);

  return (
    <header
      className={cx(styles.wrapper, {
        [styles.scroll]: scroll,
      })}
    >
      <SwitchNetwork
        openMenu={menuProps.isOpen}
        onClickOpenMenu={menuProps.toggleMenu}
      />

      <Commander />

      {/* <AdviserContainer /> */}

      <Electricity />
      <SwitchAccount />
    </header>
  );
}

export default Header;
