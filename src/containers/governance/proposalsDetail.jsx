import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { formatNumber } from '../../utils/search/utils';
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
} from '../../utils/governance';

const dateFormat = require('dateformat');
const iconPie = require('../../image/_ionicons_svg_ios-pie.svg');
const iconPieActive = require('../../image/_ionicons_svg_ios-pie-active.svg');

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
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
    };
  }

  async componentDidMount() {
    await this.getProposalsInfo();
    this.getTimes();
    this.getStatusVoting();
    this.getVotes();
    this.getDeposit();
  }

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

    let totalDeposit = 0;

    const minDeposit = await getMinDeposit();

    totalDeposit = proposals.total_deposit[0].amount;

    this.setState({
      totalDeposit,
      minDeposit: minDeposit.min_deposit[0].amount,
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

    yes = getVotes.filter(item => item.option === 'Yes').length;
    no = getVotes.filter(item => item.option === 'No').length;
    abstain = getVotes.filter(item => item.option === 'Abstain').length;
    noWithVeto = getVotes.filter(item => item.option === 'noWithVeto').length;

    votes.voter = getVotes;
    votes.yes = yes;
    votes.no = no;
    votes.abstain = abstain;
    votes.noWithVeto = noWithVeto;

    this.setState({
      votes,
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
    } = this.state;

    const { submitTime, depositEndTime, votingStartTime, votingEndTime } = time;
    const { yes, abstain, no, noWithVeto, participation } = tally;
    const { quorum, threshold, veto } = tallying;
    const { voter } = votes;

    return (
      <main className="block-body-home">
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

          <Pane
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(450px, 1fr))"
            gridGap={20}
          >
            <ContainerPane>
              <Item marginBottom={15} title="Submit Time" value={submitTime} />
              <Item
                marginBottom={15}
                title="Deposit Endtime"
                value={depositEndTime}
              />
              <Item
                marginBottom={15}
                title="Total Deposit"
                value={`${formatNumber(totalDeposit * 10 ** -9)} GCYB`}
              />
              <Item
                marginBottom={15}
                title="Voting Starttime"
                value={votingStartTime}
              />
              <Item title="Voting Endtime" value={votingEndTime} />
            </ContainerPane>

            <ContainerPane>
              <Item
                marginBottom={15}
                title="Status"
                value={
                  <Pane display="flex">
                    <IconStatus status={proposalStatus} marginRight={8} />
                    <Text color="#fff">{proposalStatus}</Text>
                  </Pane>
                }
              />
              <Item
                marginBottom={15}
                title="Participation"
                value={`${toFixedNumber(
                  participation,
                  2
                )}% (Quorum ${toFixedNumber(quorum * 100, 2)}%)`}
              />
              <Item
                marginBottom={15}
                title="Yes"
                value={`${yes}% (Threshold ${toFixedNumber(
                  threshold * 100,
                  2
                )}%)`}
              />
              <Item marginBottom={15} title="No" value={`${no}%`} />
              <Item
                marginBottom={15}
                title="NoWithVeto"
                value={`${noWithVeto}% (Threshold ${toFixedNumber(
                  veto * 100,
                  2
                )}%)`}
              />
              <Item title="Abstain" value={`${abstain}%`} />
            </ContainerPane>

            <ContainerPane
              display="flex"
              // alignItems="center"
              // justifyContent="space-between"
              flexDirection="column"
              minHeight={140}
              // height={2}
            >
              <Pane display="flex" marginBottom={20}>
                <IconStatus status={proposalStatus} marginRight={8} />
                <Text color="#fff">{proposalStatus}</Text>
              </Pane>
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
                  {formatNumber(minDeposit * 10 ** -9)} GCYB MinDeposit
                </Text>
              </Pane>
            </ContainerPane>

            <ContainerPane>
              <Pane display="flex" marginBottom={25}>
                <Pane display="flex" alignItems="center" marginRight={15}>
                  <img
                    style={{ width: 20, marginRight: 5 }}
                    src={participation > quorum * 100 ? iconPieActive : iconPie}
                    alt="pie"
                  />
                  <Text color="#c7c7c7">
                    Participation {toFixedNumber(quorum * 100, 2)}%
                  </Text>
                </Pane>
                <Pane display="flex" alignItems="center" marginRight={15}>
                  <img
                    style={{ width: 20, marginRight: 5 }}
                    src={yes > threshold * 100 ? iconPieActive : iconPie}
                    alt="pie"
                  />
                  <Text color="#c7c7c7">
                    Yes {toFixedNumber(threshold * 100, 2)}%
                  </Text>
                </Pane>
                <Pane display="flex" alignItems="center" marginRight={15}>
                  <img
                    style={{ width: 20, marginRight: 5 }}
                    src={noWithVeto > veto * 100 ? iconPieActive : iconPie}
                    alt="pie"
                  />
                  <Text color="#c7c7c7">
                    NoWithVeto {toFixedNumber(veto * 100, 2)}%
                  </Text>
                </Pane>
              </Pane>
              <Pane
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Pane display="flex" flexDirection="column">
                  <Text
                    whiteSpace="nowrap"
                    color="#fff"
                    marginX={5}
                    marginY={5}
                  >{`Yes: ${toFixedNumber(yes, 2)}%`}</Text>
                  <Text
                    whiteSpace="nowrap"
                    color="#fff"
                    marginX={5}
                    marginY={5}
                  >{`No: ${toFixedNumber(no, 2)}%`}</Text>
                </Pane>
                <Votes finalVotes={tally} />
                <Pane display="flex" flexDirection="column">
                  <Text
                    whiteSpace="nowrap"
                    color="#fff"
                    marginX={5}
                    marginY={5}
                  >{`Abstain: ${toFixedNumber(abstain, 2)}%`}</Text>
                  <Text
                    whiteSpace="nowrap"
                    color="#fff"
                    marginX={5}
                    marginY={5}
                  >{`NoWithVeto: ${toFixedNumber(noWithVeto, 2)}%`}</Text>
                </Pane>
              </Pane>
            </ContainerPane>
          </Pane>
          <Pane
            display="flex"
            height={70}
            alignItems="center"
            paddingLeft={20}
            justifyContent="space-between"
          >
            <Text fontSize="18px" color="#fff">
              Voters
            </Text>
            <Pane display="flex">
              <Legend
                color="#3ab793"
                marginRight={20}
                text={`Yes: ${votes.yes}`}
              />
              <Legend
                color="#ccdcff"
                marginRight={20}
                text={`Abstain: ${votes.abstain}`}
              />
              <Legend
                color="#ffcf65"
                marginRight={20}
                text={`No: ${votes.no}`}
              />
              <Legend
                color="#fe8a8a"
                text={`NoWithVeto: ${votes.noWithVeto}`}
              />
            </Pane>
          </Pane>
          <ContainerPane></ContainerPane>
        </Pane>
      </main>
    );
  }
}

export default ProposalsDetail;
