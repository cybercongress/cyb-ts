import cx from 'classnames';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import { useRef } from 'react';
import useMediaQuery from 'src/hooks/useMediaQuery';
import styles from './styles.scss';
import { menuButtonId } from './Header/CurrentApp/utils/const';
import BurgerIcon from './Header/CurrentApp/ui/BurgerIcon/BurgerIcon';

interface Props {
  children: React.ReactNode;
  menuProps: {
    isOpen: boolean;
    toggleMenu: () => void;
    closeMenu: () => void;
  };
}

function findElementInParents(element: HTMLElement, targetSelector: string) {
  let { parentElement } = element;

  while (parentElement) {
    if (parentElement.matches(targetSelector)) {
      return parentElement;
    }
    parentElement = parentElement.parentElement;
  }
  return null;
}

function AppSideBar({ children, menuProps }: Props) {
  const mediaQuery = useMediaQuery('(min-width: 768px)');
  const { isOpen, closeMenu, toggleMenu } = menuProps;
  const ref = useRef<HTMLElement>(null);

  useOnClickOutside(ref, (e) => {
    if (mediaQuery) {
      return;
    }

    const buttonMenu = findElementInParents(e.target, `#${menuButtonId}`);

    if (buttonMenu) {
      return;
    }

    closeMenu();
  });

  return (
    <aside
      ref={ref}
      className={cx(styles.sideBar, {
        [styles.sideBarHide]: !isOpen,
      })}
    >
      {!mediaQuery && (
        <button className={styles.toggleBtn} onClick={toggleMenu} type="button">
          <BurgerIcon openMenu={isOpen} />
        </button>
      )}
      {children}
    </aside>
  );
}

export default AppSideBar;
