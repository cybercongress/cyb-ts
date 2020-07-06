import React from 'react';
import { Pane, Text, TableEv as Table, Tooltip } from '@cybercongress/gravity';
import { Votes, Legend, IconStatus } from '../../components';
import ActionBar from './actionBar';

// import proposals from './test';
import { getProposals } from '../../utils/governance';

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
  return finalVotes;
};

const AcceptedCard = ({ id, name, votes, type, amount, timeEnd }) => (
  <Pane paddingX={10} paddingY={10}>
    <Pane>{type}</Pane>
    <Pane>
      {id} {name}
    </Pane>
    <Votes finalVotes={finalTallyResult(votes)} />
    <Pane>{amount}</Pane>
    <Pane>{timeEnd}</Pane>
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
      .map(item => <div>fgf</div>);

    const accepted = table
      .filter(item => item.proposal_status === 'Passed')
      .map(item => (
        <AcceptedCard
          id={item.id}
          name={item.content.value.title}
          votes={item.final_tally_result}
          type={item.content.type}
          amount={item.total_deposit[0].amount}
          timeEnd={dateFormat(
            new Date(item.voting_end_time),
            'dd/mm/yyyy, h:MM:ss TT'
          )}
        />
      ));

    const rejected = table
      .reverse()
      .filter(item => item.proposal_status === 'Rejected')
      .map(item => <Pane></Pane>);

    return (
      <div>
        <main className="block-body-home">
          <Pane>
            {accepted}
            {/* <Pane
              height={70}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text
                marginRight={50}
                marginLeft={20}
                color="#fff"
                fontSize="18px"
              >
                {table.length} Proposals
              </Text>
              <Pane display="flex">
                <Legend color="#3ab793" text="Yes" />
                <Legend color="#ccdcff" text="Abstain" marginLeft={50} />
                <Legend color="#ffcf65" text="No" marginLeft={50} />
                <Legend color="#fe8a8a" text="NoWithVeto" marginLeft={50} />
              </Pane>
            </Pane> */}
            <Pane
              // height="100%"
              display="flex"
              paddingBottom={50}
            ></Pane>
          </Pane>
        </main>
        <ActionBar update={this.init} />
      </div>
    );
  }
}

export default Governance;
