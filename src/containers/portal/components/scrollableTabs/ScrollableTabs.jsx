import React, { useEffect, useState } from 'react';
import { CSSTransitionGroup as ReactCSSTransitionGroup } from 'react-transition-group';
import styles from './ScrollableTabs.scss';

const cx = require('classnames');

function ScrollableTabs({ items, active }) {
  const [direction, setDirection] = useState('');
  const [activeItem, setActiveItem] = useState(active);

  const generateItems = () => {
    const itemsTabs = [];
    let level;
    console.log(activeItem);
    for (let i = activeItem - 1; i < activeItem + 2; i++) {
      let index = i;
      let funcOnClick;
      if (i < 0) {
        index = items.length + i;
      } else if (i >= items.length) {
        index = i % items.length;
      }
      level = activeItem - i;
      if (level < 0) {
        funcOnClick = moveRight;
      }
      if (level > 0) {
        funcOnClick = moveLeft;
      }
      itemsTabs.push(
        <Item
          key={index}
          id={items[index]}
          level={level}
          onClick={funcOnClick}
        />
      );
    }
    return itemsTabs;
  };

  const moveLeft = () => {
    let newActive = activeItem;
    newActive -= 1;
    setActiveItem(newActive < 0 ? items.length - 1 : newActive);
    setDirection('left');
  };

  const moveRight = () => {
    const newActive = activeItem;
    setActiveItem((newActive + 1) % items.length);
    setDirection('right');
  };

  return (
    <div className={cx(styles.noselect, styles.carousel)}>
      <ReactCSSTransitionGroup
        // transitionName={direction}
        transitionName={{
          enter: styles[`${direction}-enter`],
          enterActive: styles[`${direction}-enter-active`],
          leave: styles[`${direction}-leave`],
          leaveActive: styles[`${direction}-leave-active`],
          appear: styles[`${direction}-appear`],
          appearActive: styles[`${direction}-appear-active`],
        }}
      >
        {generateItems()}
      </ReactCSSTransitionGroup>
    </div>
  );
}

function Item({ level, id, ...props }) {
  const className = `level${level}`;
  return (
    <div {...props} className={cx(styles.item, styles[className])}>
      <div className={cx(styles.itemLamp, styles[`itemLamp${className}`])} />
      {id}
    </div>
  );
}

export default ScrollableTabs;
