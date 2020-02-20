import React from 'react';
import { Pane, Text, Tooltip } from '@cybercongress/gravity';
// import { Tooltip } from '..';
import { Link } from 'react-router-dom';

const stausImgCyb = require('../../image/cyb.svg');
const bug = require('../../image/bug.svg');

export const MenuButton = ({ imgLogo, textTooltip, to, ...props }) => (
  <Tooltip
    content={textTooltip}
    position="bottom"
  >
    <Pane {...props} display="flex" alignItems="center" cursor="pointer">
      <Link to={to}>
        <Pane
          width={50}
          // height={50}
          position="relative"
          display="flex"
          align-items="flex-end"
        >
          <img
            style={{ width: 'inherit' }}
            alt="cyb"
            src={imgLogo || stausImgCyb}
          />
          <img
            src={bug}
            alt="bug"
            style={{
              // width: 15,
              height: 20,
              position: 'absolute',
              bottom: '-20%',
              left: '100%',
            }}
          />
        </Pane>
      </Link>
    </Pane>
  </Tooltip>
);
