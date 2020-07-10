import React from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { Votes, IconStatus, Tooltip, Deposit } from '../../../components';
import { formatCurrency, formatNumber } from '../../../utils/utils';
import { CYBER } from '../../../utils/config';

const textPropsImg = require('../../../image/reader-outline.svg');
const paramChangePropsImg = require('../../../image/cog-outline.svg');
const comPropsImg = require('../../../image/wallet-outline.svg');

const finalTallyResult = item => {
  const finalVotes = {
    yes: 0,
    no: 0,
    abstain: 0,
    noWithVeto: 0,
  };
  let finalTotalVotes = 0;
  const yes = parseFloat(item.yes);
  const abstain = parseFloat(item.abstain);
  const no = parseFloat(item.no);
  const noWithVeto = parseFloat(item.no_with_veto);

  finalTotalVotes = yes + abstain + no + noWithVeto;
  if (finalTotalVotes !== 0) {
    finalVotes.yes = (yes / finalTotalVotes) * 100;
    finalVotes.no = (no / finalTotalVotes) * 100;
    finalVotes.abstain = (abstain / finalTotalVotes) * 100;
    finalVotes.noWithVeto = (noWithVeto / finalTotalVotes) * 100;
  }
  return finalVotes;
};

const TypeProps = ({ type }) => {
  let typeImg;
  let textType;

  switch (type) {
    case 'cosmos-sdk/ParameterChangeProposal':
      typeImg = paramChangePropsImg;
      textType = 'Parameter Change Proposal';
      break;
    case 'cosmos-sdk/CommunityPoolSpendProposal':
      typeImg = comPropsImg;
      textType = 'Community Pool Spend Proposal';

      break;

    default:
      typeImg = textPropsImg;
      textType = 'Text Proposal';
      break;
  }
  return (
    <Tooltip placement="bottom" tooltip={textType}>
      <img style={{ width: 25, height: 25 }} src={typeImg} alt="type" />
    </Tooltip>
  );
};

const AcceptedCard = ({ id, name, votes, type, amount, timeEnd }) => (
  <Pane
    position="relative"
    paddingRight="35px"
    boxShadow="0 0 5px 0px #3ab793"
    paddingBottom="20px"
    paddingLeft="15px"
    paddingTop="10px"
    borderRadius="5px"
  >
    <Pane position="absolute" right="5px" top="5px">
      <TypeProps type={type} />
    </Pane>
    <Pane fontSize="20px" marginBottom={15}>
      #{id} {name}
    </Pane>
    <Pane marginBottom={5}>
      <Pane marginBottom={2}>Votes:</Pane>
      <Votes finalVotes={finalTallyResult(votes)} />
    </Pane>
    <Pane>Amount: {formatCurrency(amount.amount, amount.denom)}</Pane>
    <Pane>
      <Pane marginBottom={2}>Time accepted:</Pane>
      <Pane>{timeEnd}</Pane>
    </Pane>
  </Pane>
);

const RejectedCard = ({ id, name, votes, type, amount, timeEnd }) => (
  <Pane
    position="relative"
    paddingRight="35px"
    boxShadow="0 0 5px 0px #3ab793"
    paddingBottom="20px"
    paddingLeft="15px"
    paddingTop="10px"
    borderRadius="5px"
  >
    <Pane position="absolute" right="5px" top="5px">
      <TypeProps type={type} />
    </Pane>
    <Pane fontSize="20px" marginBottom={15}>
      #{id} {name}
    </Pane>
    <Pane marginBottom={5}>
      <Pane marginBottom={2}>Votes:</Pane>
      <Votes finalVotes={finalTallyResult(votes)} />
    </Pane>
    <Pane>Amount: {formatCurrency(amount.amount, amount.denom)}</Pane>
    <Pane>
      <Pane marginBottom={2}>Time rejected:</Pane>
      <Pane>{timeEnd}</Pane>
    </Pane>
  </Pane>
);

const ActiveCard = ({
  id,
  name,
  state,
  votes,
  type = '',
  amount = 0,
  timeEndDeposit,
  timeEndVoting,
  totalDeposit,
  minDeposit,
}) => (
  <Pane
    position="relative"
    paddingRight="35px"
    boxShadow="0 0 5px 0px #3ab793"
    paddingBottom="20px"
    paddingLeft="15px"
    paddingTop="10px"
    borderRadius="5px"
  >
    <Pane position="absolute" right="5px" top="5px">
      <TypeProps type={type} />
    </Pane>
    <Pane fontSize="20px" marginBottom={15}>
      #{id} {name}
    </Pane>
    <Pane marginBottom={2}>
      <Pane alignItems="center" display="flex" marginBottom={2}>
        State:
        <IconStatus marginLeft={10} marginRight={5} size={25} status={state} />
        {state}
      </Pane>
    </Pane>

    {/* {state === 'VotingPeriod' && (
      <Pane marginBottom={2}>
        <Pane marginBottom={2}>Status:</Pane>
        <Votes finalVotes={finalTallyResult(votes)} />
      </Pane>
    )} */}

    {state === 'DepositPeriod' && (
      <Pane marginBottom={30}>
        <Pane marginBottom={2}>Status:</Pane>
        <Pane
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Text marginX={5} color="#fff">
            0
          </Text>
          <Deposit totalDeposit={totalDeposit} minDeposit={minDeposit} />
          <Text marginX={5} color="#fff" whiteSpace="nowrap">
            {formatNumber(minDeposit * 10 ** -9)} {CYBER.DENOM_CYBER_G}
          </Text>
        </Pane>
      </Pane>
    )}

    {state === 'DepositPeriod' && (
      <Pane>
        <Pane marginBottom={2}>Deposit End Time:</Pane>
        <Pane>{timeEndDeposit}</Pane>
      </Pane>
    )}
    {state === 'VotingPeriod' && (
      <Pane>
        <Pane marginBottom={2}>Voting End Time:</Pane>
        <Pane>{timeEndVoting}</Pane>
      </Pane>
    )}
  </Pane>
);

export { AcceptedCard, ActiveCard, RejectedCard };
