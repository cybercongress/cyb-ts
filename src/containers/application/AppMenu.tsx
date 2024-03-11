import itemsMenu from 'src/utils/appsMenu';
import { Bookmarks } from '../../components/appMenu/AppMenu';

export type MenuItems = ReturnType<typeof itemsMenu>;
export type MenuItem = MenuItems[0];

function AppMenu({ addressActive, closeMenu }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        height: '100%',
      }}
    >
      <Bookmarks items={itemsMenu()} closeMenu={closeMenu} />
    </div>
  );
}

export default AppMenu;
