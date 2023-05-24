import SwitchNetwork from './SwitchNetwork/SwitchNetwork';
import Electricity from '../../home/electricity';
import SwitchAccount from './SwitchAccount/SwitchAccount';
import Commander from './Commander/Commander';
import styles from './Header.module.scss';
import { useEffect, useState } from 'react';
import cx from 'classnames';

type Props = {
  menuProps: {
    isOpen: boolean;
    toggleMenu: () => void;
  };
};

function Header({ menuProps }: Props) {
  const [scroll, setScroll] = useState(false);

  useEffect(() => {
    function onScroll(e) {
      let s = false;
      if (window.scrollY > 40) {
        s = true;
      }

      if (scroll !== s) {
        setScroll(s);
      }
    }

    document.addEventListener('scroll', onScroll);

    return () => {};
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

      <Electricity />
      <SwitchAccount />
    </header>
  );
}

export default Header;
