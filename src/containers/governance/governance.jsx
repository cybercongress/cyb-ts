import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { Votes, Legend, IconStatus, Tooltip } from '../../components';
import ActionBar from './actionBar';
import { formatCurrency } from '../../utils/utils';

import { getProposals } from '../../utils/governance';

const dateFormat = require('dateformat');

const textPropsImg = require('../../image/reader-outline.svg');
const paramChangePropsImg = require('../../image/cog-outline.svg');
const comPropsImg = require('../../image/wallet-outline.svg');

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
      <img style={{ width: 30, height: 30 }} src={typeImg} alt="type" />
    </Tooltip>
  );
};

const finalTallyResult = item => {
  const finalVotes = {};
  let finalTotalVotes = 0;
  const yes = parseInt(item.yes);
  const abstain = parseInt(item.abstain);
  const no = parseInt(item.no);
  const noWithVeto = parseInt(item.no_with_veto);

  finalTotalVotes = yes + abstain + no + noWithVeto;
  finalVotes.yes = (yes / finalTotalVotes) * 100;
  finalVotes.no = (no / finalTotalVotes) * 100;
  finalVotes.abstain = (abstain / finalTotalVotes) * 100;
  finalVotes.noWithVeto = (noWithVeto / finalTotalVotes) * 100;
  return finalVotes;
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

    {state === 'VotingPeriod' && (
      <Pane marginBottom={2}>
        <Pane marginBottom={2}>Votes:</Pane>
        {/* <Votes finalVotes={finalTallyResult(votes)} /> */}
      </Pane>
    )}
    {state === 'DepositPeriod' && (
      <Pane>Amount: {formatCurrency(amount.amount, amount.denom)}</Pane>
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

class Governance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
    };

    this.routeChange = this.routeChange.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init = async () => {
    const proposals = await getProposals();
    this.setState({
      // table: proposals[0].result,
      table: proposals,
    });
  };

  routeChange = newPath => {
    const { history } = this.props;
    const path = newPath;
    history.push(path);
  };

  finalTallyResult = item => {
    const finalVotes = {};
    let finalTotalVotes = 0;
    const yes = parseInt(item.yes);
    const abstain = parseInt(item.abstain);
    const no = parseInt(item.no);
    const noWithVeto = parseInt(item.no_with_veto);

    finalTotalVotes = yes + abstain + no + noWithVeto;
    finalVotes.yes = (yes / finalTotalVotes) * 100;
    finalVotes.no = (no / finalTotalVotes) * 100;
    finalVotes.abstain = (abstain / finalTotalVotes) * 100;
    finalVotes.noWithVeto = (noWithVeto / finalTotalVotes) * 100;
    return finalVotes;
  };

  render() {
    const { table } = this.state;

    const active = table
      .reverse()
      .filter(
        item =>
          item.proposal_status !== 'Passed' &&
          item.proposal_status !== 'Rejected'
      )
      .map(item => (
        <ActiveCard
          key={item.id}
          id={item.id}
          name={item.content.value.title}
          state={item.proposal_status}
          timeEndDeposit={dateFormat(
            new Date(item.deposit_end_time),
            'dd/mm/yyyy, h:MM:ss TT'
          )}
          timeEndVoting={dateFormat(
            new Date(item.voting_end_time),
            'dd/mm/yyyy, h:MM:ss TT'
          )}
          amount={item.total_deposit[0]}
        />
      ));

    const accepted = table
      .filter(item => item.proposal_status === 'Passed')
      .map(item => (
        <AcceptedCard
          key={item.id}
          id={item.id}
          name={item.content.value.title}
          votes={item.final_tally_result}
          type={item.content.type}
          amount={item.total_deposit[0]}
          timeEnd={dateFormat(
            new Date(item.voting_end_time),
            'dd/mm/yyyy, h:MM:ss TT'
          )}
        />
      ));

    const rejected = table
      .reverse()
      .filter(item => item.proposal_status === 'Rejected')
      .map(item => (
        <RejectedCard
          key={item.id}
          id={item.id}
          name={item.content.value.title}
          votes={item.final_tally_result}
          type={item.content.type}
          amount={item.total_deposit[0]}
          timeEnd={dateFormat(
            new Date(item.voting_end_time),
            'dd/mm/yyyy, h:MM:ss TT'
          )}
        />
      ));

    return (
      <div>
        <main className="block-body">
          <Pane
            display="grid"
            justifyItems="center"
            gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
            gridGap="20px"
          >
            <Pane
              width="100%"
              display="grid"
              gridTemplateColumns="100%"
              gridGap="20px"
              gridTemplateRows="max-content"
              alignItems="flex-start"
            >
              <Pane maxHeight="20px" fontSize={20}>
                Active
              </Pane>
              {active}
            </Pane>
            <Pane
              width="100%"
              display="grid"
              gridTemplateColumns="100%"
              gridGap="20px"
              gridTemplateRows="max-content"
              alignItems="flex-start"
            >
              <Pane maxHeight="20px" fontSize={20}>
                Accepted
              </Pane>
              {accepted}
            </Pane>
            <Pane
              width="100%"
              display="grid"
              gridTemplateColumns="100%"
              gridGap="20px"
              gridTemplateRows="max-content"
              alignItems="flex-start"
            >
              <Pane maxHeight="20px" fontSize={20}>
                Rejected
              </Pane>
              {rejected}
            </Pane>
          </Pane>
        </main>
        <ActionBar update={this.init} />
      </div>
    );
  }
}

export default Governance;
