import getMenuItems from 'src/utils/appsMenu';

export type MenuItems = ReturnType<typeof getMenuItems>;
export type MenuItem = MenuItems[0];
