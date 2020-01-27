import React from 'react';
import { Text, Pane } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/search/utils';
import MsgType from './msgType';
import Account from './Account';
import { CYBER } from '../../utils/config';

const Link = ({ to, children }) => <a href={to}>{children}</a>;

export const ContainerMsgsType = ({ type, children }) => (
  <Pane
    paddingY={20}
    paddingX={20}
    borderRadius={5}
    display="flex"
    flexDirection="column"
    boxShadow="0 0 5px #3ab793"
    marginBottom={20}
  >
    <Pane paddingLeft={5} paddingBottom={8} borderBottom="1px solid #3ab7938f">
      <MsgType type={type} />
    </Pane>
    <Pane width="100%" paddingTop={15}>
      {children}
    </Pane>
  </Pane>
);

export const Row = ({ value, title }) => (
  <Pane key={`${value}-container`} className="txs-contaiter-row" display="flex">
    <Text
      key={`${title}-title`}
      display="flex"
      fontSize="16px"
      textTransform="capitalize"
      color="#fff"
      whiteSpace="nowrap"
      width="240px"
      marginBottom="5px"
      lineHeight="20px"
    >
      {title} :
    </Text>
    <Text
      key={`${value}-value`}
      display="flex"
      color="#fff"
      fontSize="16px"
      alignItems="center"
      wordBreak="break-all"
      lineHeight="20px"
      marginBottom="5px"
    >
      {value}
    </Text>
  </Pane>
);

const MultiSend = ({ msg }) => {
  return (
    <ContainerMsgsType type={msg.type}>
      <Row
        title="Inputs"
        value={msg.value.inputs.map((data, i) => {
          return (
            <div key={i}>
              <Account address={data.address}>
                {data.coins.map((coin, j) => {
                  return (
                    <span key={j}>
                      {' '}
                      {formatNumber(coin.amount)} {coin.denom.toUpperCase()}
                    </span>
                  );
                })}
              </Account>
            </div>
          );
        })}
      />
      <Row
        title="Outputs"
        value={msg.value.outputs.map((data, i) => {
          return (
            <div key={i}>
              <Account address={data.address} />
              {data.coins.map((coin, j) => {
                return (
                  <span key={j}>
                    {' '}
                    {formatNumber(coin.amount)} {coin.denom.toUpperCase()}
                  </span>
                );
              })}
            </div>
          );
        })}
      />
    </ContainerMsgsType>
  );
};

