import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Text, Pane, Dialog, Tablist } from '@cybercongress/gravity';
import { Link, Switch, Route, Router } from 'react-router-dom';
import QRCode from 'qrcode.react';
import Dinamics from './dinamics';
import Statistics from './statistics';
import Table from './table';
import ActionBarTakeOff from './actionBar';
import {
  asyncForEach,
  formatNumber,
  trimString,
  getTimeRemaining,
} from '../../utils/utils';
import { Loading, LinkWindow, Copy, TabBtn } from '../../components';
import {
  COSMOS,
  TAKEOFF,
  TAKEOFF_SUPPLY,
  GENESIS_SUPPLY,
  CYBER,
} from '../../utils/config';
import {
  cybWon,
  funcDiscount,
  getEstimation,
  getDataPlot,
  getRewards,
  getGroupAddress,
  funcDiscountRevers,
} from '../../utils/fundingMath';
import { getTxCosmos } from '../../utils/search/utils';
import PopapAddress from './popap';
import Details from './details';
import Quotes from './quotes';

const dateFormat = require('dateformat');

const { ATOMsALL } = TAKEOFF;
const { GAIA_WEBSOCKET_URL } = COSMOS;

const diff = (key, ...arrays) =>
  [].concat(
    ...arrays.map((arr, i) => {
      const others = arrays.slice(0);
      others.splice(i, 1);
      const unique = [...new Set([].concat(...others))];
      return arr.filter(x => !unique.some(y => x[key] === y[key]));
    })
  );

const test = {
  'tx.hash': [
    '1320F2C5F9022E21533BAB4F3E1938AD7C9CA493657C98E7435A44AA2850636B',
  ],
  'tx.height': ['1489670'],
  'transfer.recipient': ['cosmos1809vlaew5u5p24tvmse9kvgytwwr3ej7vd7kgq'],
  'transfer.amount': ['310000000000uatom'],
  'message.sender': ['cosmos1gw5kdey7fs9wdh05w66s0h4s24tjdvtcxlwll7'],
  'message.module': ['bank'],
  'message.action': ['send'],
  'tm.event': ['Tx'],
};

