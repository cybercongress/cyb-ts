import React from 'react';
import {
  Text,
  Pane,
  Heading,
  CardHover,
  Icon,
  Tablist,
  Tab,
  Button,
  ActionBar,
} from '@cybercongress/gravity';
import LocalizedStrings from 'react-localization';
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { Link } from 'react-router-dom';
import { CosmosDelegateTool } from '../../utils/ledger';
import {
  formatNumber,
  getStatistics,
  getValidators,
  statusNode,
  getBalance,
  getTotalEUL,
  getAmountATOM,
} from '../../utils/search/utils';
import { roundNumber, asyncForEach } from '../../utils/utils';
import {
  CardStatisics,
  ConnectLadger,
  Loading,
  FormatNumber,
} from '../../components';
import { cybWon } from '../../utils/fundingMath';

import { i18n } from '../../i18n/en';

import {
  CYBER,
  LEDGER,
  AUCTION,
  COSMOS,
  TAKEOFF,
  GENESIS_SUPPLY,
  TOTAL_GOL_GENESIS_SUPPLY,
} from '../../utils/config';

import ActionBarContainer from './actionBarContainer';

const { CYBER_NODE_URL, DIVISOR_CYBER_G, DENOM_CYBER_G } = CYBER;

const {
  HDPATH,
  LEDGER_OK,
  LEDGER_NOAPP,
  STAGE_INIT,
  STAGE_LEDGER_INIT,
  STAGE_READY,
  LEDGER_VERSION_REQ,
} = LEDGER;

const T = new LocalizedStrings(i18n);

const TabBtn = ({ text, isSelected, onSelect }) => (
  <Tab
    key={text}
    isSelected={isSelected}
    onSelect={onSelect}
    paddingX={10}
    paddingY={20}
    marginX={3}
    borderRadius={4}
    color="#36d6ae"
    boxShadow="0px 0px 5px #36d6ae"
    fontSize="16px"
  >
    {text}
  </Tab>
);

