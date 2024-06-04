import { Nullable, Option } from 'src/types';
import { Citizenship } from 'src/types/citizenship';
import { routes } from 'src/routes';
import { MenuItem, MenuItems } from 'src/types/menu';
import reduceRobotSubItems from './reduceRobotSubItems';

const findSelectAppByUrl = (
  url: string,
  passport: Nullable<Citizenship>,
  address: Option<string>
) => {
  let pathname = url;
  const isRobot = url.includes('@') || url.includes('neuron/');

  const itemsMenuObj = reduceRobotSubItems(passport, address);

  if (isRobot) {
    pathname = routes.robot.path;
  }

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
};

export default findSelectAppByUrl;