class Funding extends PureComponent {
  ws = new WebSocket(GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      amount: 0,
      pocketAdd: null,
      dataTxs: null,
      atomLeff: 0,
      pin: false,
      currentPrice: 0,
      currentPriceEstimation: 0,
      dataPlot: [],
      dataRewards: [],
      loader: true,
      loading: 0,
      estimation: 0,
      popapAdress: false,
      selected: 'manifest',
      block: 0,
    };
  }

  async componentDidMount() {
    this.chekPathname();
    // this.getBlockWS();
    await this.getDataWS();
    await this.getTxsCosmos();
    this.initClock();
  }

  componentDidUpdate(prevProps) {
    const { location } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      this.chekPathname();
    }
  }

  chekPathname = () => {
    const { location } = this.props;
    const { pathname } = location;

    if (
      pathname.match(/progress/gm) &&
      pathname.match(/progress/gm).length > 0
    ) {
      this.select('progress');
    } else if (
      pathname.match(/leaderboard/gm) &&
      pathname.match(/leaderboard/gm).length > 0
    ) {
      this.select('leaderboard');
    } else {
      this.select('manifest');
    }
  };

  initClock = () => {
    try {
      const deadline = `${COSMOS.TIME_END}`;
      const startTime = Date.parse(deadline) - Date.parse(new Date());
      if (startTime <= 0) {
        this.setState({
          time: 'end',
        });
      } else {
        this.initializeClock(deadline);
      }
    } catch (error) {
      this.setState({
        time: '∞',
      });
    }
  };

  initializeClock = endtime => {
    let timeinterval;
    const updateClock = () => {
      const t = getTimeRemaining(endtime);
      if (t.total <= 0) {
        clearInterval(timeinterval);
        this.setState({
          time: 'end',
        });
        return true;
      }
      const hours = `0${t.hours}`.slice(-2);
      const minutes = `0${t.minutes}`.slice(-2);
      this.setState({
        time: `${t.days}d:${hours}h:${minutes}m`,
      });
    };

    updateClock();
    timeinterval = setInterval(updateClock, 10000);
  };

  getTxsCosmos = async () => {
    const dataTx = await getTxCosmos();
    if (dataTx !== null) {
      this.setState({
        dataTxs: dataTx.txs,
      });
      this.init(dataTx);
    }
  };

  getDataWS = async () => {
    this.ws.onopen = () => {
      console.log('connected Funding');
      this.ws.send(
        JSON.stringify({
          jsonrpc: '2.0',
          method: 'subscribe',
          id: '0',
          params: {
            query: `tm.event='Tx' AND transfer.recipient='${COSMOS.ADDR_FUNDING}' AND message.action='send'`,
          },
        })
      );
    };

    this.ws.onmessage = async evt => {
      const message = JSON.parse(evt.data);
      if (message.id.indexOf('0#event') !== -1) {
        this.updateWs(message.result.events);
        console.warn('txs', message);
      }
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  updateWs = async data => {
    let amount = 0;
    const amountWebSocket = data['transfer.amount'][0];

    if (amountWebSocket.indexOf('uatom') !== -1) {
      const positionDenom = amountWebSocket.indexOf('uatom');
      const str = amountWebSocket.slice(0, positionDenom);
      amount = parseFloat(str) / COSMOS.DIVISOR_ATOM;
    }
    const d = new Date();
    const timestamp = dateFormat(d, 'dd/mm/yyyy, HH:MM:ss');
    const dataTxs = {
      amount,
      txhash: data['tx.hash'][0],
      height: data['tx.height'][0],
      timestamp,
      sender: data['message.sender'][0],
    };
    const pocketAddLocal = localStorage.getItem('pocket');
    if (pocketAddLocal !== null) {
      const pocketAdd = JSON.parse(pocketAddLocal);
      this.setState({ pocketAdd });
    }
    this.getStatisticsWs(dataTxs.amount);
    await this.getTableData();
    await this.getTableDataWs(dataTxs);
    this.getData();
  };

  init = async txs => {
    console.log(txs);
    const pocketAddLocal = localStorage.getItem('pocket');
    const pocketAdd = JSON.parse(pocketAddLocal);
    this.setState({ pocketAdd });
    await this.getStatistics(txs);
    this.getTableData();
    this.getData();
  };

  getStatisticsWs = async amountWebSocket => {
    const { amount } = this.state;
    let amountWs = 0;

    amountWs = amount + amountWebSocket;

    if (amountWs >= ATOMsALL) {
      amountWs = ATOMsALL;
    }

    this.setState({
      amount: amountWs,
    });
  };

  getTableDataWs = async dataTxs => {
    const { currentPriceEstimation, estimation, amount, groups } = this.state;
    try {
      console.log(estimation);
      console.log(dataTxs);

      const dataWs = dataTxs;
      const tempData = [];
      let estimationEUL = 0;
      let estimationCyb = 0;
      let price = 0;
      if (amount <= ATOMsALL) {
        let tempVal = dataTxs.amount;
        if (tempVal >= ATOMsALL) {
          tempVal = ATOMsALL;
        }
        console.log(tempVal);
        estimationCyb = getEstimation(estimation / 1000, tempVal);
        estimationEUL = (tempVal / amount) * TAKEOFF_SUPPLY;
        price = tempVal / estimationCyb / 1000;
        dataWs.cybEstimation = Math.floor(estimationCyb * 10 ** 12);
        dataWs.estimationEUL = estimationEUL;
        dataWs.price = price;
        groups[dataWs.sender].address = [
          dataWs,
          ...groups[dataWs.sender].address,
        ];
        groups[dataWs.sender].height = dataWs.height;
        groups[dataWs.sender].amountСolumn += dataWs.amount;
        groups[dataWs.sender].cyb += Math.floor(estimationCyb * 10 ** 12);
        groups[dataWs.sender].eul += estimationEUL;
      }
      // const groupsAddress = getGroupAddress(table);
      // localStorage.setItem(`groups`, JSON.stringify(groups));
      const temE = estimationCyb * 1000 + estimation;
      console.log('estimationCyb', estimationCyb);
      const currentPrice = (40 * (temE / 1000) + 1000) / 1000;
      console.log(temE);
      console.log(currentPrice);
      this.setState({
        groups,
        estimation: temE,
        currentPrice,
      });
    } catch (error) {
      console.log(error);
      throw new Error();
    }
  };

  getStatistics = async data => {
    const dataTxs = data.txs;
    console.log('dataTxs', dataTxs);
    // const statisticsLocalStorage = JSON.parse(
    //   localStorage.getItem('statistics')
    // );

    let amount = 0;
    for (let item = 0; item < dataTxs.length; item++) {
      if (amount <= ATOMsALL) {
        amount +=
          Number.parseInt(
            dataTxs[item].tx.value.msg[0].value.amount[0].amount,
            10
          ) / COSMOS.DIVISOR_ATOM;
      } else {
        amount = ATOMsALL;
        break;
      }
    }
    console.log('amount', amount);
    this.setState({
      amount,
    });
  };

  getTableData = async () => {
    const { dataTxs, amount } = this.state;
    try {
      const table = [];
      const temp = 0;
      let temE = 0;
      for (let item = 0; item < dataTxs.length; item++) {
        let estimation = 0;
        let price = 0;
        let estimationEUL = 0;
        if (temp <= ATOMsALL) {
          const val =
            Number.parseInt(
              dataTxs[item].tx.value.msg[0].value.amount[0].amount,
              10
            ) / COSMOS.DIVISOR_ATOM;
          estimation = getEstimation(temE, val);
          price = val / estimation / 1000;
          estimationEUL = (val / amount) * TAKEOFF_SUPPLY;
          temE += estimation;
        } else {
          break;
        }
        const d = new Date(dataTxs[item].timestamp);
        table.push({
          txhash: dataTxs[item].txhash,
          height: dataTxs[item].height,
          from: dataTxs[item].tx.value.msg[0].value.from_address,
          price,
          timestamp: dateFormat(d, 'dd/mm/yyyy, HH:MM:ss'),
          amount:
            Number.parseInt(
              dataTxs[item].tx.value.msg[0].value.amount[0].amount,
              10
            ) / COSMOS.DIVISOR_ATOM,
          estimation: estimation * 10 ** 12,
          estimationEUL,
        });
      }

      const groupsAddress = getGroupAddress(table);
      // localStorage.setItem(`groups`, JSON.stringify(groups));
      console.log('groups', groupsAddress);

      const currentPrice = (40 * temE + 1000) / 1000;
      console.log(temE);
      this.setState({
        groups: groupsAddress,
        estimation: temE * 1000,
        currentPrice,
        loader: false,
      });
      this.checkPin();
    } catch (error) {
      throw new Error();
    }
  };

  checkPin = async () => {
    const { pocketAdd, groups } = this.state;
    let pin = false;
    if (pocketAdd !== null) {
      if (groups[pocketAdd.cosmos.bech32]) {
        groups[pocketAdd.cosmos.bech32].pin = true;
        pin = true;
      }
      this.setState({
        groups,
        pin,
      });
    }
  };

  getData = async () => {
    const { estimation } = this.state;
    let dataPlot = [];
    dataPlot = getDataPlot(estimation);
    console.log(dataPlot);

    // localStorage.setItem(`dataPlot`, JSON.stringify(dataPlot));
    this.setState({
      dataPlot,
    });
  };

  onClickPopapAdress = () => {
    this.setState({
      popapAdress: false,
    });
  };

  onClickPopapAdressTrue = () => {
    this.setState({
      popapAdress: true,
    });
  };

  select = selected => {
    this.setState({ selected });
  };

  render() {
    const {
      groups,
      atomLeff,
      currentPrice,
      dataPlot,
      dataAllPin,
      dataRewards,
      pin,
      loader,
      popapAdress,
      time,
      selected,
      estimation,
      amount,
    } = this.state;
    const { mobile } = this.props;
    let content;

    if (loader) {
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
          <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
            Recieving transactions
          </div>
        </div>
      );
    }

    if (selected === 'progress') {
      content = (
        <Dinamics
          mobile={mobile}
          cap={40 * estimation + 1000000}
          data3d={dataPlot}
        />
      );
    }

    if (selected === 'leaderboard') {
      content = <Table mobile={mobile} data={groups} pin={pin} />;
    }

    if (selected === 'manifest') {
      content = <Details />;
    }

    return (
      <span>
        {popapAdress && (
          <PopapAddress
            address={COSMOS.ADDR_FUNDING}
            onClickPopapAdress={this.onClickPopapAdress}
          />
        )}

        <main className="block-body takeoff">
          <Quotes />
          {!pin && (
            <Pane
              boxShadow="0px 0px 5px #36d6ae"
              paddingX={20}
              paddingY={20}
              marginTop={5}
              marginBottom={20}
            >
              <Text fontSize="16px" color="#fff">
                Takeoff is the key element during the{' '}
                <Link to="/gol">Game of Links</Link> on the path for deploying
                Superintelligence. Please, thoroughly study details before
                donating. But remember - the more you wait, the higher the
                price.
              </Text>
            </Pane>
          )}
          {pin && (
            <Table
              styles={{ marginBottom: 20, marginTop: 0 }}
              data={groups}
              onlyPin
              pin={pin}
            />
          )}
          <Statistics
            atomLeff={100000 - estimation}
            time={time}
            price={currentPrice}
            discount={TAKEOFF.DISCOUNT_TILT_ANGLE}
            amount={amount}
          />
          <Tablist className="tab-list" marginY={20}>
            <TabBtn
              text="Leaderboard"
              isSelected={selected === 'leaderboard'}
              to="/gol/takeoff/leaderboard"
            />
            <TabBtn
              text="Manifest"
              isSelected={selected === 'manifest'}
              to="/gol/takeoff"
            />
            <TabBtn
              text="Progress"
              isSelected={selected === 'progress'}
              to="/gol/takeoff/progress"
            />
          </Tablist>
          {content}
        </main>
        <ActionBarTakeOff
          initClock={this.initClock}
          end={100000 - estimation}
          onClickPopapAdressTrue={this.onClickPopapAdressTrue}
          mobile={mobile}
        />
      </span>
    );
  }
}

const mapStateToProps = store => {
  return {
    mobile: store.settings.mobile,
  };
};

export default connect(mapStateToProps)(Funding);
