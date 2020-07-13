import React from 'react';
import { Pane, Text, Tooltip } from '@cybercongress/gravity';
// import { Tooltip } from '..';
import { Link } from 'react-router-dom';

const stausImgCyb = require('../../image/cyb.svg');
const bug = require('../../image/alert-circle-outline.svg');

export const MenuButton = ({
  imgLogo,
  positionBugLeft,
  textTooltip,
  to,
  size = 50,
  bottomBug = '-20%',
  ...props
}) => (
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
        <Link style={{ width: 'inherit' }} to={to}>
          <img
            style={{ width: 'inherit' }}
            alt="cyb"
            src={imgLogo || stausImgCyb}
          />
        </Link>
      </Pane>
    </Pane>
);
