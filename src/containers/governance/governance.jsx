import React from 'react';
import { Pane, Text, TableEv as Table } from '@cybercongress/gravity';
import { FormatNumber } from '../../components/index';
import withWeb3 from '../../components/web3/withWeb3';
// import { formatNumber } from '../../utils/search/utils';

const toFixedNumber = (number, toFixed) => {
  return Math.floor(number * 10 ** toFixed) / 10 ** toFixed;
};

const table = [
  {
    ID: '1',
    Title: 'test',
    Type: 'SoftwareUpgrade',
    Status: 'Passed',
    Submit_Time: '2019/09/26 05:58:36+UTC',
    Deposit_Endtime: '2019/09/26 05:58:36+UTC',
    Voting_Endtime: '2019/09/26 05:58:36+UTC',
  },
  {
    ID: '2',
    Title: 'test',
    Type: 'Parameter',
    Status: 'Rejected',
    Submit_Time: '2019/09/26 05:58:36+UTC',
    Deposit_Endtime: '2019/09/26 05:58:36+UTC',
    Voting_Endtime: '2019/09/26 05:58:36+UTC',
  },
];

class Governance extends React.Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     table: [],
  //   };
  // }

  render() {
    // const { table } = this.state;
    const rowsTable = table.map(item => (
      <Table.Row
        borderBottom="none"
        paddingLeft={20}
        height={50}
        isSelectable
        key={item.ID}
      >
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.ID}
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.Title}
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.Type}
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.Status}
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.Submit_Time}
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.Deposit_Endtime}
          </Text>
        </Table.TextCell>
        <Table.TextCell>
          <Text color="#fff" fontSize="17px">
            {item.Voting_Endtime}
          </Text>
        </Table.TextCell>
      </Table.Row>
    ));

    return (
      <main className="block-body-home">
        <Pane
          height="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-around"
        >
          <Table width="100%">
            <Table.Head
              style={{
                backgroundColor: '#000',
                borderBottom: '1px solid #ffffff80',
              }}
              paddingLeft={20}
            >
              <Table.TextHeaderCell>
                <Text color="#fff" fontSize="17px">
                  Address
                </Text>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                <Text color="#fff" fontSize="17px">
                  Amount
                </Text>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                <Text color="#fff" fontSize="17px">
                  Token
                </Text>
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                <Text color="#fff" fontSize="17px">
                  Keys
                </Text>
              </Table.TextHeaderCell>
            </Table.Head>
            <Table.Body
              style={{ backgroundColor: '#000', overflowY: 'hidden' }}
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
