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
import { getGraphQLQuery } from '../../utils/search/utils';
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
      return arr.filter((x) => !unique.some((y) => x[key] === y[key]));
    })
  );

const GET_TX = `
query txs {
  takeoff {
    a_cybs
    cumsum
    cybs
    donates
    donors
    price
    timestamps
  }
}`;

const FINISH_ESTIMATION = 12141.224;

class Funding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      groups: [],
      amount: TAKEOFF.FINISH_AMOUNT,
      pocketAdd: null,
      dataTxs: null,
      atomLeff: 0,
      pin: false,
      currentPrice: TAKEOFF.FINISH_PRICE,
      currentPriceEstimation: 0,
      dataPlot: [],
      dataRewards: [],
      loader: true,
      loading: 0,
      estimation: FINISH_ESTIMATION,
      popapAdress: false,
      selected: 'manifest',
      block: 0,
      time: 'end',
    };
  }

  async componentDidMount() {
    this.chekPathname();
    await this.getTxsCosmos();
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

  getTxsCosmos = async () => {
    const { takeoff } = await getGraphQLQuery(GET_TX);
    console.log(`txs`, takeoff);
    if (takeoff && takeoff.length > 0) {
      this.setState({
        dataTxs: takeoff,
      });
      this.init();
    }
  };

  init = async () => {
    const { defaultAccount } = this.props;
    const { account } = defaultAccount;

    if (
      account !== null &&
      Object.prototype.hasOwnProperty.call(account, 'cosmos')
    ) {
      this.setState({ pocketAdd: { ...account.cosmos } });
    }

    // await this.getStatistics();
    this.getTableData();
    this.getData();
  };

  getTableData = async () => {
    const { dataTxs, amount } = this.state;
    try {
      const table = [];
      for (let item = 0; item < dataTxs.length; item++) {
        let estimation = 0;
        let price = 0;
        let estimationEUL = 0;

        const val = Number.parseFloat(dataTxs[item].donates);
        estimation = dataTxs[item].cybs;
        price = dataTxs[item].price;
        estimationEUL =
          ((val / amount) * TAKEOFF_SUPPLY) / CYBER.DIVISOR_CYBER_G;
        const d = dataTxs[item].timestamps;
        table.push({
          from: dataTxs[item].donors,
          price,
          timestamp: dateFormat(d, 'dd/mm/yyyy, HH:MM:ss'),
          amount: val,
          estimation,
          estimationEUL,
        });
      }

      const groupsAddress = getGroupAddress(table);
      // localStorage.setItem(`groups`, JSON.stringify(groups));
      console.log('groups', groupsAddress);

      this.setState({
        groups: groupsAddress,
        loader: false,
      });
      this.checkPin();
    } catch (error) {
      console.log(`error`, error);
      throw new Error();
    }
  };

  checkPin = async () => {
    const { pocketAdd, groups } = this.state;
    let pin = false;
    if (pocketAdd !== null) {
      if (groups[pocketAdd.bech32]) {
        groups[pocketAdd.bech32].pin = true;
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

  select = (selected) => {
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

    // if (loader) {
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
    //       <div style={{ color: '#fff', marginTop: 20, fontSize: 20 }}>
    //         Recieving transactions
    //       </div>
    //     </div>
    //   );
    // }

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
          time={time}
        />
      </span>
    );
  }
}

const mapStateToProps = (store) => {
  return {
    mobile: store.settings.mobile,
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Funding);
