import React from 'react';
import { ActionBar, Button, Input, Pane, Text } from '@cybercongress/gravity';
import { ContainetLedger, Loading } from '../../components/index';
import { formatNumber } from '../../utils/search/utils';

export const StartState = ({ targetColor, valueSearchInput, onClickBtn }) => (
  <ActionBar>
    <Pane
      position="absolute"
      bottom={0}
      left="50%"
      marginRight="-50%"
      transform="translate(-50%, -50%)"
    >
      <button
        className="btn-home"
        type="button"
        onClick={onClickBtn}
        style={{
          backgroundColor: `${targetColor ? '#3ab793' : '#000'}`,
          color: `${targetColor ? '#fff' : '#3ab793'}`,
          opacity: `${valueSearchInput.length !== 0 ? 1 : 0}`,
        }}
      >
        cyber
      </button>

      <a
        style={{
          fontSize: '60px',
          transition: '0.4s',
          display: `${valueSearchInput.length === 0 ? 'block' : 'none'}`,
          opacity: `${valueSearchInput.length === 0 ? 1 : 0}`,
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
