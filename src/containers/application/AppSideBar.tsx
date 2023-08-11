import cx from 'classnames';
import styles from './styles.scss';
import useOnClickOutside from 'src/hooks/useOnClickOutside';
import { useRef } from 'react';
import { menuButtonId } from './Header/SwitchNetwork/SwitchNetwork';

interface Props {
  children: React.ReactNode;
  openMenu: boolean;
  closeMenu: () => void;
}

export function findElementInParents(
  element: HTMLElement,
  targetSelector: string
) {
  let { parentElement } = element;

  while (parentElement) {
    if (parentElement.matches(targetSelector)) {
      return parentElement;
    }
    parentElement = parentElement.parentElement;
  }
  return null;
}

function AppSideBar({ children, openMenu, closeMenu }: Props) {
  const ref = useRef<HTMLElement>(null);

  useOnClickOutside(ref, (e) => {
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
        [styles.sideBarHide]: !openMenu,
      })}
    >
      {children}
    </aside>
  );
}

export default AppSideBar;
