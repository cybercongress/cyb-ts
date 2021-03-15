import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Text, Pane, TableEv as Table } from '@cybercongress/gravity';
import { useQuery, useSubscription } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import {
  getAmountATOM,
  getValidatorsInfo,
  getAllValidators,
  getPreCommits,
  getGraphQLQuery,
  getTxCosmos,
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
  fromBech32,
  exponentialToDecimal,
  asyncForEach,
  formatNumber,
  sort,
} from '../../../utils/utils';

import { COSMOS, TAKEOFF, DISTRIBUTION, CYBER } from '../../../utils/config';
import { getLifetime } from '../../../utils/game-monitors';

// const consensusAddress =
//   'cybervalconspub1zcjduepqmn3e2ls76zzp4dqje9474r04znfzzfp049az6rrvsk4h0fylzrrqq48tny';

const GET_CHARACTERS = `
  query MyQuery {
    pre_commit_view(order_by: {precommits: desc}, limit: 50, offset: 0) {
      consensus_pubkey
      precommits
    }
    pre_commit_view_aggregate {
      aggregate {
        sum {
          precommits
        }
      }
    }
  }
  `;

const QueryAddress = (address) =>
  ` query MyQuery {
    pre_commit_view(where: {consensus_pubkey: {_eq: "${address}"}}) {
      consensus_pubkey
      precommits
    }
  }`;

class GolLifetime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addressLedger: null,
      validatorAddress: null,
      consensusAddress: null,
      loadingAtom: true,
      loadingValidator: true,
      sumPrecommits: 0,
      currentPrize: 0,
      herosCount: 0,
      dataTable: [],
      total: 0,
    };
  }

  async componentDidMount() {
    const currentPrize = Math.floor(
      (DISTRIBUTION.lifetime / TAKEOFF.ATOMsALL) * TAKEOFF.FINISH_AMOUNT
    );

    this.setState({
      currentPrize,
    });
    this.getValidatorsCount();
  }

  getValidatorsCount = async () => {
    const { consensusAddress, dataTable } = this.state;

    const dataPreCommit = [];
    let sumPrecommits = 0;
    const dataValidators = await getAllValidators();

    if (consensusAddress !== null) {
      const dataQueryAddress = await getGraphQLQuery(
        QueryAddress(consensusAddress)
      );

      if (Object.keys(dataQueryAddress).length > 0) {
        dataQueryAddress.pre_commit_view[0].local = true;
        dataPreCommit.push(...dataQueryAddress.pre_commit_view);
      }
    }

    if (dataValidators !== null) {
      const dataGraphQL = await getGraphQLQuery(GET_CHARACTERS);

      if (Object.keys(dataGraphQL.pre_commit_view).length > 0) {
        dataPreCommit.push(...dataGraphQL.pre_commit_view);
        dataPreCommit.forEach((itemQ, index) => {
          dataValidators.forEach((itemRPC) => {
            if (itemQ.consensus_pubkey === itemRPC.consensus_pubkey) {
              dataPreCommit[index].moniker = itemRPC.description.moniker;
              dataPreCommit[index].operatorAddress = itemRPC.operator_address;
            }
          });
        });
      }
      if (Object.keys(dataGraphQL.pre_commit_view_aggregate).length > 0) {
        sumPrecommits =
          dataGraphQL.pre_commit_view_aggregate.aggregate.sum.precommits;
      }
    }

    this.setState({
      sumPrecommits,
      dataTable: dataTable.concat(dataPreCommit),
      loadingAtom: false,
    });
  };

  render() {
    const {
      loading,
      dataTable,
      sumPrecommits,
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

    if (loadingAtom) {
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

    const content = dataTable.map((item, index) => {
      let lifeTime = 0;
      let cybWonAbsolute = 0;
      let share = 0;
      if (sumPrecommits > 0) {
        lifeTime = parseFloat(item.precommits) / parseFloat(sumPrecommits);
        cybWonAbsolute = lifeTime * currentPrize;
        share = (item.precommits / sumPrecommits) * 100;
      }
      if (item.moniker) {
        return (
          <Table.Row
            paddingX={0}
            paddingY={5}
            borderBottom={item.local ? '1px solid #3ab793bf' : 'none'}
            display="flex"
            minHeight="48px"
            height="fit-content"
            key={(item.operatorAddress, index)}
          >
            <Table.TextCell>
              <TextTable>
                <Link to={`/network/euler/hero/${item.operatorAddress}`}>
                  {item.moniker}
                </Link>
              </TextTable>
            </Table.TextCell>
            <Table.TextCell flex={0.5} textAlign="end">
              <TextTable>{formatNumber(item.precommits)}</TextTable>
            </Table.TextCell>
            <Table.TextCell flex={0.5} textAlign="end">
              <TextTable>
                {exponentialToDecimal(share.toPrecision(2))} %
              </TextTable>
            </Table.TextCell>
            <Table.TextCell flex={0.5} textAlign="end">
              <TextTable>{formatNumber(Math.floor(cybWonAbsolute))}</TextTable>
            </Table.TextCell>
          </Table.Row>
        );
      }
    });

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
              <LinkWindow to="https://cybercongress.ai/docs/cyberd/run_validator/">
                Setup you validator
              </LinkWindow>{' '}
              and get rewards for precommit counts!
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
                  <TextTable>Precommits</TextTable>
                </Table.TextHeaderCell>
                <Table.TextHeaderCell flex={0.5} textAlign="center">
                  <TextTable>Share</TextTable>
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
