import React from 'react';
import { ActionBar, Button, Input, Pane, Text } from '@cybercongress/gravity';
import { LinkWindow } from '../../components';
import { formatNumber } from '../../utils/search/utils';

const StartState = ({ targetColor, valueSearchInput, onClickBtn }) => (
  <ActionBar>
    <Pane
      position="absolute"
      bottom={0}
      left="50%"
      marginRight="-50%"
      transform="translate(-50%, -50%)"
    >
      <a
        style={{
          fontSize: '60px',
          transition: '0.4s',
          position: 'absolute',
          transform: 'translate(-50%, -50%)',
          marginRight: '-50%',
          left: '50%',
          bottom: '0px',
          height: '42px',
        }}
        href="https://cybercongress.ai"
        target="_blank"
      >
        ~
      </a>
    </Pane>
  </ActionBar>
);

export default StartState;
