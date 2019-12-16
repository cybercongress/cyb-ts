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
import {
  formatNumber,
  getStatistics,
  getValidators,
  statusNode,
  getRelevance,
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

import { CYBER, LEDGER, AUCTION, COSMOS, TAKEOFF } from '../../utils/config';

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

class GOL extends React.Component {
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
      selected: 'disciplines',
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

  async componentDidMount() {
    await this.checkAddressLocalStorage();
    this.getPriceGol();
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

  getAmountATOM = dataTxs => {
    let amount = 0;
    let won = 0;
    let currentPrice = 0;

    for (let item = 0; item < dataTxs.length; item++) {
      if (amount <= TAKEOFF.ATOMsALL) {
        amount +=
          Number.parseInt(
            dataTxs[item].tx.value.msg[0].value.amount[0].amount
          ) *
          10 ** -1;
      } else {
        amount = TAKEOFF.ATOMsALL;
        break;
      }
    }

    won = cybWon(amount);
    currentPrice = won / amount;

    const supplyEUL = roundNumber(won / DIVISOR_CYBER_G, 3);
    const takeofPrice = roundNumber(currentPrice / DIVISOR_CYBER_G, 6);
    const capATOM = (won * currentPrice) / DIVISOR_CYBER_G;

    this.setState({
      supplyEUL,
      takeofPrice,
      capATOM,
    });
  };

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


    if (selected === 'delegation') {
      content = <Main />;
    }

    if (selected === 'load') {
      content = <Main />;
    }

    if (selected === 'relevance') {
      content = <Main />;
    }

    // if (selected === 'disciplines') {
    //   content = <KnowledgeGraph />;
    // }

    // if (selected === 'uptime') {
    //   content = <CybernomicsEUL />;
    // }

    // if (selected === 'FVS') {
    //   content = <Consensus />;
    // }

    // if (selected === 'euler4') {
    //   content = <Bandwidth />;
    // }

    // if (selected === 'communityPool') {
    //   content = <CybernomicsGOL />;
    // }

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
          <Tablist
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))"
            gridGap="20px"
            marginTop={25}
          >
            <TabBtn
              text="Delegation"
              isSelected={selected === 'delegation'}
              onSelect={() => this.select('delegation')}
            />
            <TabBtn
              text="Load"
              isSelected={selected === 'load'}
              onSelect={() => this.select('load')}
            />
            <TabBtn
              text="Relevance"
              isSelected={selected === 'relevance'}
              onSelect={() => this.select('relevance')}
            />
            <TabBtn
              text="Disciplines"
              isSelected={selected === 'disciplines'}
              onSelect={() => this.select('disciplines')}
            />
            <TabBtn
              text="Uptime"
              isSelected={selected === 'uptime'}
              onSelect={() => this.select('uptime')}
            />
            <TabBtn
              text="FVS"
              isSelected={selected === 'FVS'}
              onSelect={() => this.select('FVS')}
            />
            <TabBtn
              text="Euler-4"
              isSelected={selected === 'euler4'}
              onSelect={() => this.select('euler4')}
            />
            <TabBtn
              text="Community pool"
              isSelected={selected === 'communityPool'}
              onSelect={() => this.select('communityPool')}
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

export default withWeb3(GOL);
