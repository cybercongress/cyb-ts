import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Text, Pane } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/search/utils';
import { Account, MsgType, LinkWindow, ValueImg } from '../../components';
import { CYBER } from '../../utils/config';
import { timeSince } from '../../utils/utils';
import { fromBase64, fromUtf8 } from '@cosmjs/encoding';

const imgDropdown = require('../../image/arrow-dropdown.svg');
const imgDropup = require('../../image/arrow-dropup.svg');

const S_TO_MS = 1 * 10 ** 3;

const Cid = ({ cid }) => <Link to={`/ipfs/${cid}`}>{cid}</Link>;

export const ContainerMsgsType = ({ type, children }) => (
  <Pane
    borderRadius={5}
    display="flex"
    flexDirection="column"
    boxShadow="0 0 5px #3ab793"
    marginBottom={20}
  >
    <Pane
      paddingLeft={16}
      paddingTop={10}
      paddingBottom={5}
      paddingRight={10}
      borderBottom="1px solid #3ab7938f"
    >
      <MsgType type={type} />
    </Pane>
    <Pane width="100%" paddingY={10} paddingLeft={20} paddingRight={10}>
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
      wordBreak="break-all"
      lineHeight="20px"
      marginBottom="5px"
      flexDirection="column"
      alignItems="flex-start"
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
            <div
              key={i}
              style={{
                marginBottom: '5px',
              }}
            >
              <Account address={data.address}>
                {data.coins.map((coin, j) => {
                  return (
                    <span key={j}>
                      {' '}
                      ({formatNumber(coin.amount)} {coin.denom.toUpperCase()})
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
            <div
              key={i}
              style={{
                marginBottom: '5px',
              }}
            >
              <Account address={data.address} />
              {data.coins.map((coin, j) => {
                return (
                  <span key={j}>
                    {' '}
                    ({formatNumber(coin.amount)} {coin.denom.toUpperCase()})
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

const MsgLink = ({ msg, seeAll, onClickBtnSeeAll }) => (
  <ContainerMsgsType type={msg.type}>
    <Row title="Neuron" value={<Account address={msg.value.neuron} />} />
    {msg.value.links
      .slice(0, seeAll ? msg.value.length : 1)
      .map((item, index) => (
        <div
          key={`${item.from}-${index}`}
          style={{
            padding: '10px',
            paddingBottom: 0,
            marginBottom: '10px',
            borderTop: '1px solid #3ab79366',
          }}
        >
          <Row title="from" value={<Cid cid={item.from} />} />
          <Row title="to" value={<Cid cid={item.to} />} />
        </div>
      ))}
    {msg.value.links.length > 1 && (
      <button
        style={{
          width: '25px',
          height: '25px',
          margin: 0,
          padding: 0,
          border: 'none',
          backgroundColor: 'transparent',
        }}
        type="button"
        onClick={onClickBtnSeeAll}
      >
        <img src={!seeAll ? imgDropdown : imgDropup} alt="imgDropdown" />
      </button>
    )}
  </ContainerMsgsType>
);

const MsgInvestmint = ({ msg }) => (
  <ContainerMsgsType type={msg.type}>
    {msg.value.neuron && (
      <Row title="neuron" value={<Account address={msg.value.neuron} />} />
    )}
    {msg.value.amount && (
      <Row
        title="amount"
        value={
          <Pane display="flex">
            {formatNumber(msg.value.amount.amount)}
            <ValueImg
              marginContainer="0 0 0 5px"
              marginImg="0 0 0 3px"
              text={msg.value.amount.denom}
            />
          </Pane>
        }
      />
    )}
    {msg.value.resource && (
      <Row title="resource" value={<ValueImg text={msg.value.resource} />} />
    )}
    {msg.value.length && (
      <Row title="length" value={timeSince(msg.value.length * S_TO_MS)} />
    )}
  </ContainerMsgsType>
);

const MsgCreateRoute = ({ msg }) => (
  <ContainerMsgsType type={msg.type}>
    <Row title="source" value={<Account address={msg.value.source} />} />
    <Row title="name" value={msg.value.name} />
    <Row
      title="destination"
      value={<Account address={msg.value.destination} />}
    />
  </ContainerMsgsType>
);

const MsgEditRoute = ({ msg }) => (
  <ContainerMsgsType type={msg.type}>
    <Row title="source" value={<Account address={msg.value.source} />} />
    {msg.value.value && (
      <Row
        title="amount"
        value={
          <Pane display="flex">
            {formatNumber(msg.value.value.amount * 10 ** -3)}
            <ValueImg
              marginContainer="0 0 0 5px"
              marginImg="0 0 0 3px"
              text={msg.value.value.denom}
            />
          </Pane>
        }
      />
    )}
    <Row
      title="destination"
      value={<Account address={msg.value.destination} />}
    />
  </ContainerMsgsType>
);

const MsgDeleteRoute = ({ msg }) => (
  <ContainerMsgsType type={msg.type}>
    <Row title="source" value={<Account address={msg.value.source} />} />
    <Row
      title="destination"
      value={<Account address={msg.value.destination} />}
    />
  </ContainerMsgsType>
);

const MsgEditRouteName = ({ msg }) => <MsgCreateRoute msg={msg} />;

function Activites({ msg }) {
  console.log(msg);
  const [seeAll, setSeeAll] = useState(false);

  switch (msg.type) {
    case 'cyber/MsgCyberlink':
      return (
        <MsgLink
          msg={msg}
          seeAll={seeAll}
          onClickBtnSeeAll={() => setSeeAll(!seeAll)}
        />
      );

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
              <Link to={`/senate/${msg.value.proposal_id}`}>
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
              <Link to={`/senate/${msg.value.proposal_id}`}>
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

    // wasm
    case 'wasm/MsgInstantiateContract':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row title="address" value={<Account address={msg.value.sender} />} />
          <Row title="label" value={msg.value.label} />
          {msg.value.code_id && (
            <Row title="code id" value={msg.value.code_id} />
          )}
          <Row title="message" value={fromUtf8(fromBase64(msg.value.msg))} />
          <Row title="funds" value={
              msg.value.funds.length > 0
              ? msg.value.funds.map((amount, i) => {
                  if (i > 0) {
                    return ` ,${amount.amount} ${amount.denom}`;
                  }
                  return `${formatNumber(
                    amount.amount
                  )} ${amount.denom.toUpperCase()}`;
                })
              : `0 ${CYBER.DENOM_CYBER.toUpperCase()}`
          } />
        </ContainerMsgsType>
      );

    case 'wasm/MsgStoreCode':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row title="address" value={<Account address={msg.value.sender} />} />
          <Row title="wasm byte code" value={msg.value.wasm_byte_code} />
        </ContainerMsgsType>
      );

    case 'wasm/MsgExecuteContract':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row title="address" value={<Account address={msg.value.sender} />} />
          <Row title="contract" value={<Account address={msg.value.contract} />} />
          <Row title="message" value={fromUtf8(fromBase64(msg.value.msg))} />
          <Row title="funds" value={
              msg.value.funds.length > 0
              ? msg.value.funds.map((amount, i) => {
                  if (i > 0) {
                    return ` ,${amount.amount} ${amount.denom}`;
                  }
                  return `${formatNumber(
                    amount.amount
                  )} ${amount.denom.toUpperCase()}`;
                })
              : `0 ${CYBER.DENOM_CYBER.toUpperCase()}`
          } />
        </ContainerMsgsType>
      );

    // Investmint
    case 'cyber/MsgInvestmint':
      return <MsgInvestmint msg={msg} />;

    // grid
    case 'cyber/MsgCreateRoute':
      return <MsgCreateRoute msg={msg} />;

    case 'cyber/MsgEditRoute':
      return <MsgEditRoute msg={msg} />;

    case 'cyber/MsgDeleteRoute':
      return <MsgDeleteRoute msg={msg} />;

    case 'cyber/MsgEditRouteName':
      return <MsgEditRouteName msg={msg} />;

    // swap
    case 'liquidity/MsgSwapWithinBatch':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row title="Swap requester address" value={<Account address={msg.value.swap_requester_address} />} />
          <Row title="Demand coin denom" value={msg.value.demand_coin_denom} />
          <Row
            title="Offer coin"
            value={
              `${formatNumber(msg.value.offer_coin.amount)} ${msg.value.offer_coin.denom.toUpperCase()}`
            }
          />
          <Row
            title="Offer coin fee"
            value={
              `${formatNumber(msg.value.offer_coin_fee.amount)} ${msg.value.offer_coin_fee.denom.toUpperCase()}`
            }
          />
          <Row title="Order price" value={msg.value.order_price} />
          <Row title="Pool ID" value={msg.value.pool_id} />
          <Row title="Swap type id" value={msg.value.swap_type_id} />
        </ContainerMsgsType>
      )

    case 'liquidity/MsgDepositWithinBatch':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row title="Depositor address" value={<Account address={msg.value.depositor_address} />} />
          <Row title="Pool id" value={msg.value.pool_id} />
          <Row
            title="Deposit coins"
            value={msg.value.deposit_coins.map((data, i) => {
              return (
                `${formatNumber(data.amount)} ${data.denom.toUpperCase()} /`
              );
            })}
          />
        </ContainerMsgsType>
      )

    case 'liquidity/MsgWithdrawWithinBatch':
      return (
        <ContainerMsgsType type={msg.type}>
          <Row title="Withdrawer address" value={<Account address={msg.value.withdrawer_address} />} />
          <Row title="Pool id" value={msg.value.pool_id} />
          <Row
            title="Pool coin"
            value={
                `${formatNumber(msg.value.pool_coin.amount)} ${msg.value.pool_coin.denom.toUpperCase()}`
            }
          />
        </ContainerMsgsType>
      )

    case 'cosmos-sdk/MsgTransfer': 
      return (
        <ContainerMsgsType type={msg.type}>
          <Row title="Sender" value={<Account address={msg.value.sender} />} />
          <Row title="Receiver" value={<Account address={msg.value.receiver} />} />
          <Row title="Source channel" value={msg.value.source_channel} />
          <Row title="Source port" value={msg.value.source_port} />
          <Row
            title="Token"
            value={
              `${formatNumber(msg.value.token.amount)} ${msg.value.token.denom.toUpperCase()}`
            }
          />
          <Row
            title="Timeout height"
            value={
              `${formatNumber(msg.value.timeout_height.revision_height)} / ${formatNumber(msg.value.timeout_height.revision_number)}`
            }
          />
        </ContainerMsgsType>
      )   

    default:
      return <div>{JSON.stringify(msg.value)}</div>;
  }
}

export default Activites;
