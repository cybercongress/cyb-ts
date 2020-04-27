import React from 'react';
import { Text, Pane, Button, ActionBar } from '@cybercongress/gravity';
import LocalizedStrings from 'react-localization';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { CosmosDelegateTool } from '../../utils/ledger';

import { i18n } from '../../i18n/en';
import { Link } from 'react-router-dom';

import { CYBER, LEDGER, AUCTION, COSMOS, TAKEOFF } from '../../utils/config';

import { ConnectLadger, ActionBarContentText } from '../../components';

const T = new LocalizedStrings(i18n);

const ActionBarContainer = ({ addAddress }) => {
  return (
    <ActionBar>
      <Pane>
        {addAddress && (
          <ActionBarContentText>
            Play Game of Links. Get EUL with
            <Link
              style={{
                paddingTop: 10,
                margin: '0 15px',
                paddingBottom: 10,
                display: 'block',
              }}
              className="btn"
              to="/gol/faucet"
            >
              ETH
            </Link>{' '}
            or
            <Link
              style={{
                paddingTop: 10,
                margin: '0 15px',
                paddingBottom: 10,
                display: 'block',
              }}
              className="btn"
              to="/gol/takeoff"
            >
              ATOM
            </Link>
          </ActionBarContentText>
        )}
        {!addAddress && (
          <Link
            style={{ paddingTop: 10, paddingBottom: 10, display: 'block' }}
            className="btn"
            to="/gol"
          >
            Play Game of Links
          </Link>
        )}
      </Pane>
    </ActionBar>
  );
};

export default ActionBarContainer;
