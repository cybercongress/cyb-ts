import React from 'react';
import { Pane, Text, TableEv as Table, Tooltip } from '@cybercongress/gravity';
import { Votes, Legend } from '../../components';

import proposals from './test';
// import { getProposals } from '../../utils/governance';

const dateFormat = require('dateformat');

class Governance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
    };

    this.routeChange = this.routeChange.bind(this);
  }

  async componentDidMount() {
    // const proposals = await getProposals();
    this.setState({
      table: proposals[0].result,
    });
  }

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
    finalVotes.no_with_veto = (noWithVeto / finalTotalVotes) * 100;
    return finalVotes;
  };

  render() {
    const { table } = this.state;
    // console.log('table', table.length);
    const rowsTable = table.reverse().map(item => (
      <Table.Row
        borderBottom="none"
        width="fit-content"
        paddingLeft={20}
        height={50}
        isSelectable
        onSelect={() => this.routeChange(`/governance/${item.id}`)}
        key={item.id}
      >
        <Table.TextCell flex="none" width={50}>
          <Text color="#fff">{item.id}</Text>
        </Table.TextCell>
        <Table.TextCell flex="none" width={150}>
          <Text color="#fff">{item.content.value.title}</Text>
        </Table.TextCell>
        <Table.TextCell flex="none" width={170}>
          <Text color="#fff">{item.content.type}</Text>
        </Table.TextCell>
        <Table.TextCell flex="none" width={150}>
          <Text color="#fff">{item.proposal_status}</Text>
          <Votes finalVotes={this.finalTallyResult(item.final_tally_result)} />
        </Table.TextCell>
        <Table.TextCell flex="none" width={200}>
          <Text color="#fff">
            {dateFormat(new Date(item.submit_time), 'dd/mm/yyyy, h:MM:ss TT')}
          </Text>
        </Table.TextCell>
        <Table.TextCell flex="none" width={200}>
          <Text color="#fff">
            {dateFormat(
              new Date(item.deposit_end_time),
              'dd/mm/yyyy, h:MM:ss TT'
            )}
          </Text>
        </Table.TextCell>
        <Table.TextCell flex="none" width={200}>
          <Text color="#fff" flexShrink={0} flexGrow={0}>
            {dateFormat(
              new Date(item.voting_start_time),
              'dd/mm/yyyy, h:MM:ss TT'
            )}
          </Text>
        </Table.TextCell>
        <Table.TextCell flex="none" width={200}>
          <Text color="#fff" flexShrink={0} flexGrow={0}>
            {dateFormat(
              new Date(item.voting_end_time),
              'dd/mm/yyyy, h:MM:ss TT'
            )}
          </Text>
        </Table.TextCell>
      </Table.Row>
    ));

    return (
      <main className="block-body-home">
        <Pane>
          <Pane
            height={70}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Text marginRight={50} marginLeft={20} color="#fff" fontSize="18px">
              {table.length} Proposals
            </Text>
            <Pane display="flex">
              <Legend color="#45b4ff" text="Yes" />
              <Legend color="#ccdcff" text="Abstain" marginLeft={50} />
              <Legend color="#ffcf65" text="No" marginLeft={50} />
              <Legend color="#fe8a8a" text="NoWithVeto" marginLeft={50} />
            </Pane>
          </Pane>
          <Pane
            // height="100%"
            display="flex"
            paddingBottom={50}
          >
            <Table overflowX="auto">
              <Table.Head
                width="fit-content"
                style={{
                  backgroundColor: '#000',
                  borderBottom: '1px solid #ffffff80',
                }}
                paddingLeft={20}
              >
                <Table.TextHeaderCell flex="none" width={50}>
                  <Text color="#fff" fontSize="17px">
                    ID
                  </Text>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex="none" width={150}>
                  <Text color="#fff" fontSize="17px">
                    Title
                  </Text>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex="none" width={170}>
                  <Text color="#fff" fontSize="17px">
                    Type
                  </Text>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex="none" width={150}>
                  <Text color="#fff" fontSize="17px">
                    Status
                  </Text>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex="none" width={200}>
                  <Text color="#fff" fontSize="17px">
                    Submit_Time
                  </Text>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex="none" width={200}>
                  <Text color="#fff" fontSize="17px">
                    Deposit_Endtime
                  </Text>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex="none" width={200}>
                  <Text color="#fff" fontSize="17px">
                    Voting_Starttime
                  </Text>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex="none" width={200}>
                  <Text color="#fff" fontSize="17px">
                    Voting_Endtime
                  </Text>
                </Table.TextHeaderCell>
              </Table.Head>
              <Table.Body
                width="fit-content"
                style={{ backgroundColor: '#000', overflow: 'hidden' }}
              >
                {rowsTable}
              </Table.Body>
            </Table>
          </Pane>
        </Pane>
      </main>
    );
  }
}

export default Governance;
