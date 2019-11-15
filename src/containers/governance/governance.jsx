import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { FormatNumber } from '../../components/index';
import withWeb3 from '../../components/web3/withWeb3';
// import { formatNumber } from '../../utils/search/utils';
// import proposals from './test';
import { getProposals } from '../../utils/governance';

const dateFormat = require('dateformat');

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

class Governance extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
    };
  }

  async componentDidMount() {
    const proposals = await getProposals();
    this.setState({
      table: proposals,
    });
  }

  render() {
    const { table } = this.state;
    console.log('table', table.length);
    const rowsTable = table.map(item => (
      <Table.Row
        borderBottom="none"
        width="fit-content"
        paddingLeft={20}
        height={50}
        isSelectable
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
          <Text color="#fff">{table.length} Proposals</Text>
        </Pane>
        <Pane
          // height="100%"
          display="flex"
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
      </main>
    );
  }
}

export default Governance;
