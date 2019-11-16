import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
// import { formatNumber } from '../../utils/search/utils';
import proposalsIdJson from './proposalsId';
import proposerJson from './proposer';
// import { getProposals } from '../../utils/governance';

const dateFormat = require('dateformat');

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

const ContainerPane = ({ children, ...props }) => (
  <Pane {...props} paddingX={20} paddingY={20} boxShadow="0 0 3px 0px #3ab793">
    {children}
  </Pane>
);

const Item = ({ title, value, ...props }) => (
  <Pane {...props} display="flex">
    <Text minWidth="150px" color="#fff" fontSize="16px">
      {title}:{' '}
    </Text>
    <Text color="#fff" fontSize="16px">
      {value}
    </Text>
  </Pane>
);

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
        totalDeposit: '',
      },
      proposalStatus: '',
      tally: {
        yes: '',
        abstain: '',
        no: '',
        noWithVeto: '',
      },
      votes: {},
    };
  }

  componentDidMount() {
    this.getId();
    this.getProposalsInfo();
  }

  getId = () => {
    const { match } = this.props;
    const proposalId = match.params.proposal_id;
    this.setState({
      id: proposalId,
    });
  };

  getProposalsInfo = () => {
    const proposals = proposalsIdJson[0].result;
    const proposer = proposerJson[0].result;
    const proposalsInfo = {};

    proposalsInfo.title = proposals.content.value.title;
    proposalsInfo.type = proposals.content.type;
    proposalsInfo.description = proposals.content.value.description;
    proposalsInfo.proposer = proposer.proposer;

    this.setState({
      proposalsInfo,
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
      proposals,
      proposalsInfo,
      time,
      proposalStatus,
      tally,
      votes,
      id,
    } = this.state;

    return (
      <main className="block-body-home">
        <Pane paddingBottom={50}>
          <Pane height={70} display="flex" alignItems="center">
            <Text paddingLeft={20} fontSize="18px" color="#fff">
              #{id} {proposalsInfo.title}
            </Text>
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
            gridTemplateRows="1fr 1fr"
            gridTemplateColumns="1fr 1fr"
            gridGap={20}
          >
            <ContainerPane>
              <Item
                marginBottom={15}
                title="Submit Time"
                value={this.getSubStr(proposalsInfo.type)}
              />
              <Item
                marginBottom={15}
                title="Deposit Endtime"
                value={proposalsInfo.description}
              />
              <Item
                marginBottom={15}
                title="Total Deposit"
                value={proposalsInfo.description}
              />
              <Item
                marginBottom={15}
                title="Voting Starttime"
                value={proposalsInfo.description}
              />
              <Item title="Voting Endtime" value={proposalsInfo.description} />
            </ContainerPane>

            <ContainerPane>
              <Item
                marginBottom={15}
                title="Status"
                value={this.getSubStr(proposalsInfo.type)}
              />
              <Item
                marginBottom={15}
                title="Yes"
                value={proposalsInfo.description}
              />
              <Item
                marginBottom={15}
                title="No"
                value={proposalsInfo.description}
              />
              <Item
                marginBottom={15}
                title="NoWithVeto"
                value={proposalsInfo.description}
              />
              <Item title="Abstain" value={proposalsInfo.description} />
            </ContainerPane>

            <ContainerPane>
              <Item
                marginBottom={15}
                title="Type"
                value={this.getSubStr(proposalsInfo.type)}
              />
              <Item title="Description" value={proposalsInfo.description} />
            </ContainerPane>

            <ContainerPane>
              <Item
                marginBottom={15}
                title="Type"
                value={this.getSubStr(proposalsInfo.type)}
              />
              <Item title="Description" value={proposalsInfo.description} />
            </ContainerPane>
          </Pane>
        </Pane>
      </main>
    );
  }
}

export default ProposalsDetail;
