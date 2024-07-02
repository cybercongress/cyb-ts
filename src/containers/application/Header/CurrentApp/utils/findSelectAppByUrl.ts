import { Nullable, Option } from 'src/types';
import { Citizenship } from 'src/types/citizenship';
import { routes } from 'src/routes';
import findApp from 'src/utils/findApp';
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

  const value = findApp(itemsMenuObj, pathname);

  return value;
};

export default findSelectAppByUrl;
