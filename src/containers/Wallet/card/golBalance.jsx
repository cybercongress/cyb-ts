import React, { useEffect, useState } from 'react';
import { Pane } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { PocketCard } from '../components';
import { Copy, Dots, LinkWindow } from '../../../components';
import {
  trimString,
  formatCurrency,
  getDelegator,
  exponentialToDecimal,
  formatNumber,
} from '../../../utils/utils';
import { getDrop } from '../../../utils/search/utils';

const imgLedger = require('../../../image/ledger.svg');

const Row = ({ title, value, marginBottomValue, fontSizeValue, ...props }) => (
  <Pane width="100%" display="flex" alignItems="center" {...props}>
    <Pane fontSize={fontSizeValue} marginBottom={marginBottomValue}>
      {value}
    </Pane>
    <Pane>{title}</Pane>
  </Pane>
);

function GolBalance({ balance, accounts, ...props }) {
  const { eth, gol } = balance;

  return (
    <PocketCard
      display="flex"
      flexDirection="column"
      {...props}
    >
      <Row
        marginBottomValue={5}
        justifyContent="space-between"
        alignItems="baseline"
        value={
          <Pane display="flex" alignItems="center">
            <LinkWindow to={`http://etherscan.io/address/${accounts}`}>
              <div>{trimString(accounts, 6, 6)}</div>
            </LinkWindow>
            <Copy text={accounts} />
          </Pane>
        }
        title={
          <Pane flexDirection="column" display="flex" alignItems="flex-end">
            <Pane marginBottom={10}>
              {exponentialToDecimal(parseFloat(eth).toPrecision(6))} ETH
            </Pane>
            <Pane>{formatNumber(parseFloat(gol))} GoL</Pane>
          </Pane>
        }
      />
    </PocketCard>
  );
}

export default GolBalance;
