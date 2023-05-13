import SwitchNetwork from './SwitchNetwork/SwitchNetwork';
import Electricity from '../../home/electricity';
import SwitchAccount from './SwitchAccount/SwitchAccount';
import Commander from './Commander/Commander';
import styles from './Header.module.scss';

type Props = {
  menuProps: {
    isOpen: boolean;
    toggleMenu: () => void;
  };
};

function Header({ menuProps }: Props) {
  return (
    <header className={styles.wrapper}>
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
