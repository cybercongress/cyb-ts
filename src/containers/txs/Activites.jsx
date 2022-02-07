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
    <ContainerMsgsType type={msg['@type']}>
      <Row
        title="Inputs"
        value={msg.inputs.map((data, i) => {
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
        value={msg.outputs.map((data, i) => {
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
  <ContainerMsgsType type={msg['@type']}>
    <Row title="Neuron" value={<Account address={msg.neuron} />} />
    {msg.links.slice(0, seeAll ? msg.length : 1).map((item, index) => (
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
    {msg.links.length > 1 && (
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
  <ContainerMsgsType type={msg['@type']}>
    {msg.neuron && (
      <Row title="neuron" value={<Account address={msg.neuron} />} />
    )}
    {msg.amount && (
      <Row
        title="amount"
        value={
          <Pane display="flex">
            {formatNumber(msg.amount.amount)}
            <ValueImg
              marginContainer="0 0 0 5px"
              marginImg="0 0 0 3px"
              text={msg.amount.denom}
            />
          </Pane>
        }
      />
    )}
    {msg.resource && (
      <Row title="resource" value={<ValueImg text={msg.resource} />} />
    )}
    {msg.length && (
      <Row title="length" value={timeSince(msg.length * S_TO_MS)} />
    )}
  </ContainerMsgsType>
);

const MsgCreateRoute = ({ msg }) => (
  <ContainerMsgsType type={msg['@type']}>
    <Row title="source" value={<Account address={msg.source} />} />
    <Row title="name" value={msg.name} />
    <Row title="destination" value={<Account address={msg.destination} />} />
  </ContainerMsgsType>
);

const MsgEditRoute = ({ msg }) => (
  <ContainerMsgsType type={msg['@type']}>
    <Row title="source" value={<Account address={msg.source} />} />
    {msg && (
      <Row
        title="amount"
        value={
          <Pane display="flex">
            {formatNumber(msg.amount * 10 ** -3)}
            <ValueImg
              marginContainer="0 0 0 5px"
              marginImg="0 0 0 3px"
              text={msg.denom}
            />
          </Pane>
        }
      />
    )}
    <Row title="destination" value={<Account address={msg.destination} />} />
  </ContainerMsgsType>
);

const MsgDeleteRoute = ({ msg }) => (
  <ContainerMsgsType type={msg['@type']}>
    <Row title="source" value={<Account address={msg.source} />} />
    <Row title="destination" value={<Account address={msg.destination} />} />
  </ContainerMsgsType>
);

const MsgEditRouteName = ({ msg }) => <MsgCreateRoute msg={msg} />;

function Activites({ msg }) {
  console.log(msg);
  const [seeAll, setSeeAll] = useState(false);
  let type = '';

  if (msg['@type']) {
    type = msg['@type'];
  }

  if (type.includes('MsgCyberlink')) {
    return (
      <MsgLink
        msg={msg}
        seeAll={seeAll}
        onClickBtnSeeAll={() => setSeeAll(!seeAll)}
      />
    );
  }

  // bank
  if (type.includes('MsgSend')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row title="From" value={<Account address={msg.from_address} />} />
        <Row title="To" value={<Account address={msg.to_address} />} />
        <Row
          title="amount"
          value={
            msg.amount.length > 0
              ? msg.amount.map((amount, i) => {
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
  }

  // case 'cosmos-sdk/MsgMultiSend':
  if (type.includes('MsgMultiSend')) {
    return <MultiSend msg={msg} />;
  }

  // staking
  if (type.includes('MsgCreateValidator')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Delegator"
          value={<Account address={msg.delegator_address} />}
        />
        <Row
          title="Validator"
          value={<Account address={msg.validator_address} />}
        />
        <Row
          title="Mininum Self Delegation"
          value={`${formatNumber(msg.min_self_delegation)}
           ${CYBER.DENOM_CYBER.toUpperCase()}`}
        />
        <Row title="Commission Rate" value={msg.commission.rate} />
        <Row title="Description" value={msg.description.moniker} />
      </ContainerMsgsType>
    );
  }
  if (type.includes('MsgEditValidator')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row title="Address" value={<Account address={msg.address} />} />
      </ContainerMsgsType>
    );
  }
  if (type.includes('MsgDelegate')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Delegator"
          value={<Account address={msg.delegator_address} />}
        />
        <Row
          title="Validator"
          value={<Account address={msg.validator_address} />}
        />
        <Row
          title="Delegation Amount"
          value={`${formatNumber(
            msg.amount.amount
          )} ${msg.amount.denom.toUpperCase()}`}
        />
      </ContainerMsgsType>
    );
  }
  if (type.includes('MsgUndelegate')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Delegator"
          value={<Account address={msg.delegator_address} />}
        />
        <Row
          title="Validator"
          value={<Account address={msg.validator_address} />}
        />
        <Row
          title="Undelegation Amount"
          value={`${formatNumber(
            msg.amount.amount
          )} ${msg.amount.denom.toUpperCase()}`}
        />
      </ContainerMsgsType>
    );
  }
  if (type.includes('MsgBeginRedelegate')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Delegator"
          value={<Account address={msg.delegator_address} />}
        />
        <Row
          title="Redelegated from"
          value={<Account address={msg.validator_src_address} />}
        />
        <Row
          title="Redelegated to"
          value={<Account address={msg.validator_dst_address} />}
        />
        <Row
          title="Redelegation Amount"
          value={`${formatNumber(
            msg.amount.amount
          )} ${msg.amount.denom.toUpperCase()}`}
        />
      </ContainerMsgsType>
    );
  }

  // gov
  if (type.includes('MsgSubmitProposal')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row title="Proposer" value={<Account address={msg.proposer} />} />
        <Row
          title="Initail Deposit"
          value={
            msg.initial_deposit.length > 0
              ? msg.initial_deposit.map((amount, i) => {
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
  }

  if (type.includes('MsgDeposit')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Proposal Id"
          value={
            <Link to={`/senate/${msg.proposal_id}`}>{msg.proposal_id}</Link>
          }
        />
        <Row title="Depositor" value={<Account address={msg.depositor} />} />
        <Row
          title="Amount"
          value={msg.amount.map((amount, i) => {
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
  }

  if (type.includes('MsgVote')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Proposal Id"
          value={
            <Link to={`/senate/${msg.proposal_id}`}>{msg.proposal_id}</Link>
          }
        />
        <Row title="Voter" value={<Account address={msg.voter} />} />
        <Row title="Vote Option" value={msg.option} />
      </ContainerMsgsType>
    );
  }

  // distribution
  if (type.includes('MsgWithdrawValidatorCommission')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="address"
          value={<Account address={msg.validator_address} />}
        />
      </ContainerMsgsType>
    );
  }

  if (type.includes('MsgWithdrawDelegatorReward')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="delegator"
          value={<Account address={msg.delegator_address} />}
        />
        <Row
          title="validator"
          value={<Account address={msg.validator_address} />}
        />
      </ContainerMsgsType>
    );
  }

  if (type.includes('MsgModifyWithdrawAddress')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="delegator"
          value={<Account address={msg.delegator_address} />}
        />
      </ContainerMsgsType>
    );
  }

  // slashing
  if (type.includes('MsgUnjail')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row title="address" value={<Account address={msg.address} />} />
      </ContainerMsgsType>
    );
  }

  // wasm
  if (type.includes('MsgInstantiateContract')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row title="address" value={<Account address={msg.sender} />} />
        <Row title="label" value={msg.label} />
        {msg.code_id && <Row title="code id" value={msg.code_id} />}
        <Row title="message" value={fromUtf8(fromBase64(msg.msg))} />
        <Row
          title="funds"
          value={
            msg.funds.length > 0
              ? msg.funds.map((amount, i) => {
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
  }

  if (type.includes('MsgStoreCode')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row title="address" value={<Account address={msg.sender} />} />
        <Row title="wasm byte code" value={msg.wasm_byte_code} />
      </ContainerMsgsType>
    );
  }

  if (type.includes('MsgExecuteContract')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row title="address" value={<Account address={msg.sender} />} />
        <Row title="contract" value={<Account address={msg.contract} />} />
        <Row title="message" value={fromUtf8(fromBase64(msg.msg))} />
        <Row
          title="funds"
          value={
            msg.funds.length > 0
              ? msg.funds.map((amount, i) => {
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
  }

  // Investmint
  if (type.includes('MsgInvestmint')) {
    return <MsgInvestmint msg={msg} />;
  }

  // grid
  if (type.includes('MsgCreateRoute')) {
    return <MsgCreateRoute msg={msg} />;
  }

  if (type.includes('MsgEditRoute')) {
    return <MsgEditRoute msg={msg} />;
  }

  if (type.includes('MsgDeleteRoute')) {
    return <MsgDeleteRoute msg={msg} />;
  }

  if (type.includes('MsgEditRouteName')) {
    return <MsgEditRouteName msg={msg} />;
  }

  // swap
  if (type.includes('MsgSwapWithinBatch')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Swap requester address"
          value={<Account address={msg.swap_requester_address} />}
        />
        <Row title="Demand coin denom" value={msg.demand_coin_denom} />
        <Row
          title="Offer coin"
          value={`${formatNumber(
            msg.offer_coin.amount
          )} ${msg.offer_coin.denom.toUpperCase()}`}
        />
        <Row
          title="Offer coin fee"
          value={`${formatNumber(
            msg.offer_coin_fee.amount
          )} ${msg.offer_coin_fee.denom.toUpperCase()}`}
        />
        <Row title="Order price" value={msg.order_price} />
        <Row title="Pool ID" value={msg.pool_id} />
        <Row title="Swap type id" value={msg.swap_type_id} />
      </ContainerMsgsType>
    );
  }

  if (type.includes('MsgDepositWithinBatch')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Depositor address"
          value={<Account address={msg.depositor_address} />}
        />
        <Row title="Pool id" value={msg.pool_id} />
        <Row
          title="Deposit coins"
          value={msg.deposit_coins.map((data, i) => {
            return `${formatNumber(data.amount)} ${data.denom.toUpperCase()} /`;
          })}
        />
      </ContainerMsgsType>
    );
  }

  if (type.includes('MsgWithdrawWithinBatch')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row
          title="Withdrawer address"
          value={<Account address={msg.withdrawer_address} />}
        />
        <Row title="Pool id" value={msg.pool_id} />
        <Row
          title="Pool coin"
          value={`${formatNumber(
            msg.pool_coin.amount
          )} ${msg.pool_coin.denom.toUpperCase()}`}
        />
      </ContainerMsgsType>
    );
  }

  if (type.includes('MsgTransfer')) {
    return (
      <ContainerMsgsType type={msg['@type']}>
        <Row title="Sender" value={<Account address={msg.sender} />} />
        <Row title="Receiver" value={<Account address={msg.receiver} />} />
        <Row title="Source channel" value={msg.source_channel} />
        <Row title="Source port" value={msg.source_port} />
        <Row
          title="Token"
          value={`${formatNumber(
            msg.token.amount
          )} ${msg.token.denom.toUpperCase()}`}
        />
        <Row
          title="Timeout height"
          value={`${formatNumber(
            msg.timeout_height.revision_height
          )} / ${formatNumber(msg.timeout_height.revision_number)}`}
        />
      </ContainerMsgsType>
    );
  }

  return <div>{JSON.stringify(msg)}</div>;
}

export default Activites;
