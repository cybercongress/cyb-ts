import React from 'react';
import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';

const stausImgCyb = require('../../image/cyb.svg');
const bug = require('../../image/alert-circle-outline.svg');

export function MenuButton({
  imgLogo,
  positionBugLeft,
  textTooltip,
  to,
  size = 50,
  bottomBug = '-20%',
  ...props
}) {
  return (
    <Pane
      {...props}
      display="flex"
      alignItems="center"
      cursor="pointer"
      width={size}
    >
      <Pane
        width="inherit"
        height="auto"
        maxHeight={`${size}px`}
        position="relative"
        display="flex"
        align-items="flex-end"
      >
        {to ? (
          <Link style={{ width: 'inherit' }} to={to}>
            <img
              style={{ width: '50px', height: '50px' }}
              alt="cyb"
              src={imgLogo || stausImgCyb}
            />
          </Link>
        ) : (
          <img
            style={{ width: '50px', height: '50px' }}
            alt="cyb"
            src={imgLogo || stausImgCyb}
          />
        )}
      </Pane>
    </Pane>
  );
}
