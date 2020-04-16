import React, { PureComponent } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import withWeb3 from '../../components/web3/withWeb3';
import { ContainerCard } from '../../components';
import ActionBarContainer from './actionBar';
import Statistics from './statistics';
import VitalikJae from './vitalikJae';
import {
  asyncForEach,
  formatNumber,
  roundNumber,
  run,
} from '../../utils/utils';
import { getTxCosmos } from '../../utils/search/utils';
import { COSMOS, AUCTION } from '../../utils/config';

const BigNumber = require('bignumber.js');

// const abiDecoder = require('abi-decoder');

const { GAIA_WEBSOCKET_URL } = COSMOS;

const currenciesUrl =
  'https://api.coingecko.com/api/v3/simple/price?ids=cosmos&vs_currencies=eth';

class Got extends PureComponent {
  controller = new AbortController();

  ws = new WebSocket(GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      ATOMsRaised: 0,
      ETHRaised: 0,
      colAtomEth: {
        atom: 0,
        eth: 0,
      },
      dataTxs: null,
      difference: {},
      arow: 0,
      loading: true,
      raised: null,
    };
  }

  async componentDidMount() {
    const { web3 } = this.props;
    this.connect();
    // const tx = [];
    // web3.eth
    //   .getPastLogs({
    //     fromBlock: '0x0',
    //     address: AUCTION.ADDR_SMART_CONTRACT,
    //   })
    //   .then(res => {
    //     res.forEach(rec => {
    //       if (rec.topics[0] === AUCTION.TOPICS_SEND) {
    //         // console.log(decodedData);
    //         tx.push(rec);
    //       }
    //       // console.log(rec.topics);
    //     });
    //   })
    //   .catch(err => console.log('getPastLogs failed', err));
    // console.log('tx', tx);
    // const decodedData = abiDecoder.decodeMethod(
    //   '0x000000000000000000000000000000000000000000000000000000000000003a0000000000000000000000007a596c2d3e0f390a212a8ed47308cf621b5e949c0000000000000000000000000000000000000000000000000de0b6b3a7640000'
    // );
    // console.log('decodedData', decodedData);
    const subscription = web3.eth.subscribe(
      'logs',
      {
        address: AUCTION.ADDR_SMART_CONTRACT,
        topics: [
          '0xe054057d0479c6218d6ec87be73f88230a7e4e1f064cee6e7504e2c4cd9d6150',
        ],
      },
      (error, result) => {
        if (!error) {
          this.getEthAtomCourse();
          console.log(result);
        }
      }
    );

    subscription.unsubscribe((error, success) => {
      if (success) {
        console.log('Successfully unsubscribed!');
      }
    });
  }

  componentWillUnmount() {
    this.controller.abort();
    // unsubscribes the subscription
  }

  connect = async () => {
    await this.getTxsCosmos();
    this.getEthAtomCourse();
    this.setState({
      loading: false,
    });
  };

  getTxsCosmos = async () => {
    const dataTx = await getTxCosmos();
    if (dataTx !== null) {
      this.setState({
        dataTxs: dataTx.txs,
      });
    }
  };

  getEthAtomCourse = async () => {
    const {
      contract: { methods },
    } = this.props;
    // if(this.state.loading){
    const dailyTotals = await methods.dailyTotals(0).call();
    let ETHRaised = 0;
    let ATOMsRaised = 0;

    ETHRaised = Math.floor((dailyTotals / Math.pow(10, 18)) * 1000) / 1000;

    await asyncForEach(
      Array.from(Array(this.state.dataTxs.length).keys()),
      async item => {
        ATOMsRaised +=
          Number.parseInt(
            this.state.dataTxs[item].tx.value.msg[0].value.amount[0].amount
          ) / COSMOS.DIVISOR_ATOM;
      }
    );

    // const response = await fetch(url, {
    //   signal: this.controller.signal
    // });
    // const data = await response.json();
    //  console.log(this.state.dataTxs);
    const currencies = await fetch(currenciesUrl, {
      signal: this.controller.signal,
    });
    const course = await currencies.json();
    const raised = {
      ATOMsRaised,
      ETHRaised,
      course,
    };
    // console.log(raised);
    this.setState({
      raised,
    });
    // return raised;
    await this.getStatistics();
    this.getArbitrage();
    // }
  };

  getStatistics = async () => {
    const { raised } = this.state;
    console.log(raised);
    this.setState({
      ETHRaised: raised.ETHRaised,
      ATOMsRaised: raised.ATOMsRaised,
    });
  };

  getArbitrage = () => {
    const { raised } = this.state;
    let ethRaised = 0;
    let AtomRaised = 0;
    let ethCYB = 0;
    let atomsCYB = 0;
    let difference = {};
    const arow = 0;
    let win = '';
    // debugger;s
    const cyb = 10 ** 5;
    ethCYB = roundNumber(raised.ETHRaised / cyb, 7);
    atomsCYB = roundNumber(
      (raised.ATOMsRaised / cyb) * raised.course.cosmos.eth,
      10
    );
    console.log('atomsCYB', atomsCYB);
    ethRaised = roundNumber(raised.ETHRaised, 7);
    AtomRaised = roundNumber(raised.ATOMsRaised * raised.course.cosmos.eth, 10);
    const sumAtomEth = ethRaised + AtomRaised;
    const tempAtom = (AtomRaised / sumAtomEth) * 100;
    const tempETH = (ethRaised / sumAtomEth) * 100;
    const colAtomEth = {
      atom: tempAtom,
      eth: tempETH,
    };
    if (ethRaised > AtomRaised) {
      // arow = -1 * (1 - AtomRaised / ethRaised) * 90;
      win = 'eth';
      difference = {
        popups: 'atom',
        diff: ethCYB / atomsCYB,
      };
    } else {
      // arow = (1 - ethRaised / AtomRaised) * 90;
      win = 'atom';
      difference = {
        popups: 'eth',
        diff: atomsCYB / ethCYB,
      };
    }
    console.log('colAtomEth, difference', colAtomEth, difference);
    this.setState({
      win,
      colAtomEth,
      difference,
    });
  };

  render() {
    const {
      ATOMsRaised,
      ETHRaised,
      difference,
      arow,
      win,
      colAtomEth,
    } = this.state;

    const cyb = 10 * Math.pow(10, 4);
    return (
      <span>
        <main className="block-body">
          <Pane
            boxShadow="0px 0px 5px #36d6ae"
            paddingX={20}
            paddingY={20}
            marginY={20}
          >
            <Text fontSize="16px" color="#fff">
              You do not have control over the brain. You need EUL tokens to let
              she hear you. If you came from Ethereum or Cosmos you can claim
              the gift of gods. Then start prepare to the greatest tournament in
              universe: <a href="/gol">Game of Links</a>.
            </Text>
          </Pane>
          {/* <span className="caption">Game of Thrones</span> */}
          <Statistics
            firstLeftTitle="ETH/GOL"
            firstLeftValue={roundNumber(ETHRaised / cyb, 7)}
            secondLeftTitle="Raised, ETH"
            secondLeftValue={formatNumber(ETHRaised)}
            secondRightTitle="Raised, ATOMs"
            secondRightValue={formatNumber(ATOMsRaised)}
            firstRightTitle="ATOM/EUL"
            firstRightValue={roundNumber(ATOMsRaised / cyb, 9)}
          />
          <VitalikJae
            win={win}
            diff={difference}
            arow={arow}
            col={colAtomEth}
            difference={roundNumber(difference.diff, 2)}
          />
          <Pane display="grid" gridGap="20px" gridTemplateColumns="1fr 1fr">
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
                tournament in universe: <a href="/gol">Game of Links</a>.
              </Text>
            </Pane>
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
                tournament in universe: <a href="/gol">Game of Links</a>.
              </Text>
            </Pane>
          </Pane>
        </main>
        <ActionBarContainer
          web3={this.props.web3}
          contract={this.props.contract}
        />
      </span>
    );
  }
}

export default withWeb3(Got);
