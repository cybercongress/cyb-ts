import { useEffect, useState } from 'react';
import cx from 'classnames';
import CurrentApp from './CurrentApp/CurrentApp';
import Electricity from '../../home/electricity';
import SwitchAccount from './SwitchAccount/SwitchAccount';
import Commander from './Commander/Commander';
import styles from './Header.module.scss';

function Header() {
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
      <CurrentApp />

      <Commander />

      {/* <AdviserContainer /> */}

      <Electricity />
      <SwitchAccount />
    </header>
  );
}

export default Header;
