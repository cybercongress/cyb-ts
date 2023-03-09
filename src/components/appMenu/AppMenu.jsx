import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation, Link } from 'react-router-dom';
// import CybLink from '../CybLink';
import './AppMenu.css';
import { Pane } from '@cybercongress/gravity';
import useCheckPathname from './useCheckPathname';

const Logo = (props) => (
  <a {...props} className="logo">
    logo
  </a>
);

export const LogoLink = ({ onClick }) => (
  <div className="menu-logo">
    <Logo dura="" onClick={onClick} />
  </div>
);

const Items = ({ item, deleteAppFromMenu, selected, height, ...props }) => {
  if (item.to !== '#') {
    return (
      <Link style={{ color: '#fff' }} to={item.to}>
        <Pane
          display="flex"
          paddingY={5}
          alignItems="center"
          className={` bookmarks__item ${selected ? 'active' : ''}`}
          key={item.name}
          {...props}
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
  return (
    <Pane
      display="flex"
      paddingY={5}
      alignItems="center"
      className={` bookmarks__item ${selected ? 'active' : ''}`}
      key={item.name}
    >
      <Pane
        display="flex"
        width="100%"
        height={20}
        paddingLeft={20}
        paddingRight={10}
        justifyContent="space-between"
        alignItems="center"
      >
        <Pane alignItems="center" fontSize={18} flexGrow={1} display="flex">
          {item.name}
        </Pane>
      </Pane>
    </Pane>
  );
};

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

export const Bookmarks = ({ items, ...props }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [selectedItemSub, setSelectedItemSub] = useState('');
  const location = useLocation();
  // const { main } = useCheckPathname();

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
    <div className="bookmarks">
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
              // {...props}

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
};
