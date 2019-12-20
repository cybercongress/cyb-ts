import React from 'react';
import { Pane, Text, Tooltip } from '@cybercongress/gravity';
// import { Tooltip } from '..';

const stausImgCyb = require('../../image/cyb.svg');
const bug = require('../../image/bug.svg');

export const MenuButton = ({ imgLogo, ...props }) => (
  <Tooltip
    content={
      <span>
        You are on the euler-5 network. Euler-5 is incentivized test network. Be
        careful. Details in{' '}
        <a
          target="_blank"
          href="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ"
        >
          whitepaper
        </a>{' '}
        and{' '}
        <a target="_blank" href="https://cybercongress.ai/game-of-links/">
          Game of links
        </a>{' '}
        rules.
      </span>
    }
    position="bottom"
  >
    <Pane {...props} display="flex" alignItems="center" cursor="pointer">
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
    </Pane>
  </Tooltip>
);
