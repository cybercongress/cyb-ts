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
import { CosmosDelegateTool } from '../../utils/ledger';
import withWeb3 from '../../components/web3/withWeb3';
import BandwidthBar from './BandwidthBar';
import {
  formatNumber,
  getStatistics,
  getValidators,
  statusNode,
} from '../../utils/search/utils';
import { roundNumber, asyncForEach } from '../../utils/utils';
import {
  CardStatisics,
  ConnectLadger,
  Loading,
  FormatNumber,
} from '../../components';

import { i18n } from '../../i18n/en';

import { CYBER, LEDGER, AUCTION } from '../../utils/config';

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
    paddingX={50}
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

class ChainStatistic extends React.Component {
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
      main: false,
      graph: false,
      cybernomicsEUL: true,
      consensus: false,
      bandwidth: false,
      cybernomicsGOL: false,
      loading: true,
      chainId: '',
      amount: 0,
      averagePrice: 0,
      capETH: 0,
    };
  }

  componentWillMount() {
    this.getStatisticsBrain();
  }

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    this.getPriceGol();
  }

  componentDidUpdate() {
    const {
      ledger,
      stage,
      returnCode,
      addressLedger,
      addressInfo,
    } = this.state;

    if (stage === STAGE_LEDGER_INIT) {
      if (ledger === null) {
        this.pollLedger();
      }
      if (ledger !== null) {
        switch (returnCode) {
          case LEDGER_OK:
            if (addressLedger === null) {
              this.getAddress();
            }
            if (addressLedger !== null && addressInfo === null) {
              this.getAddressInfo();
            }
            break;
          default:
            console.log('getVersion');
            this.getVersion();
            break;
        }
      } else {
        // eslint-disable-next-line
        console.warn('Still looking for a Ledger device.');
      }
    }
  }

  getPriceGol = async () => {
    const {
      contract: { methods },
      contractAuctionUtils,
    } = this.props;

    // const roundThis = parseInt(await methods.today().call());
    const createPerDay = await methods.createPerDay().call();
    const createFirstDay = await methods.createFirstDay().call();

    const dailyTotalsUtils = await contractAuctionUtils.methods
      .dailyTotals()
      .call();
    console.log(dailyTotalsUtils.length);
    let summCurrentPrice = 0;

    await asyncForEach(
      Array.from(Array(dailyTotalsUtils.length).keys()),
      async item => {
        let createOnDay;
        if (item === 0) {
          createOnDay = createFirstDay;
        } else {
          createOnDay = createPerDay;
        }

        const currentPrice =
          dailyTotalsUtils[item] / (createOnDay * Math.pow(10, 9));

        summCurrentPrice += currentPrice;
      }
    );
    const averagePrice = summCurrentPrice / dailyTotalsUtils.length;
    const capETH = averagePrice * AUCTION.GOL;

    console.log('averagePrice', averagePrice);
    console.log('capETH', capETH);
    this.setState({
      averagePrice,
      capETH,
    });
  };

  compareVersion = async () => {
    const test = this.state.ledgerVersion;
    const target = LEDGER_VERSION_REQ;
    const testInt = 10000 * test[0] + 100 * test[1] + test[2];
    const targetInt = 10000 * target[0] + 100 * target[1] + target[2];
    return testInt >= targetInt;
  };

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

  pollLedger = async () => {
    const transport = await TransportU2F.create();
    this.setState({ ledger: new CosmosDelegateTool(transport) });
  };

  getVersion = async () => {
    const { ledger, returnCode } = this.state;
    try {
      const connect = await ledger.connect();
      if (returnCode === null || connect.return_code !== returnCode) {
        this.setState({
          address: null,
          returnCode: connect.return_code,
          ledgerVersion: [connect.major, connect.minor, connect.patch],
          errorMessage: null,
        });
        // eslint-disable-next-line

        console.warn('Ledger app return_code', this.state.returnCode);
      } else {
        this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
      }
    } catch ({ message, statusCode }) {
      // eslint-disable-next-line
      // eslint-disable-next-line
      console.error('Problem with Ledger communication', message, statusCode);
    }
  };

  getAddress = async () => {
    try {
      const { ledger } = this.state;

      const addressLedger = await ledger.retrieveAddressCyber(HDPATH);

      console.log('address', addressLedger);

      this.setState({
        addressLedger,
      });

      localStorage.setItem('ledger', JSON.stringify(addressLedger));
    } catch (error) {
      const { message, statusCode } = error;
      if (message !== "Cannot read property 'length' of undefined") {
        // this just means we haven't found the device yet...
        // eslint-disable-next-line
        console.error('Problem reading address data', message, statusCode);
      }
      this.setState({ time: Date.now() }); // cause componentWillUpdate to call again.
    }
  };

  getAddressInfo = async () => {
    const { addressLedger } = this.state;
    const table = [];
    const addressInfo = {
      address: '',
      amount: '',
      token: '',
      keys: '',
    };
    const response = await fetch(
      `${CYBER_NODE_URL}/api/account?address="${addressLedger.bech32}"`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    );
    const data = await response.json();

    console.log('data', data);

    addressInfo.address = addressLedger.bech32;
    addressInfo.amount = data.result.account.coins[0].amount;
    addressInfo.token = data.result.account.coins[0].denom;
    addressInfo.keys = 'ledger';

    this.setState({
      stage: STAGE_READY,
      addAddress: false,
      loading: false,
      addressInfo,
      amount: data.result.account.coins[0].amount,
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

  getMain = () =>
    this.setState({
      main: true,
      graph: false,
      cybernomicsEUL: false,
      consensus: false,
      bandwidth: false,
      cybernomicsGOL: false,
    });

  getGraph = () =>
    this.setState({
      main: false,
      graph: true,
      cybernomicsEUL: false,
      consensus: false,
      bandwidth: false,
      cybernomicsGOL: false,
    });

  getCybernomicsEUL = () =>
    this.setState({
      main: false,
      graph: false,
      cybernomicsEUL: true,
      consensus: false,
      bandwidth: false,
      cybernomicsGOL: false,
    });

  getConsensus = () =>
    this.setState({
      main: false,
      graph: false,
      cybernomicsEUL: false,
      consensus: true,
      bandwidth: false,
      cybernomicsGOL: false,
    });

  getBandwidth = () =>
    this.setState({
      main: false,
      graph: false,
      cybernomicsEUL: false,
      consensus: false,
      bandwidth: true,
      cybernomicsGOL: false,
    });

  getCybernomicsGOL = () =>
    this.setState({
      main: false,
      graph: false,
      cybernomicsEUL: false,
      consensus: false,
      bandwidth: false,
      cybernomicsGOL: true,
    });

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
      main,
      graph,
      cybernomicsEUL,
      consensus,
      bandwidth,
      cybernomicsGOL,
      stage,
      returnCode,
      ledgerVersion,
      addAddress,
      amount,
      loading,
      chainId,
      averagePrice,
      capETH,
    } = this.state;

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
        <CardStatisics title={T.brain.cap} value={formatNumber(cidsCount)} />
        <a
          href="/#/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            title={T.brain.heroes}
            value={activeValidatorsCount}
            icon={<Icon icon="arrow-right" color="#4caf50" marginLeft={5} />}
          />
        </a>
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

    const CybernomicsEUL = () => (
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
          value={formatNumber(cidsCount)}
        />
        <CardStatisics title={T.brain.capATOM} value={activeValidatorsCount} />
      </Pane>
    );

    const Consensus = () => (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <a
          href="/#/heroes"
          style={{
            display: 'contents',
            textDecoration: 'none',
          }}
        >
          <CardStatisics
            title={T.brain.heroes}
            value={activeValidatorsCount}
            icon={<Icon icon="arrow-right" color="#4caf50" marginLeft={5} />}
          />
        </a>
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
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics title={T.brain.price} value={linkPrice} />
        <CardStatisics title={T.brain.available} value={stakedCyb} />
        <CardStatisics title={T.brain.load} value={formatNumber(txCount)} />
      </Pane>
    );

    const CybernomicsGOL = () => (
      <Pane
        display="grid"
        gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
        gridGap="20px"
      >
        <CardStatisics title={T.brain.supplyGOL} value={AUCTION.GOL} />
        <CardStatisics
          title={T.brain.auctionPrice}
          value={
            <FormatNumber
              fontSizeDecimal={18}
              number={roundNumber(averagePrice, 6)}
            />
          }
        />
        <CardStatisics title={T.brain.capETH} value={formatNumber(capETH)} />
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

    return (
      <div>
        <main
          style={{ justifyContent: 'space-between' }}
          className="block-body"
        >
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
                tournament in universe: Game of Links.
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
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gridGap="20px"
            marginTop={25}
          >
            <TabBtn
              text="Main"
              isSelected={main}
              onSelect={() => this.getMain()}
            />
            <TabBtn
              text="Knowledge graph"
              isSelected={graph}
              onSelect={() => this.getGraph()}
            />
            <TabBtn
              text="Cybernomics of EUL"
              isSelected={cybernomicsEUL}
              onSelect={() => this.getCybernomicsEUL()}
            />
            <TabBtn
              text="Consensus"
              isSelected={consensus}
              onSelect={() => this.getConsensus()}
            />
            <TabBtn
              text="Bandwidth"
              isSelected={bandwidth}
              onSelect={() => this.getBandwidth()}
            />
            <TabBtn
              text="Cybernomics of GOL"
              isSelected={cybernomicsGOL}
              onSelect={() => this.getCybernomicsGOL()}
            />
          </Tablist>
          <Pane marginTop={50} marginBottom={50}>
            {main && <Main />}
            {graph && <KnowledgeGraph />}
            {cybernomicsEUL && <CybernomicsEUL />}
            {consensus && <Consensus />}
            {bandwidth && <Bandwidth />}
            {cybernomicsGOL && <CybernomicsGOL />}
          </Pane>
        </main>
        <ActionBar>
          <Pane>
            {addAddress && (
              <Button onClick={() => this.onClickGetAddressLedger()}>
                {T.actionBar.pocket.put}
              </Button>
            )}
            {!addAddress && (
              <Text color="#fff" fontSize="18px">
                Take gift or Teleport to Game of Links
              </Text>
            )}
          </Pane>
        </ActionBar>
      </div>
    );
  }
}

export default withWeb3(ChainStatistic);
