import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Text, Pane, Tab } from '@cybercongress/gravity';
import {
  getAmountATOM,
  getValidatorsInfo,
  getValidators,
  getCurrentNetworkLoad,
} from '../../utils/search/utils';
import { CardStatisics, Loading, LinkWindow } from '../../components';
import { cybWon, getDisciplinesAllocation } from '../../utils/fundingMath';
import TableDiscipline from './table';
import {
  getDelegator,
  exponentialToDecimal,
  formatNumber,
} from '../../utils/utils';
import ActionBarContainer from './actionBarContainer';

import { COSMOS, TAKEOFF } from '../../utils/config';

class GOL extends React.Component {
  ws = new WebSocket(COSMOS.GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      addressLedger: null,
      validatorAddress: null,
      consensusAddress: null,
      loading: true,
      won: 0,
      takeoffDonations: 0,
      herosCount: 0,
      dataTable: [],
      addAddress: false,
      currentNetworkLoad: 0,
    };
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    // this.getMyGOLs();
    this.checkCurrentNetworkLoad();
    this.getValidatorsCount();
    this.getDataWS();
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
    let consensusAddress = null;
    let validatorAddress = null;

    const localStorageStory = await localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      const dataValidatorAddress = getDelegator(address.bech32, 'cybervaloper');
      const dataGetValidatorsInfo = await getValidatorsInfo(
        dataValidatorAddress
      );

      if (dataGetValidatorsInfo !== null) {
        consensusAddress = dataGetValidatorsInfo.consensus_pubkey;
        validatorAddress = dataValidatorAddress;
      }

      this.setState({
        addressLedger: address,
        validatorAddress,
        consensusAddress,
        addAddress: false,
      });
    } else {
      this.setState({
        addAddress: true,
        loading: false,
      });
    }
  };

  checkCurrentNetworkLoad = async () => {
    let currentNetworkLoad = 0;
    const dataCurrentNetworkLoad = await getCurrentNetworkLoad();
    if (dataCurrentNetworkLoad !== null) {
      currentNetworkLoad = parseFloat(dataCurrentNetworkLoad.load) * 100;
    }
    this.setState({
      currentNetworkLoad,
    });
  };

  getValidatorsCount = async () => {
    const data = await getValidators();
    let herosCount = 0;
    if (data !== null) {
      herosCount = data.length;
    }
    this.setState({
      herosCount,
    });
  };

  getAtom = async dataTxs => {
    let amount = 0;
    let won = 0;
    let allocation = 0;
    let currentPrize = 0;

    if (dataTxs) {
      amount = await getAmountATOM(dataTxs);
    }

    won = cybWon(amount);
    allocation = getDisciplinesAllocation(amount);

    currentPrize = won + allocation;

    this.setState({
      takeoffDonations: amount,
      currentPrize,
      won,
      loading: false,
    });
  };

  render() {
    const {
      loading,
      takeoffDonations,
      won,
      dataTable,
      addressLedger,
      validatorAddress,
      herosCount,
      consensusAddress,
      addAddress,
      currentNetworkLoad,
    } = this.state;

    const {
      load,
      takeoff,
      relevance,
      delegation,
      lifetime,
      euler4Rewards,
    } = this.props;

    console.log('dataTable', dataTable);
    console.log('validatorAddress', validatorAddress);

    console.log(
      'load, takeoff, relevance, delegation, lifetime, euler4Rewards',
      load,
      takeoff,
      relevance,
      delegation,
      lifetime,
      euler4Rewards
    );

    console.log(
      'total',
      load + takeoff + relevance + delegation + lifetime + euler4Rewards
    );

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
              Looking back, important things feels obvious.
              It takes phenomenal talent and incredible will to see them from afar.
              Those who can, define the future.
              Founders
            </Text>
            <Text fontSize="16px" color="#fff">
              Welcome to the intergalactic tournament - Game of Links. GoL - is
              the main preparation before{' '}
              <Link to="/search/genesis">the main network launch</Link> of{' '}
              <LinkWindow to="https://ipfs.io/ipfs/QmceNpj6HfS81PcCaQXrFMQf7LR5FTLkdG9sbSRNy3UXoZ">
                the cyber protocol
              </LinkWindow>
              . Main goal of the tournament is to collectively bootstrap{' '}
              <Link to="/brain">Superintelligence</Link>. Everyone can find
              themselves in this fascinating process: we need to setup physical
              infrastructure, upload initial knowledge, and create a reserve for
              sustaining the project during infancy. Athletes must solve
              different parts of the puzzle and could win up to 10% of CYB in
              the Genesis. Read full rules of the tournament{' '}
              <LinkWindow to="https://cybercongress.ai/game-of-links/">
                in the organizator&apos;s blog
              </LinkWindow>
              .
            </Text>
          </Pane>
          <Pane
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
            gridGap="20px"
            width="100%"
            marginY={50}
            alignItems="center"
          >
            {/* <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title="Total"
              value={`${formatNumber(total)} CYB`}
            /> */}
            <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title="Network load"
              value={`${formatNumber(currentNetworkLoad, 2)} %`}
            />
            <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title="Donation goal"
              value={`${formatNumber(
                (takeoffDonations / TAKEOFF.ATOMsALL) * 100,
                2
              )} %`}
            />
            <CardStatisics
              styleContainer={{ minWidth: '100px' }}
              styleValue={{ fontSize: '18px', color: '#3ab793' }}
              styleTitle={{ fontSize: '16px', color: '#3ab793' }}
              title="Validator set"
              value={`${formatNumber((herosCount / 146) * 100, 2)} %`}
            />
          </Pane>
          <Pane
            display="flex"
            marginTop={20}
            marginBottom={50}
            justifyContent="center"
          >
            <TableDiscipline
              addressLedger={addressLedger}
              validatorAddress={validatorAddress}
              consensusAddress={consensusAddress}
              won={won}
              takeoffDonations={takeoffDonations}
            />
          </Pane>
        </main>
        <ActionBarContainer
          addAddress={addAddress}
          cleatState={this.cleatState}
          updateFunc={this.checkAddressLocalStorage}
        />
      </div>
    );
  }
}

const mapStateToProps = store => {
  return {
    load: store.gol.load,
    takeoff: store.gol.takeoff,
    relevance: store.gol.relevance,
    delegation: store.gol.delegation,
    lifetime: store.gol.lifetime,
    euler4Rewards: store.gol.euler4Rewards,
  };
};

export default connect(mapStateToProps)(GOL);
