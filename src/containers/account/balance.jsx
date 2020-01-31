import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/utils';
import Dinamics from './dinamics';
import { CYBER } from '../../utils/config';

const Row = ({ text, number, procent, color }) => (
  <Pane display="flex" alignItems="center" paddingY={7}>
    <Pane display="flex" alignItems="center">
      <Pane
        width="30px"
        height="4px"
        backgroundColor={color}
        marginRight="10px"
      />
      <Pane width={100}>{text}</Pane>
    </Pane>
    <Pane>{procent}%</Pane>
    <Pane flex="1 1" textAlign="right">
      {number}
    </Pane>
  </Pane>
);

const Balance = ({ account, balance, ...props }) => {
  const { available, delegation, unbonding, rewards, total } = balance;
  return (
    <Pane {...props}>
      <Pane display="flex" marginBottom={15} flexDirection="column">
        <Text fontSize="18px" color="#fff">
          Address:
        </Text>
        <Text color="#fff" fontSize="18px">
          {account}
        </Text>
      </Pane>
      <Pane
        className="contaiter-address-total"
        marginBottom={20}
        flexDirection="column"
      >
        <Text fontSize="16px" color="#fff">
          Total:
        </Text>
        <Text color="#fff" fontSize="18px">
          {formatNumber(total)}
          <Text color="#fff" marginLeft={5} fontSize="18px">
            {CYBER.DENOM_CYBER.toUpperCase()}
          </Text>
        </Text>
      </Pane>
      <Pane
        display="flex"
        paddingX={20}
        paddingY={20}
        boxShadow="0 0 3px #3ab793"
        borderRadius={4}
        className="container-account-balance"
      >
        {total > 0 && <Dinamics data={balance} />}
        <Pane className="account-balance">
          <Row
            text="Available"
            number={formatNumber(available)}
            procent={formatNumber((available / total) * 100, 3)}
            color="#00e676"
          />
          <Row
            text="Delegated"
            number={formatNumber(delegation)}
            procent={formatNumber((delegation / total) * 100, 3)}
            color="#d500f9"
          />
          <Row
            text="Unbonding"
            number={formatNumber(unbonding)}
            procent={formatNumber((unbonding / total) * 100, 3)}
            color="#00e5ff"
          />
          <Row
            text="Reward"
            number={formatNumber(rewards)}
            procent={formatNumber((rewards / total) * 100, 3)}
            color="#651fff"
          />
          {balance.commission && (
            <Row
              text="Commission"
              number={formatNumber(balance.commission)}
              procent={formatNumber((balance.commission / total) * 100, 3)}
              color="#1de9b6"
            />
          )}
        </Pane>
        <Pane
          className="account-total"
          justifyContent="center"
          flexDirection="column"
          alignItems="flex-end"
        >
          <Text fontSize="16px" marginBottom={10} color="#fff">
            Total
            <Text color="#fff" marginLeft={5} fontSize="20px">
              {CYBER.DENOM_CYBER.toUpperCase()}
            </Text>
          </Text>

          <Text color="#fff" fontSize="18px">
            {formatNumber(total)}
          </Text>
        </Pane>
      </Pane>
    </Pane>
  );
};

export default Balance;