const Activites = ({ msg }) => {
  switch (msg.type) {
    // bank
    case 'cosmos-sdk/MsgSend':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="From"
            value={<Account address={msg.value.from_address} />}
          />
          <Row title="To" value={<Account address={msg.value.to_address} />} />
          <Row
            title="amount"
            value={
              msg.value.amount.length > 0
                ? msg.value.amount.map((amount, i) => {
                    if (i > 0) {
                      return ` ,${amount.amount} ${amount.denom}`;
                    }
                    return `${formatNumber(
                      amount.amount
                    )} ${amount.denom.toUpperCase()}`;
                  })
                : `0 ${CYBER.DENOM_CYBER.toUpperCase()}`
            }
          />
        </ContainerMsgsType>
      );

    case 'cosmos-sdk/MsgMultiSend':
      return <MultiSend msg={msg} />;

    // staking
    case 'cosmos-sdk/MsgCreateValidator':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="Delegator"
            value={<Account address={msg.value.delegator_address} />}
          />
          <Row
            title="Validator"
            value={<Account address={msg.value.validator_address} />}
          />
          <Row
            title="Mininum Self Delegation"
            value={`${formatNumber(msg.value.min_self_delegation)} 
             ${CYBER.DENOM_CYBER.toUpperCase()}`}
          />
          <Row title="Commission Rate" value={msg.value.commission.rate} />
          <Row title="Description" value={msg.value.description.moniker} />
        </ContainerMsgsType>
      );
    case 'cosmos-sdk/MsgEditValidator':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="Address"
            value={<Account address={msg.value.address} />}
          />
        </ContainerMsgsType>
      );
    case 'cosmos-sdk/MsgDelegate':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="Delegator"
            value={<Account address={msg.value.delegator_address} />}
          />
          <Row
            title="Validator"
            value={<Account address={msg.value.validator_address} />}
          />
          <Row
            title="Delegation Amount"
            value={`${formatNumber(
              msg.value.amount.amount
            )} ${msg.value.amount.denom.toUpperCase()}`}
          />
        </ContainerMsgsType>
      );
    case 'cosmos-sdk/MsgUndelegate':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="Delegator"
            value={<Account address={msg.value.delegator_address} />}
          />
          <Row
            title="Validator"
            value={<Account address={msg.value.validator_address} />}
          />
          <Row
            title="Undelegation Amount"
            value={`${formatNumber(
              msg.value.amount.amount
            )} ${msg.value.amount.denom.toUpperCase()}`}
          />
        </ContainerMsgsType>
      );
    case 'cosmos-sdk/MsgBeginRedelegate':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="Delegator"
            value={<Account address={msg.value.delegator_address} />}
          />
          <Row
            title="Redelegated from"
            value={<Account address={msg.value.validator_src_address} />}
          />
          <Row
            title="Redelegated to"
            value={<Account address={msg.value.validator_dst_address} />}
          />
          <Row
            title="Redelegation Amount"
            value={`${formatNumber(
              msg.value.amount.amount
            )} ${msg.value.amount.denom.toUpperCase()}`}
          />
        </ContainerMsgsType>
      );

    // gov
    case 'cosmos-sdk/MsgSubmitProposal':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="Proposer"
            value={<Account address={msg.value.proposer} />}
          />
          <Row
            title="Initail Deposit"
            value={
              msg.value.initial_deposit.length > 0
                ? msg.value.initial_deposit.map((amount, i) => {
                    if (i > 0) {
                      return ` ,${amount.amount} ${amount.denom}`;
                    }
                    return `${formatNumber(
                      amount.amount
                    )} ${amount.denom.toUpperCase()}`;
                  })
                : `0 ${CYBER.DENOM_CYBER.toUpperCase()}`
            }
          />
        </ContainerMsgsType>
      );
    case 'cosmos-sdk/MsgDeposit':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="Proposal Id"
            value={
              <Link to={`#/governance/${msg.value.proposal_id}`}>
                {msg.value.proposal_id}
              </Link>
            }
          />
          <Row
            title="Depositor"
            value={<Account address={msg.value.depositor} />}
          />
          <Row
            title="Amount"
            value={msg.value.amount.map((amount, i) => {
              if (i > 0) {
                return ` ,${amount.amount} ${amount.denom}`;
              }
              return `${formatNumber(
                amount.amount
              )} ${amount.denom.toUpperCase()}`;
            })}
          />
        </ContainerMsgsType>
      );
    case 'cosmos-sdk/MsgVote':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="Proposal Id"
            value={
              <Link to={`#/governance/${msg.value.proposal_id}`}>
                {msg.value.proposal_id}
              </Link>
            }
          />
          <Row title="Voter" value={<Account address={msg.value.voter} />} />
          <Row title="Vote Option" value={msg.value.option} />
        </ContainerMsgsType>
      );

    // distribution
    case 'cosmos-sdk/MsgWithdrawValidatorCommission':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="address"
            value={<Account address={msg.value.validator_address} />}
          />
        </ContainerMsgsType>
      );
    case 'cosmos-sdk/MsgWithdrawDelegationReward':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="delegator"
            value={<Account address={msg.value.delegator_address} />}
          />
          <Row
            title="validator"
            value={<Account address={msg.value.validator_address} />}
          />
        </ContainerMsgsType>
      );
    case 'cosmos-sdk/MsgModifyWithdrawAddress':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="delegator"
            value={<Account address={msg.value.delegator_address} />}
          />
        </ContainerMsgsType>
      );

    // slashing
    case 'cosmos-sdk/MsgUnjail':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row
            title="address"
            value={<Account address={msg.value.address} />}
          />
        </ContainerMsgsType>
      );

    default:
      return <div>{JSON.stringify(msg.value)}</div>;
  }
};

export default Activites;
