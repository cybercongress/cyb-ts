import React, { Children } from 'react';
import stylesBtn from './stylesBtn.scss';

const classNames = require('classnames');

function ButtonTeleport({ status, children, ...props }) {
  return (
    <button
      {...props}
      type="button"
      className={classNames(stylesBtn.teleportBtn, {
        [stylesBtn.teleportBtnActive]: status === 'center',
        [stylesBtn.teleportBtnRight]: status === 'right',
        [stylesBtn.teleportBtnLeft]: status === 'left',
      })}
    >
      <div
        className={classNames(stylesBtn.lampMenu, {
          [stylesBtn.lampMenuActive]: status === 'center',
          [stylesBtn.lampMenuActiveLeft]: status === 'center',
          // state for RIGHT menu button
          [stylesBtn.lampMenuRight]: status === 'right',
          // state for LEFT Lamp when menu button -> RIGHT
          [stylesBtn.lampMenuRightLeft]: status === 'right',
          // state for LEFT menu button
          [stylesBtn.lampMenuLeft]: status === 'left',
          // state for LEFT Lamp when menu button -> LEFT
          [stylesBtn.lampMenuLeftLeft]: status === 'left',
        })}
      />
      <div
        className={classNames(stylesBtn.lampMenu, {
          [stylesBtn.lampMenuActive]: status === 'center',
          [stylesBtn.lampMenuActiveRight]: status === 'center',
          // state for RIGHT menu button
          [stylesBtn.lampMenuRight]: status === 'right',
          // state for RIGHT Lamp when menu button -> RIGHT
          [stylesBtn.lampMenuRightRight]: status === 'right',
          // state for LEFT menu button
          [stylesBtn.lampMenuLeft]: status === 'left',
          // state for RIGHT Lamp when menu button -> LEFT
          [stylesBtn.lampMenuLeftRight]: status === 'left',
        })}
      />
      {children}
    </button>
  );
}

export default ButtonTeleport;
