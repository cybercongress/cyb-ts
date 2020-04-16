import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import {
  Votes,
  Legend,
  IconStatus,
  Deposit,
  ContainerPane,
  Item,
} from '../../components';
import proposalsIdJson from './proposalsId';
import proposerJson from './proposer';
import {
  getProposals,
  getStakingPool,
  getTallying,
  getProposalsDetail,
  getProposer,
  getProposalsDetailVotes,
  getMinDeposit,
  getTableVoters,
} from '../../utils/governance';
import ActionBarDetail from './actionBarDatail';

import ProposalsIdDetail from './proposalsIdDetail';
import ProposalsDetailProgressBar from './proposalsDetailProgressBar';
import ProposalsIdDetailTableVoters from './proposalsDetailTableVoters';

const dateFormat = require('dateformat');

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
  finalVotes.finalTotalVotes = finalTotalVotes;
  return finalVotes;
};

class ProposalsDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      proposals: {},
      id: '',
      proposalsInfo: {
        title: '',
        proposer: '',
        type: '',
        description: '',
      },
      time: {
        submitTime: '',
        depositEndTime: '',
        votingStartTime: '',
        votingEndTime: '',
      },
      totalDeposit: 0,
      minDeposit: 0,
      proposalStatus: '',
      tallying: {
        quorum: '',
        threshold: '',
        veto: '',
      },
      tally: {
        participation: '',
        yes: '',
        abstain: '',
        no: '',
        noWithVeto: '',
      },
      votes: {
        yes: 0,
        no: 0,
        abstain: 0,
        noWithVeto: 0,
        voter: '',
      },
      tableVoters: [],
      period: '',
    };
  }

  async componentDidMount() {
    this.init();
  }

  init = async () => {
    await this.getProposalsInfo();
    this.getTimes();
    this.getStatusVoting();
    this.getVotes();
    this.getDeposit();
    this.getTableVoters();
  };

  getProposalsInfo = async () => {
    // const proposals = proposalsIdJson[0].result;
    const { match } = this.props;
    const proposalId = match.params.proposal_id;
    const proposalsInfo = {};

    const proposals = await getProposalsDetail(proposalId);
    const proposer = await getProposer(proposalId);

    proposalsInfo.title = proposals.content.value.title;
    proposalsInfo.type = proposals.content.type;
    proposalsInfo.description = proposals.content.value.description;
    proposalsInfo.proposer = proposer.proposer;

    this.setState({
      proposals,
      proposalsInfo,
      id: proposalId,
    });
  };

  getStatusVoting = async () => {
    const { proposals } = this.state;
    // const proposals = proposalsIdJson[0].result;
    let proposalStatus = '';
    let tally = {};
    let participation = 0;

    const stakingPool = await getStakingPool();
    const tallying = await getTallying();

    proposalStatus = proposals.proposal_status;

    tally = finalTallyResult(proposals.final_tally_result);
    participation = (tally.finalTotalVotes / stakingPool.bonded_tokens) * 100;
    tally.participation = participation;

    this.setState({
      proposalStatus,
      tally,
      tallying,
    });
  };

  getDeposit = async () => {
    const { proposals } = this.state;
    let period = '';
    let minDeposit = 0;

    let totalDeposit = 0;

    const minDepositData = await getMinDeposit();

    if (proposals.total_deposit.length) {
      totalDeposit = parseFloat(proposals.total_deposit[0].amount);
    }

    minDeposit = parseFloat(minDepositData.min_deposit[0].amount);

    if (totalDeposit < minDeposit) {
      period = 'deposit';
    } else {
      period = 'vote';
    }

    this.setState({
      period,
      totalDeposit,
      minDeposit,
    });
  };

  getTimes = () => {
    // const proposals = proposalsIdJson[0].result;
    const { proposals } = this.state;

    const time = {};

    time.submitTime = dateFormat(
      new Date(proposals.submit_time),
      'dd/mm/yyyy, h:MM:ss TT'
    );

    time.depositEndTime = dateFormat(
      new Date(proposals.deposit_end_time),
      'dd/mm/yyyy, h:MM:ss TT'
    );
    time.votingStartTime = dateFormat(
      new Date(proposals.voting_start_time),
      'dd/mm/yyyy, h:MM:ss TT'
    );
    time.votingEndTime = dateFormat(
      new Date(proposals.voting_end_time),
      'dd/mm/yyyy, h:MM:ss TT'
    );

    this.setState({
      time,
    });
  };

  getVotes = async () => {
    const { id } = this.state;
    const votes = {};
    let yes = [];
    let no = [];
    let abstain = [];
    let noWithVeto = [];

    const getVotes = await getProposalsDetailVotes(id);
    if (getVotes) {
      yes = getVotes.filter(item => item.option === 'Yes').length;
      no = getVotes.filter(item => item.option === 'No').length;
      abstain = getVotes.filter(item => item.option === 'Abstain').length;
      noWithVeto = getVotes.filter(item => item.option === 'noWithVeto').length;
    }

    votes.voter = getVotes;
    votes.yes = yes;
    votes.no = no;
    votes.abstain = abstain;
    votes.noWithVeto = noWithVeto;

    this.setState({
      votes,
    });
  };

  getTableVoters = async () => {
    const { id } = this.state;

    let tableVoters = [];

    const data = await getTableVoters(id);

    if (data) {
      tableVoters = data;
    }

    this.setState({
      tableVoters,
    });
  };

  getSubStr = str => {
    let string = str;
    if (string.indexOf('cosmos-sdk/') !== -1) {
      string = string.slice(string.indexOf('/') + 1);
      return string;
    }
    return string;
  };

  render() {
    const {
      proposalsInfo,
      time,
      proposalStatus,
      tally,
      votes,
      id,
      totalDeposit,
      minDeposit,
      tallying,
      tableVoters,
      period,
    } = this.state;

    return (
      <div>
        <main className="block-body">
          <Pane paddingBottom={50}>
            <Pane height={70} display="flex" alignItems="center">
              <Text paddingLeft={20} fontSize="18px" color="#fff">
                #{id} {proposalsInfo.title}
              </Text>
            </Pane>
            <Pane display="flex" marginBottom={10} paddingLeft={20}>
              <IconStatus status={proposalStatus} marginRight={8} />
              <Text color="#fff">{proposalStatus}</Text>
            </Pane>
            <ContainerPane marginBottom={20}>
              <Item
                marginBottom={15}
                title="Proposer"
                value={
                  <a
                    href={`https://callisto.cybernode.ai/account/${proposalsInfo.proposer}`}
                  >
                    {proposalsInfo.proposer}
                  </a>
                }
              />
              <Item
                marginBottom={15}
                title="Type"
                value={this.getSubStr(proposalsInfo.type)}
              />
              <Item title="Description" value={proposalsInfo.description} />
            </ContainerPane>

            <ProposalsIdDetail
              time={time}
              proposalStatus={proposalStatus}
              tallying={tallying}
              tally={tally}
              totalDeposit={totalDeposit}
              marginBottom={20}
            />

            <ProposalsDetailProgressBar
              proposalStatus={proposalStatus}
              totalDeposit={totalDeposit}
              minDeposit={minDeposit}
              tallying={tallying}
              tally={tally}
            />

            <ProposalsIdDetailTableVoters data={tableVoters} votes={votes} />
          </Pane>
        </main>
        <ActionBarDetail
          id={id}
          period={period}
          minDeposit={minDeposit}
          totalDeposit={totalDeposit}
          update={this.init}
        />
      </div>
    );
  }
}

export default ProposalsDetail;
