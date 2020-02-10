import React, { useState } from 'react';
import gql from 'graphql-tag';
import { useSubscription } from '@apollo/react-hooks';
import { Tablist, Tab } from '@cybercongress/gravity';
import TableTxs from './tableTxs';
import { CardTemplate, Loading } from '../../components';

const transfer = `
  "cosmos-sdk/MsgSend",
  "cosmos-sdk/MsgMultiSend"`;

const staking = `
"cosmos-sdk/MsgCreateValidator",
"cosmos-sdk/MsgEditValidator",
"cosmos-sdk/MsgDelegate",
"cosmos-sdk/MsgUndelegate",
"cosmos-sdk/MsgBeginRedelegate"`;

const distribution = `
  "cosmos-sdk/MsgWithdrawValidatorCommission",
  "cosmos-sdk/MsgWithdrawDelegationReward",
  "cosmos-sdk/MsgModifyWithdrawAddress"`;

const governance = `
"cosmos-sdk/MsgSubmitProposal",
"cosmos-sdk/MsgDeposit",
"cosmos-sdk/MsgVote"
 `;

const slashing = `"cosmos-sdk/MsgUnjail"`;

const TabBtn = ({ text, isSelected, onSelect }) => (
  <Tab
    key={text}
    isSelected={isSelected}
    onSelect={onSelect}
    paddingX={30}
    paddingY={20}
    marginX={3}
    borderRadius={4}
    color="#36d6ae"
    boxShadow="0px 0px 5px #36d6ae"
    fontSize="14px"
    whiteSpace="nowrap"
  >
    {text}
  </Tab>
);

export default function GetTxs({ accountUser }) {
  const [type, setType] = useState(transfer);
  const [selected, setSelected] = useState('transfer');

  const GET_CHARACTERS = gql`
  subscription MyQuery {
    transaction(where: {message: {subject: {_eq: "${accountUser}"}, type: {_in: [${type}] }}}
    order_by: { height: desc }
    ) {
      txhash
      code
      timestamp
      height
      message {
        type
      }
    }
  }
  
  `;
  const { loading, error, data: dataTxs } = useSubscription(GET_CHARACTERS);

  if (error) {
    return `Error! ${error.message}`;
  }

  const select = (typeArg, array) => {
    setType(array);
    setSelected(typeArg);
  };

  console.log('data wss', dataTxs);

  return (
    <CardTemplate paddingBottom={10} title="Txs">
      <Tablist marginBottom={20}>
        <TabBtn
          text="Transfer"
          isSelected={selected === 'transfer'}
          onSelect={() => select('transfer', transfer)}
        />
        <TabBtn
          text="Staking"
          isSelected={selected === 'staking'}
          onSelect={() => select('staking', staking)}
        />
        <TabBtn
          text="Distribution"
          isSelected={selected === 'distribution'}
          onSelect={() => select('distribution', distribution)}
        />
        <TabBtn
          text="Governance"
          isSelected={selected === 'governance'}
          onSelect={() => select('governance', governance)}
        />
        <TabBtn
          text="Slashing"
          isSelected={selected === 'slashing'}
          onSelect={() => select('slashing', slashing)}
        />
      </Tablist>
      {loading ? (
        <div className="container-loading">
          <Loading />
        </div>
      ) : (
        <TableTxs data={dataTxs.transaction} type={selected} />
      )}
    </CardTemplate>
  );
}
