import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Text, Pane, TableEv as Table } from '@cybercongress/gravity';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  getAmountATOM,
  getValidatorsInfo,
  getValidators,
  getPreCommits,
} from '../../../utils/search/utils';
import {
  CardStatisics,
  Loading,
  LinkWindow,
  TextTable,
} from '../../../components';
import { cybWon, getDisciplinesAllocation } from '../../../utils/fundingMath';
import TableDiscipline from '../table';
import {
  getDelegator,
  exponentialToDecimal,
  asyncForEach,
  sort,
} from '../../../utils/utils';

import { COSMOS, TAKEOFF, DISTRIBUTION, CYBER } from '../../../utils/config';
import { getLifetime } from '../../../utils/game-monitors';

const consensusAddress =
  'cybervalconspub1zcjduepqmn3e2ls76zzp4dqje9474r04znfzzfp049az6rrvsk4h0fylzrrqq48tny';

class GolLifetime extends React.Component {
  ws = new WebSocket(COSMOS.GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      addressLedger: null,
      validatorAddress: null,
      loadingAtom: false,
      loadingValidator: true,
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
    await this.checkAddressLocalStorage();
    await this.getDataWS();
    // this.getMyGOLs();
    await this.getValidatorsCount();
  }

  getDataWS = async () => {
    this.ws.onopen = () => {
      console.log('connected');
    };

    this.ws.onmessage = async evt => {
      const message = JSON.parse(evt.data);
      console.log('txs', message);
      this.getAtom(message);
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  checkAddressLocalStorage = async () => {
    let address = [];

    const localStorageStory = await localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      const validatorAddress = getDelegator(address.bech32, 'cybervaloper');

      this.setState({
        addressLedger: address,
        validatorAddress,
        addAddress: false,
      });
    } else {
      this.setState({
        addAddress: true,
        loading: true,
      });
    }
  };

  getValidatorsCount = async () => {
    // const { validatorAddress } = this.state;
    const validatorAddress =
      'cybervaloper12psudf4rpaw4jwhuyx3y8sejhsynae7ggdsu2p';
    const dataTable = [];
    let total = 0;
    const data = await getValidators();
    let herosCount = 0;
    if (data !== null) {
      asyncForEach(Array.from(Array(data.length).keys()), async item => {
        total += parseFloat(data[item].tokens);
        let addressStorage = false;
        let preCommits = 0;
        let share = 0;
        if (validatorAddress === data[item].operator_address) {
          addressStorage = true;
        }
        const dataPreCommits = await getPreCommits(data[item].consensus_pubkey);
        if (dataPreCommits !== null) {
          const dataLifetime = await getLifetime({
            block: dataPreCommits.pre_commit_aggregate.aggregate.count,
            preCommit:
              dataPreCommits.validator[0].pre_commits_aggregate.aggregate.count,
          });
          share = dataLifetime;
          preCommits =
            dataPreCommits.validator[0].pre_commits_aggregate.aggregate.count;
        }
        dataTable.push({
          operatorAddress: data[item].operator_address,
          moniker: data[item].description.moniker,
          addressStorage,
          preCommits,
          share,
        });
        this.setState({
          dataTable,
        });
      });
      herosCount = data.length;
    }
    sort(dataTable, 'preCommits');
    sort(dataTable, 'addressStorage');
  };

  getAtom = async dataTxs => {
    let amount = 0;
    let won = 0;

    if (dataTxs) {
      amount = getAmountATOM(dataTxs);
    }

    won = cybWon(amount);

    const currentPrize = Math.floor(
      (won / DISTRIBUTION.takeoff) * DISTRIBUTION.delegation
    );

    this.setState({
      won,
      loadingAtom: true,
      currentPrize,
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
      loadingValidator,
      loadingAtom,
    } = this.state;
    const { load } = this.props;

    console.log('dataTable', dataTable);
    console.log('validatorAddress', validatorAddress);

    // if (loadingAtom) {
    //   return (
    //     <div
    //       style={{
    //         width: '100%',
    //         height: '50vh',
    //         display: 'flex',
    //         justifyContent: 'center',
    //         alignItems: 'center',
    //         flexDirection: 'column',
    //       }}
    //     >
    //       <Loading />
    //     </div>
    //   );
    // }

    const content = dataTable.map(item => (
      <Table.Row
        paddingX={0}
        paddingY={5}
        borderBottom={item.addressStorage ? '1px solid #3ab79340' : 'none'}
        display="flex"
        minHeight="48px"
        height="fit-content"
        key={item.operatorAddress}
      >
        <Table.TextCell>
          <TextTable>{item.moniker}</TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <TextTable>{item.preCommits}</TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <TextTable>{item.share}</TextTable>
        </Table.TextCell>
        <Table.TextCell textAlign="end">
          <TextTable>{Math.floor(item.share * currentPrize)}</TextTable>
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
              Setup you validator and get rewards for precommit counts!
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

export default GolLifetime;
