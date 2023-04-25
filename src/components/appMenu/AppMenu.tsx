import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, Link } from 'react-router-dom';
import styles from './AppMenu.module.scss';
import { Pane } from '@cybercongress/gravity';
import cx from 'classnames';


// recheck types
interface SubItem {
  name: string;
  to: string;
}

interface Item {
  name: string;
  to: string;
  icon?: string;
  active?: boolean;
  subItems: SubItem[];
}

interface Props {
  item: Item;
  selected: boolean;
  onClick: () => void;
}

function Items({ item, selected }: Props) {
  return (
    <Link
      to={item.to}
      className={cx(styles.bookmarks__item, { [styles.active]: selected })}
    >
      <Pane
        display="flex"
        paddingY={5}
        alignItems="center"
        key={item.name}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '30px 1fr',
            gap: 10,
            alignItems: 'center',
            paddingLeft: 15,
          }}
        >
          {item.icon && (
            <img
              src={item.icon}
              style={{ width: 30, height: 30, objectFit: 'contain' }}
              alt="img"
            />
          )}
          <Pane
            alignItems="center"
            whiteSpace="nowrap"
            flexGrow={1}
            fontSize={18}
            display="flex"
          >
            {item.name}
          </Pane>
        </div>
      </Pane>
    </Link>
  );
}

const renderSubItems = (subItems, location, onClickSubItem) => {
  let itemsSub = [];
  if (subItems.length > 0) {
    itemsSub = subItems.map((itemSub) => {
      return (
        <Items
          selected={itemSub.to === location.pathname}
          key={itemSub.name}
          item={itemSub}
          onClick={() => onClickSubItem(itemSub.name)}
        />
      );
    });
  }

  return itemsSub;
};

// eslint-disable-next-line import/prefer-default-export
export function Bookmarks({ items }) {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedItemSub, setSelectedItemSub] = useState('');
  const location = useLocation();

  const onClickItem = (itemKey) => {
    setSelectedItem(itemKey);
    setSelectedItemSub('');
  };

  const onClickSubItem = (itemKey) => {
    setSelectedItemSub(itemKey);
  };

  useEffect(() => {
    setSelectedItemSub('');
  }, [selectedItem]);

  return (
    <div className={styles.bookmarks}>
      {items.map((item) => {
        const key = uuidv4();
        return (
          <div key={key}>
            <Items
              selected={
                item.to === location.pathname &&
                selectedItemSub === '' &&
                item.active === undefined
              }
              item={item}
              onClick={() => onClickItem(item.name)}
            />
            {item.name === selectedItem && (
              <Pane paddingLeft={50}>
                {renderSubItems(item.subItems, location, onClickSubItem)}
              </Pane>
            )}
          </div>
        );
      })}
    </div>
  );
}
