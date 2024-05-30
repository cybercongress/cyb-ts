import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, NavLink, matchPath } from 'react-router-dom';
import styles from './AppMenu.module.scss';
import { Pane } from '@cybercongress/gravity';
import cx from 'classnames';
import { MenuItem, MenuItems } from 'src/containers/application/AppMenu';

interface Props {
  item: MenuItem | MenuItem['subItems'][0];
  selected: boolean;
  onClick: () => void;
}

function Items({ item, selected, onClick }: Props) {
  return (
    <NavLink
      to={item.to}
      className={() => {
        return cx(styles.bookmarks__item, { [styles.active]: selected });
      }}
      onClick={onClick}
    >
      <Pane display="flex" paddingY={5} alignItems="center" key={item.name}>
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
    </NavLink>
  );
}

const renderSubItems = (
  subItems: MenuItem['subItems'],
  location,
  onClickSubItem
) => {
  return subItems.map((itemSub) => {
    const { matchPathname } = itemSub;
    return (
      <Items
        selected={
          itemSub.to === location.pathname ||
          (matchPathname && !!matchPath(matchPathname, location.pathname))
        }
        key={itemSub.name}
        item={itemSub}
        onClick={() => onClickSubItem(itemSub.name)}
      />
    );
  });
};

// eslint-disable-next-line import/prefer-default-export
export function Bookmarks({
  items,
  closeMenu,
}: {
  items: MenuItems;
  closeMenu: () => void;
}) {
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [selectedItemSub, setSelectedItemSub] = useState<string>('');
  const location = useLocation();

  function onClickItem(itemKey: MenuItem['name']) {
    setSelectedItem(itemKey);
    setSelectedItemSub('');

    const item = items.find((item) => item.name === itemKey);

    if (item && item.subItems.length === 0) {
      closeMenu();
    }
  }

  function onClickSubItem(itemKey: string) {
    setSelectedItemSub(itemKey);
    closeMenu();
  }

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
                (item.to === location.pathname && selectedItemSub === '') ||
                // maybe refactor robot url check
                (item.to === '/robot' &&
                  (location.pathname.includes('@') ||
                    location.pathname.includes('neuron/')))
                // item.active === undefined
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
