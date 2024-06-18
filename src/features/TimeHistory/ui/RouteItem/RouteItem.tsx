import { MenuItem, MenuItems } from 'src/types/menu';
import itemsMenu from 'src/utils/appsMenu';
import DEFAULT_IMG from 'images/large-orange-circle.png';
import { Link } from 'react-router-dom';
import { RouteItemT } from '../type';
import styles from './RouteItem.module.scss';

const findSubItemFc = (subItems: MenuItem['subItems'], url: string) =>
  subItems.filter((item) => url.includes(item.to));

const findIconApp = (url: string) => {
  // const isRobot = url.includes('@') || url.includes('neuron/');

  const findApp = itemsMenu().reduce((acc: MenuItems, item: MenuItem) => {
    if (item.to === url) {
      acc.push(item);
    } else if (findSubItemFc(item.subItems, url).length !== 0) {
      const findSubItem = findSubItemFc(item.subItems, url);
      acc.push({ ...item, name: findSubItem[0].name });
    }
    return acc;
  }, []);

  return findApp;
};

function RouteItem({ value }: { value: RouteItemT }) {
  const { url } = value;
  const app = findIconApp(url);

  return (
    <Link to={url} className={styles.wrapper}>
      <span>{app[0]?.name || url}</span>
      <img src={app[0]?.icon || DEFAULT_IMG} alt={url} />
    </Link>
  );
}

export default RouteItem;
