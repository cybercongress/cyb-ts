import { MenuItem, MenuItems } from 'src/types/menu';
import itemsMenu from 'src/utils/appsMenu';
import DEFAULT_IMG from 'images/large-orange-circle.png';
import { RouteItemT } from '../type';
import styles from './RouteItem.module.scss';

const findIconApp = (url: string) => {
  const findApp = itemsMenu().reduce((acc: MenuItems, item: MenuItem) => {
    if (item.to === url) {
      acc.push(item);
    } else if (item.subItems.filter((item) => item.to === url).length !== 0) {
      console.log(
        'item.subItems.filter((item) => item.to === url)',
        item.subItems.filter((item) => item.to === url)
      );
      acc.push(item);
    }
    return acc;
  }, []);

  return findApp;
};

function RouteItem({ value }: { value: RouteItemT }) {
  const { url } = value;
  const app = findIconApp(url);

  return (
    <div className={styles.wrapper}>
      <span>{app[0]?.name || url}</span>
      <img src={app[0]?.icon || DEFAULT_IMG} alt={url} />
    </div>
  );
}

export default RouteItem;
