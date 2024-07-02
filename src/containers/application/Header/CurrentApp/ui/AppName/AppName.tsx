import { useLocation } from 'react-router-dom';
import { CHAIN_ID } from 'src/constants/config';
import { PATTERN_CYBER } from 'src/constants/patterns';
import { routes } from 'src/routes';
import itemsMenu from 'src/utils/appsMenu';
import findApp from 'src/utils/findApp';
import { Helmet } from 'react-helmet';
import styles from './AppName.module.scss';

function AppName() {
  let { pathname } = useLocation();
  const isRobot = pathname.includes('@') || pathname.includes('neuron/');

  if (isRobot) {
    const pathnameArr = pathname.replace(/^\/|\/$/g, '').split('/');
    const findItem = pathnameArr[pathnameArr.length - 1];
    pathname =
      findItem.includes('@') || findItem.match(PATTERN_CYBER)
        ? routes.robot.path
        : findItem;
  }

  const value = findApp(itemsMenu(), pathname);

  const content = value[0]?.name || CHAIN_ID;

  return (
    <>
      <Helmet>
        <title>{content ? `${content.toLowerCase()} | cyb` : ''}</title>
      </Helmet>
      <span className={styles.wrapper}>{content}</span>
    </>
  );
}

export default AppName;
