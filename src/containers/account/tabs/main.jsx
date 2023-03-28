import React, { useContext } from 'react';
import { Pane } from '@cybercongress/gravity';
import { formatNumber, getDisplayAmount } from '../../../utils/utils';
import Dinamics from '../component/dinamics';
import { CYBER } from '../../../utils/config';
import { DenomArr } from '../../../components';
import { AppContext } from '../../../context';

function Row({ text, number, procent, color }) {
  return (
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
      <Pane flex="1 1" textAlign="right">
        {number} {CYBER.DENOM_CYBER.toUpperCase()}
      </Pane>
    </Pane>
  );
}

function DetailsMainToken({ balance }) {
  const { available, delegation, unbonding, rewards, total } = balance;

  return (
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
    </Pane>
  );
}

function RowToken({ denom, amount }) {
  const { traseDenom } = useContext(AppContext);
  const { coinDecimals } = traseDenom(denom);
  return (
    <Pane
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      width="100%"
    >
      <DenomArr denomValue={denom} />
      <Pane whiteSpace="nowrap" textAlign="right">
        {formatNumber(getDisplayAmount(amount, coinDecimals))}
      </Pane>
    </Pane>
  );
}

function Tokens({ balanceToken, balance }) {
  return (
    <Pane
      display="flex"
      paddingX={20}
      paddingY={20}
      boxShadow="0 0 3px #3ab793"
      borderRadius={4}
      className="container-account-balance"
      flexDirection="column"
    >
      <Pane
        display="flex"
        fontSize="18px"
        marginBottom={10}
        justifyContent="space-between"
        width="100%"
        borderBottom="1px solid #ffffff80"
        paddingBottom="10px"
      >
        <Pane>Tokens</Pane>
        <Pane>Amount</Pane>
      </Pane>
      <Pane display="grid" gridGap="10px">
        <RowToken denom={CYBER.DENOM_CYBER} amount={balance.total} />
        {Object.keys(balanceToken).length &&
          Object.keys(balanceToken).map((key) => {
            if (Object.keys(balanceToken[key]).length > 0) {
              if (balanceToken[key].total > 0) {
                return (
                  <RowToken denom={key} amount={balanceToken[key].total} />
                );
              }
              return '';
            }
            return <RowToken denom={key} amount={balanceToken[key]} />;
          })}
      </Pane>
    </Pane>
  );
}

const Main = ({ balance, balanceToken, ...props }) => {
  try {
    return (
      <Pane {...props} display="grid" gridGap="20px">
        <DetailsMainToken balance={balance} />
        <Tokens balanceToken={balanceToken} balance={balance} />
      </Pane>
    );
  } catch (error) {
    console.log(`error Main`, error);
    return <div>oops...</div>;
  }
};

export default Main;
