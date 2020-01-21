import React from 'react';
import { Pane, Text, Avatar } from '@cybercongress/gravity';

import {
  formatNumber,
  formatValidatorAddress,
  formatCurrency,
} from '../../utils/utils';

import { Tooltip } from '../../components';

import { AUCTION } from '../../utils/config';

const TextHeader = ({ children }) => (
  <Text fontSize="18px" color="#fff" lineHeight="25px">
    {children}
  </Text>
);

const TextNumber = ({ children }) => (
  <Text fontSize="22px" color="#fff" lineHeight="30px">
    {children}
  </Text>
);

const BalancePane = ({ spendableBalance, balance, accounts, ...props }) => (
  <Pane
    display="flex"
    alignItems="center"
    justifyContent="space-around"
    width="100%"
    padding="20px"
    boxShadow="0 0 5px #3ab793"
    {...props}
  >
    <Pane display="flex" alignItems="center" flexDirection="column">
      <TextHeader>Total</TextHeader>
      <TextNumber>{formatCurrency(balance)}</TextNumber>
    </Pane>
    <Pane display="flex" alignItems="center" flexDirection="column">
      <TextHeader>Vested</TextHeader>
      <TextNumber>{formatCurrency(balance - spendableBalance)}</TextNumber>
    </Pane>
    <Pane display="flex" alignItems="center" flexDirection="column">
      <TextHeader>Available</TextHeader>
      <Tooltip
        placement="bottom"
        tooltip={`${formatNumber(Math.floor(spendableBalance))} ${
          AUCTION.TOKEN_NAME
        }`}
      >
        <TextNumber>{formatCurrency(spendableBalance)}</TextNumber>
      </Tooltip>
    </Pane>
    <Pane display="flex" alignItems="center" flexDirection="column">
      <Avatar
        style={{ width: 60, height: 60, marginBottom: 10 }}
        hash={accounts}
      />
      <Text color="#fff">{formatValidatorAddress(accounts, 6, 4)}</Text>
    </Pane>
  </Pane>
);

export default BalancePane;
