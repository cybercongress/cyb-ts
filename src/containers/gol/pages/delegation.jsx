import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Text, Pane, TableEv as Table } from '@cybercongress/gravity';
import {
  getAmountATOM,
  getValidatorsInfo,
  getAllValidators,
} from '../../../utils/search/utils';
import {
  CardStatisics,
  Loading,
  LinkWindow,
  TextTable,
} from '../../../components';
import { cybWon, getDisciplinesAllocation } from '../../../utils/fundingMath';
import TableDiscipline from '../table';
import { fromBech32, formatNumber, sort } from '../../../utils/utils';

import { COSMOS, TAKEOFF, DISTRIBUTION } from '../../../utils/config';

class GolDelegation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressLedger: null,
      validatorAddress: null,
      loading: true,
      won: 0,
      currentPrize: 0,
      takeoffDonations: 0,
      herosCount: 0,
      dataTable: [],
      total: 0,
      addAddress: false,
    };
  }

  async componentDidMount() {
    const currentPrize = Math.floor(
      (DISTRIBUTION.delegation / TAKEOFF.ATOMsALL) * TAKEOFF.FINISH_AMOUNT
    );

    this.setState({
      currentPrize,
    });
    await this.checkAddressLocalStorage();
    // this.getMyGOLs();
    this.getValidatorsCount();
  }

  checkAddressLocalStorage = async () => {
    let address = [];

    const localStorageStory = await localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      const validatorAddress = fromBech32(address.bech32, 'cybervaloper');

      this.setState({
        addressLedger: address,
        validatorAddress,
        addAddress: false,
      });
    } else {
      this.setState({
        addAddress: true,
        loading: false,
      });
    }
  };

  getValidatorsCount = async () => {
    const { validatorAddress } = this.state;
    const dataTable = [];
    let total = 0;
    let total2 = 0;
    const data = await getAllValidators();
    console.log('data', data);
    let herosCount = 0;
    if (data !== null) {
      data.forEach(item => {
        total += parseFloat(item.tokens);
        total2 += parseFloat(item.delegator_shares);

        let addressStorage = false;
        if (validatorAddress === item.operator_address) {
          addressStorage = true;
        }
        dataTable.push({
          operatorAddress: item.operator_address,
          moniker: item.description.moniker,
          tokens: item.tokens,
          addressStorage,
        });
      });
      herosCount = data.length;
    }

    sort(dataTable, 'tokens');
    sort(dataTable, 'addressStorage');
console.log(total, 'total2', total2);
    this.setState({
      dataTable,
      herosCount,
      total,
      loading: false,
    });
  };

  render() {
    const {
      loading,
      won,
      dataTable,
      total,
      addressLedger,
      validatorAddress,
      currentPrize,
      herosCount,
      consensusAddress,
    } = this.state;
    const { load } = this.props;

    console.log('dataTable', dataTable);
    console.log('validatorAddress', validatorAddress);

    if (loading) {
      return (
        <div
          style={{
            width: '100%',
            height: '50vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexDirection: 'column',
          }}
        >
          <Loading />
        </div>
      );
    }

    const content = dataTable.map(item => (
      <Table.Row
        paddingX={0}
        paddingY={5}
        borderBottom={item.addressStorage ? '1.5px solid #3ab79391' : 'none'}
        display="flex"
        minHeight="48px"
        height="fit-content"
        key={item.operatorAddress}
      >
        <Table.TextCell>
          <TextTable>
            <Link to={`/network/euler/hero/${item.operatorAddress}`}>
              {item.moniker}
            </Link>
          </TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <TextTable>{formatNumber(parseFloat(item.tokens))}</TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <TextTable>
            {formatNumber(Math.floor((item.tokens / total) * currentPrize))}
          </TextTable>
        </Table.TextCell>
      </Table.Row>
    ));

    return (
      <div>
        <main
          // style={{ justifyContent: 'space-between' }}
          className="block-body"
        >
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginY={20}
          >
            <Text fontSize="16px" color="#fff">
              Get more voting power for your validator - get more rewards! This
              disciplines is social discipline for heros with max prize of 5
              TCYB. Huge chunk of CYB stake allocated to all Ethereans and
              Cosmonauts. The more you spread, the more users will claim its
              allocation, the more voting power as validators you will have in
              Genesis. Details of reward calculation you can find in{' '}
              <LinkWindow to="https://cybercongress.ai/game-of-links/">
                Game of Links rules
              </LinkWindow>
            </Text>
          </Pane>
          <Pane
            display="flex"
            marginTop={20}
            marginBottom={50}
            justifyContent="center"
            flexDirection="column"
          >
            <Table>
              <Table.Head
                style={{
                  backgroundColor: '#000',
                  borderBottom: '1px solid #ffffff80',
                  marginTop: '10px',
                  padding: 7,
                  paddingBottom: '10px',
                }}
              >
                <Table.TextHeaderCell textAlign="center">
                  <TextTable>Address</TextTable>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={0.5} textAlign="center">
                  <TextTable>EULs delegated</TextTable>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={0.5} textAlign="center">
                  <TextTable>CYB won</TextTable>
                </Table.TextHeaderCell>
              </Table.Head>
              <Table.Body
                style={{
                  backgroundColor: '#000',
                  overflowY: 'hidden',
                  padding: 7,
                }}
              >
                {content}
              </Table.Body>
            </Table>
          </Pane>
        </main>
        {/* <ActionBarContainer
          addAddress={addAddress}
          cleatState={this.cleatState}
          updateFunc={this.checkAddressLocalStorage}
        /> */}
      </div>
    );
  }
}

export default GolDelegation;
