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
  const isOracle = url.includes('oracle');
  const isCyberver = url.includes('cyberver');

  const itemsMenuObj = reduceRobotSubItems(passport, address);

  if (isRobot) {
    pathname = routes.robot.path;
  }

  if (isOracle) {
    pathname = routes.oracle.path;
  }

  if (isCyberver) {
    pathname = '/cyberver';
  }

  const value = findApp(itemsMenuObj, pathname);

  return value;
};

export default findSelectAppByUrl;
