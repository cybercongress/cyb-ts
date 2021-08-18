import React, { useEffect, useState } from 'react';
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
          <Pane
            display="flex"
            width="100%"
            height={20}
            paddingLeft={20}
            paddingRight={10}
            justifyContent="space-between"
            alignItems="center"
          >
            <Pane alignItems="center" flexGrow={1} display="flex">
              {item.name}
            </Pane>
          </Pane>
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
        <Pane alignItems="center" flexGrow={1} display="flex">
          {item.name}
        </Pane>
      </Pane>
    </Pane>
  );
};

export const Bookmarks = ({ items, ...props }) => {
  const location = useLocation();
  const { main } = useCheckPathname();

  return (
    <div className="bookmarks">
      {items.map((item, index) => {
        let itemsSub = [];
        const { subItems } = item;
        if (subItems.length > 0) {
          itemsSub = subItems.map((itemSub) => {
            return (
              <Items
                selected={itemSub.to === location.pathname}
                {...props}
                key={itemSub.name}
                item={itemSub}
              />
            );
          });
        }
        return (
          <>
            <Items
              selected={
                item.to === location.pathname && item.active === undefined
              }
              {...props}
              key={item.name}
              item={item}
            />
            {item.name === main && <Pane paddingLeft={20}>{itemsSub}</Pane>}
          </>
        );
      })}
    </div>
  );
};