class Brain extends React.Component {
  ws = new WebSocket(COSMOS.GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      stage: STAGE_INIT,
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      linksCount: 0,
      cidsCount: 0,
      accsCount: 0,
      txCount: 0,
      blockNumber: 0,
      linkPrice: 0,
      totalCyb: 0,
      stakedCyb: 0,
      activeValidatorsCount: 0,
      selected: 'main',
      loading: true,
      chainId: '',
      amount: 0,
      supplyEUL: 0,
      takeofPrice: 0,
      capATOM: 0,
      averagePrice: 0,
      capETH: 0,
    };
  }

  componentWillMount() {
    this.getStatisticsBrain();
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    // this.getPriceGol();
    this.getDataWS();
  }

  getDataWS = async () => {
    this.ws.onopen = () => {
      console.log('connected');
    };

    this.ws.onmessage = async evt => {
      const message = JSON.parse(evt.data);
      console.log('txs', message);
      this.getAmountATOM(message);
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  getAmountATOM = async dataTxs => {
    let amount = 0;
    let won = 0;
    let currentPrice = 0;

    if (dataTxs) {
      amount = await getAmountATOM(dataTxs);
    }

    console.log('amount', amount);

    won = cybWon(amount);
    if (amount === 0) {
      currentPrice = 0;
    } else {
      currentPrice = won / amount;
    }

    console.log('won', won);
    console.log('currentPrice', currentPrice);

    const supplyEUL = Math.floor(won);
    const takeofPrice = roundNumber(currentPrice / DIVISOR_CYBER_G, 6);
    const capATOM = (supplyEUL * takeofPrice) / DIVISOR_CYBER_G;
    console.log('capATOM', capATOM);

    this.setState({
      supplyEUL,
      takeofPrice,
      capATOM,
    });
  };

  // getPriceGol = async () => {
  //   const {
  //     contract: { methods },
  //     contractAuctionUtils,
  //   } = this.props;

  //   // const roundThis = parseInt(await methods.today().call());
  //   const createPerDay = await methods.createPerDay().call();
  //   const createFirstDay = await methods.createFirstDay().call();

  //   const dailyTotalsUtils = await contractAuctionUtils.methods
  //     .dailyTotals()
  //     .call();
  //   console.log(dailyTotalsUtils.length);
  //   let summCurrentPrice = 0;

  //   await asyncForEach(
  //     Array.from(Array(dailyTotalsUtils.length).keys()),
  //     async item => {
  //       let createOnDay;
  //       if (item === 0) {
  //         createOnDay = createFirstDay;
  //       } else {
  //         createOnDay = createPerDay;
  //       }

  //       const currentPrice =
  //         dailyTotalsUtils[item] / (createOnDay * Math.pow(10, 9));

  //       summCurrentPrice += currentPrice;
  //     }
  //   );
  //   const averagePrice = summCurrentPrice / dailyTotalsUtils.length;
  //   const capETH = (averagePrice * TOTAL_GOL_GENESIS_SUPPLY) / DIVISOR_CYBER_G;

  //   console.log('averagePrice', averagePrice);
  //   console.log('capETH', capETH);
  //   this.setState({
  //     averagePrice,
  //     capETH,
  //   });
  // };

  checkAddressLocalStorage = async () => {
    let address = [];

    const localStorageStory = await localStorage.getItem('ledger');
    if (localStorageStory !== null) {
      address = JSON.parse(localStorageStory);
      console.log('address', address);
      this.setState({ addressLedger: address });
      this.getAddressInfo();
    } else {
      this.setState({
        addAddress: true,
        loading: false,
      });
    }
  };

  getAddressInfo = async () => {
    const { addressLedger } = this.state;
    const addressInfo = {
      address: '',
      amount: '',
      token: '',
      keys: '',
    };
    let total = 0;

    const result = await getBalance(addressLedger.bech32);
    console.log('result', result);

    if (result) {
      total = getTotalEUL(result);
    }

    // const response = await fetch(
    //   `${CYBER_NODE_URL}/api/account?address="${addressLedger.bech32}"`,
    //   {
    //     method: 'GET',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //   }
    // );
    // const data = await response.json();

    // console.log('data', data);

    // addressInfo.address = addressLedger.bech32;
    // addressInfo.amount = data.result.account.coins[0].amount;
    // addressInfo.token = data.result.account.coins[0].denom;
    // addressInfo.keys = 'ledger';

    this.setState({
      stage: STAGE_READY,
      addAddress: false,
      loading: false,
      // addressInfo,
      amount: total,
    });
  };

  getAmount = async address => {
    try {
      const response = await fetch(
        `${CYBER_NODE_URL}/api/account?address="${address}"`,
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await response.json();
      return data.result;
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
      // this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    }
  };

  getStatisticsBrain = async () => {
    const statisticContainer = await getStatistics();
    const validatorsStatistic = await getValidators();
    const status = await statusNode();
    const {
      linksCount,
      cidsCount,
      accsCount,
      txCount,
      height,
      bandwidthPrice,
      bondedTokens,
      supplyTotal,
    } = statisticContainer;

    const activeValidatorsCount = validatorsStatistic;

    const chainId = status.node_info.network;

    const totalCyb = supplyTotal;
    const stakedCyb = Math.floor((bondedTokens / totalCyb) * 100 * 1000) / 1000;
    const linkPrice = (400 * +bandwidthPrice).toFixed(0);

    this.setState({
      linksCount,
      cidsCount,
      accsCount,
      txCount,
      blockNumber: height,
      linkPrice,
      totalCyb,
      stakedCyb,
      activeValidatorsCount: activeValidatorsCount.length,
      chainId,
    });
  };

  select = selected => {
    this.setState({ selected });
  };

  onClickGetAddressLedger = () => {
    this.setState({
      stage: STAGE_LEDGER_INIT,
    });
  };

  cleatState = () => {
    this.setState({
      stage: STAGE_INIT,
      ledger: null,
      returnCode: null,
      addressInfo: null,
      addressLedger: null,
      ledgerVersion: [0, 0, 0],
      loading: true,
    });
  };

  render() {
    const {
      linksCount,
      cidsCount,
      accsCount,
      txCount,
      blockNumber,
      linkPrice,
      totalCyb,
      stakedCyb,
      activeValidatorsCount,
      stage,
      returnCode,
      ledgerVersion,
      addAddress,
      amount,
      loading,
      chainId,
      averagePrice,
      capETH,
      supplyEUL,
      takeofPrice,
      capATOM,
      selected,
    } = this.state;

    let content;

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

    const Main = () => (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics
          title={T.brain.cyberlinks}
          value={formatNumber(linksCount)}
        />
        <CardStatisics
          title={T.brain.cap}
          value={formatNumber(Math.floor(capATOM * 1000) / 1000)}
        />
        <Link
          to="/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            title={T.brain.heroes}
            value={activeValidatorsCount}
            icon={<Icon icon="arrow-right" color="#4ed6ae" marginLeft={5} />}
          />
        </Link>
      </Pane>
    );

    const KnowledgeGraph = () => (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics
          title={T.brain.cyberlinks}
          value={formatNumber(linksCount)}
        />
        <CardStatisics
          title={T.brain.objects}
          value={formatNumber(cidsCount)}
        />

        <CardStatisics
          title={T.brain.subjects}
          value={formatNumber(accsCount)}
        />
      </Pane>
    );

    const Cybernomics = () => (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics
          title={T.brain.supplyEUL}
          value={formatNumber(totalCyb)}
        />
        <CardStatisics
          title={T.brain.takeofPrice}
          value={formatNumber(takeofPrice)}
        />
        <CardStatisics
          title={T.brain.cap}
          value={formatNumber(Math.floor(capATOM * 1000) / 1000)}
        />
        {/* <CardStatisics
          title={T.brain.supplyGOL}
          value={formatNumber(TOTAL_GOL_GENESIS_SUPPLY)}
        />
        <CardStatisics
          title={T.brain.auctionPrice}
          value={
            <FormatNumber
              fontSizeDecimal={18}
              number={roundNumber(averagePrice, 6)}
            />
          }
        />
        <CardStatisics
          title={T.brain.capETH}
          value={formatNumber(Math.floor(capETH))}
        /> */}
      </Pane>
    );

    const Consensus = () => (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <Link
          to="/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            title={T.brain.heroes}
            value={activeValidatorsCount}
            icon={<Icon icon="arrow-right" color="#4ed6ae" marginLeft={5} />}
          />
        </Link>
        <CardStatisics title={T.brain.staked} value={stakedCyb} />
        <CardStatisics
          title={T.brain.transactions}
          value={formatNumber(txCount)}
        />
      </Pane>
    );

    const Bandwidth = () => (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 250px))"
        gridGap="20px"
        justifyContent="center"
      >
        <CardStatisics title={T.brain.price} value={linkPrice} />
      </Pane>
    );

    if (stage === STAGE_LEDGER_INIT) {
      return (
        <ConnectLadger
          pin={returnCode >= LEDGER_NOAPP}
          app={returnCode === LEDGER_OK}
          onClickBtnCloce={this.cleatState}
          version={
            returnCode === LEDGER_OK &&
            this.compareVersion(ledgerVersion, LEDGER_VERSION_REQ)
          }
        />
      );
    }

    if (selected === 'main') {
      content = <Main />;
    }

    if (selected === 'graph') {
      content = <KnowledgeGraph />;
    }

    if (selected === 'cybernomics') {
      content = <Cybernomics />;
    }

    if (selected === 'consensus') {
      content = <Consensus />;
    }

    if (selected === 'bandwidth') {
      content = <Bandwidth />;
    }

    return (
      <div>
        <main className="block-body">
          {amount === 0 && (
            <Pane
              boxShadow="0px 0px 5px #36d6ae"
              paddingX={20}
              paddingY={20}
              marginY={20}
            >
              <Text fontSize="16px" color="#fff">
                You do not have control over the brain. You need EUL tokens to
                let she hear you. If you came from Ethereum or Cosmos you can
                claim the gift of gods. Then start prepare to the greatest
                tournament in universe: <a href="gol">Game of Links</a>.
              </Text>
            </Pane>
          )}

          {amount > 0 && (
            <Pane
              marginY={20}
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
              gridGap="20px"
            >
              <CardStatisics
                title={T.brain.yourTotal}
                value={formatNumber(Math.floor(amount))}
              />
              <CardStatisics
                title={T.brain.percentSupply}
                value={
                  <FormatNumber
                    fontSizeDecimal={18}
                    number={roundNumber((amount / totalCyb) * 100, 6)}
                  />
                }
              />
              <CardStatisics
                title={chainId}
                value={formatNumber(blockNumber)}
              />
            </Pane>
          )}
          <Tablist
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(100px, 1fr))"
            gridGap="20px"
            marginTop={25}
          >
            <TabBtn
              text="Knowledge"
              isSelected={selected === 'graph'}
              onSelect={() => this.select('graph')}
            />
            <TabBtn
              text="Cybernomics"
              isSelected={selected === 'cybernomics'}
              onSelect={() => this.select('cybernomics')}
            />
            <TabBtn
              text="Main"
              isSelected={selected === 'main'}
              onSelect={() => this.select('main')}
            />
            <TabBtn
              text="Consensus"
              isSelected={selected === 'consensus'}
              onSelect={() => this.select('consensus')}
            />
            <TabBtn
              text="Bandwidth"
              isSelected={selected === 'bandwidth'}
              onSelect={() => this.select('bandwidth')}
            />
          </Tablist>
          <Pane marginTop={50} marginBottom={50}>
            {content}
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

export default Brain;
