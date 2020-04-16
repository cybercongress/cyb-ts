import React, { PureComponent } from 'react';
import { Pane, Text } from '@cybercongress/gravity';
import { fromWei, toBN, toWei } from 'web3-utils';
import withWeb3 from '../../components/web3/withWeb3';
import { Statistics } from './statistics';
import ActionBarAuction from './actionBar';
import Dinamics from './dinamics';
import Table from './table';
import { Loading } from '../../components/index';
import {
  run,
  formatNumber,
  roundNumber,
  asyncForEach,
  timer,
  exponentialToDecimal,
} from '../../utils/utils';
import InfoPane from './infoPane';

import { AUCTION } from '../../utils/config';

const BigNumber = require('bignumber.js');
const dateFormat = require('dateformat');

const {
  ADDR_SMART_CONTRACT,
  TOKEN_NAME,
  TOPICS_SEND,
  TOPICS_CLAIM,
  ROUND_DURATION,
} = AUCTION;

export function roundCurrency(value, decimalDigits = 0) {
  return value
    .toFixed(decimalDigits)
    .replace(/(\.\d{0,})0+$/, '$1')
    .replace(/\.$/, '');
}

export function formatCurrency(value, decimalDigits = 0) {
  return roundCurrency(
    parseFloat(fromWei(value.toString(), 'ether')),
    decimalDigits
  );
}

class Auction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      table: [],
      accounts: null,
      roundThis: '',
      timeLeft: 0,
      currentPrice: 0,
      dailyTotals: 0,
      raised: 0,
      loading: true,
      numberOfDays: 0,
      claimedAll: false,
      createOnDay: 0,
      popupsBuy: false,
      roundTable: null,
      typeTime: 'start',
      startTimeTot: null,
      dynamics: {
        x: [],
        y: [],
        x1: [],
        y1: [],
      },
    };
  }

  async componentDidMount() {
    this.init();
    this.subscription();
    this.accountsChanged();
  }

  init = async () => {
    const {
      accounts,
      contract: { methods },
    } = this.props;
    await this.setState({
      accounts,
    });
    const roundThis = parseInt(await methods.today().call());
    const numberOfDays = await methods.numberOfDays().call();
    const openTime = await methods.openTime().call();
    let startTimeTot;
    let typeTime;

    if (new Date(openTime * 1000) > Date.now()) {
      typeTime = 'intro';
      startTimeTot = dateFormat(
        new Date(openTime * 1000),
        'dd/mm/yyyy hh:MM:ss tt'
      );
    } else if (roundThis > numberOfDays) {
      typeTime = 'end';
    } else {
      typeTime = 'start';
    }

    this.setState({
      typeTime,
      startTimeTot,
    });
    if (new Date(openTime * 1000) < Date.now()) {
      if (accounts === null || accounts === undefined) {
        console.log('no-accounts');
        this.getTimeEndRound();
        this.statistics();
        this.dinamics();
        this.getDataTable();
      } else {
        console.log('accounts');
        timer(this.getTimeEndRound);
        this.statistics();
        this.dinamics();
        this.getDataTable();
      }
    } else {
      this.setState({ loading: false });
    }
  };

  subscription = async () => {
    const { web3 } = this.props;
    const subscription = web3.eth.subscribe(
      'logs',
      {
        address: ADDR_SMART_CONTRACT,
        topics: [TOPICS_SEND],
      },
      (error, result) => {
        if (!error) {
          console.log(result);
          const day = Number.parseInt(result.topics[1]);
          console.log('day', day);
          this.getDataTableForRound(day);
          this.dinamics();
          this.statistics();
        }
      }
    );

    // unsubscribes the subscription
    subscription.unsubscribe((error, success) => {
      if (success) {
        console.log('Successfully unsubscribed!');
      }
    });

    const subscriptionClaim = web3.eth.subscribe(
      'logs',
      {
        address: ADDR_SMART_CONTRACT,
        topics: [TOPICS_CLAIM],
      },
      (error, result) => {
        if (!error) {
          console.log(result);
          run(this.getDataTable);
        }
      }
    );

    // unsubscribes the subscription
    subscriptionClaim.unsubscribe((error, success) => {
      if (success) {
        console.log('Successfully unsubscribed!');
      }
    });
  };

  accountsChanged = () => {
    window.ethereum.on('accountsChanged', async accountsChanged => {
      const defaultAccounts = accountsChanged[0];
      const tmpAccount = defaultAccounts;
      // console.log(tmpAccount);
      await this.setState({
        accounts: tmpAccount,
      });
      run(this.getDataTable);
    });
  };

  getTimeEndRound = async () => {
    const {
      contract: { methods },
    } = this.props;
    const today = parseInt(await methods.today().call());
    const time = await methods.time().call();
    const startTime = await methods.startTime().call();
    const times = parseFloat(
      today * ROUND_DURATION - (parseFloat(time) - parseFloat(startTime))
    );
    const hours = Math.floor(times / (60 * 60));
    const minutes = Math.floor((times / 60) % 60);

    const h = hours;
    const m = `0${minutes}`.slice(-2);
    const timeLeft = `${h}h : ${m}m`;
    this.setState({
      timeLeft,
    });
  };

  statistics = async () => {
    const {
      contract: { methods },
    } = this.props;
    const roundThis = parseInt(await methods.today().call());
    const numberOfDays = await methods.numberOfDays().call();
    const today = roundThis;
    const createOnDay = await methods.createOnDay(today).call();
    const dailyTotals = await methods.dailyTotals(today).call();

    const currentPrice = dailyTotals / (createOnDay * Math.pow(10, 9));

    return this.setState({
      roundThis,
      currentPrice,
      numberOfDays,
      dailyTotals: Math.floor((dailyTotals / Math.pow(10, 18)) * 10000) / 10000,
    });
  };

  dinamics = async () => {
    const {
      contract: { methods },
      contractAuctionUtils,
    } = this.props;
    const { roundThis } = this.state;
    let raised = 0;
    const dynamics = {
      x: [],
      y: [],
      x1: [],
      y1: [],
      time: [],
    };

    const startTime = await methods.startTime().call();
    const createPerDay = await methods.createPerDay().call();
    const createFirstDay = await methods.createFirstDay().call();

    const dailyTotalsUtils = await contractAuctionUtils.methods
      .dailyTotals()
      .call();

    if (roundThis === 0) {
      this.setState({
        createOnDay: createFirstDay,
      });
    } else {
      this.setState({
        createOnDay: createPerDay,
      });
    }
    await asyncForEach(
      Array.from(Array(dailyTotalsUtils.length).keys()),
      async item => {
        let createOnDay;
        if (item === 0) {
          createOnDay = createFirstDay;
        } else {
          createOnDay = createPerDay;
        }

        const currentPrice = roundNumber(
          dailyTotalsUtils[item] / (createOnDay * Math.pow(10, 9)),
          10
        );
        // TODO
        // if (item <= today) {
        const dt = dailyTotalsUtils[item];
        raised += parseFloat(dt) / Math.pow(10, 18);

        const _raised = parseFloat(dt) / Math.pow(10, 18);

        if (item === 0) {
          dynamics.x.push(
            item
            // new Date(startTime * 1000 + 1000 * 60 * 60).toShortFormat()
          );
          dynamics.y.push(_raised);
          dynamics.time.push(startTime * 1000 + 1000 * 60 * 60);

          dynamics.y1.push(
            item
            // new Date(startTime * 1000 + 1000 * 60 * 60).toShortFormat()
          );
          dynamics.x1.push(currentPrice);
        } else {
          const nextTime = dynamics.time[dynamics.time.length - 1];

          dynamics.x.push(
            item
            // new Date(nextTime + 1000 * 23 * 60 * 60).toShortFormat()
          );
          dynamics.y.push(_raised);

          dynamics.y1.push(
            item
            // new Date(nextTime + 1000 * 23 * 60 * 60).toShortFormat()
          );
          dynamics.x1.push(currentPrice);
        }
      }
    );

    this.setState({ dynamics, loading: false });
    this.setState({ raised });
  };

  even = element => element.claimed !== false;

  getDataTable = async () => {
    const {
      contract: { methods },
      contractAuctionUtils,
    } = this.props;
    const { accounts } = this.state;
    console.log('accounts', accounts);
    let userBuysAuctionUtils = null;
    let userClaims = null;
    const table = [];
    const roundThis = parseInt(await methods.today().call());
    const createPerDay = await methods.createPerDay().call();
    const createFirstDay = await methods.createFirstDay().call();
    const dailyTotalsUtils = await contractAuctionUtils.methods
      .dailyTotals()
      .call();

    if (accounts !== null && accounts !== undefined) {
      userClaims = await contractAuctionUtils.methods
        .userClaims(accounts)
        .call();
      userBuysAuctionUtils = await contractAuctionUtils.methods
        .userBuys(accounts)
        .call();
    }

    await asyncForEach(
      Array.from(Array(dailyTotalsUtils.length).keys()),
      async item => {
        let createOnDay;
        let userBuy = 0;
        if (item === 0) {
          createOnDay = createFirstDay;
          this.setState({
            createOnDay,
          });
        } else {
          createOnDay = createPerDay;
          this.setState({
            createOnDay,
          });
        }
        // if (item <= roundThis) {
        const currentPrice = roundNumber(
          dailyTotalsUtils[item] / (createOnDay * Math.pow(10, 9)),
          10
        );

        const distValue =
          Math.floor((createOnDay / Math.pow(10, 9)) * 100) / 100;
        const dailyValue =
          Math.floor((dailyTotalsUtils[item] / Math.pow(10, 18)) * 10000) /
          10000;
        if (accounts === null || accounts === undefined) {
          userBuy = 0;
        } else {
          userBuy = userBuysAuctionUtils[item] / Math.pow(10, 18);
        }
        let cyb;
        if (!userBuy || userClaims[item] === true) {
          cyb = 0;
        } else {
          cyb = (distValue / dailyValue) * userBuy;
        }
        let claimedItem;
        if (cyb === 0 || item >= roundThis) {
          claimedItem = false;
        } else {
          claimedItem = item;
        }

        table.push({
          period: item,
          dist: formatNumber(
            Math.floor((createOnDay / Math.pow(10, 9)) * 100) / 100,
            3
          ),
          total: formatNumber(
            Math.floor((dailyTotalsUtils[item] / Math.pow(10, 18)) * 10000) /
              10000,
            3
          ),
          price: formatNumber(currentPrice, 7),
          closing: (23 * (roundThis - item)) / 23,
          youETH: formatNumber(userBuy, 7),
          youCYB: formatNumber(Math.floor(cyb * 100) / 100, 3),
          claimed: claimedItem,
          // _youCYB.length ? _youCYB[0].returnValues.amount : '0'
        });
        // console.log('CR', {_createOnDay, _dailyTotals, today}, (_createOnDay/Math.pow(10,18)  +  _dailyTotals/2) /_dailyTotals);
        // }
      }
    );
    if (table.some(this.even)) {
      this.setState({
        claimedAll: true,
      });
    } else {
      this.setState({
        claimedAll: false,
      });
    }
    this.setState({ table });
  };

  getDataTableForRound = async round => {
    const {
      contract: { methods },
    } = this.props;
    const { accounts, table, dynamics } = this.state;
    const userBuys = await methods.userBuys(round, accounts).call();
    const dailyTotals = await methods.dailyTotals(round).call();
    const createPerDay = await methods.createPerDay().call();
    const createFirstDay = await methods.createFirstDay().call();
    let createOnDay;
    if (round === 0) {
      createOnDay = createFirstDay;
    } else {
      createOnDay = createPerDay;
    }
    const currentPrice = roundNumber(dailyTotals / (createOnDay * 10 ** 9), 10);
    const distValue = Math.floor(createOnDay * 10 ** -9 * 100) / 100;
    const dailyValue = Math.floor(dailyTotals * 10 ** -18 * 10000) / 10000;
    const userBuy = userBuys * 10 ** -18;
    let cyb;
    if (userBuys === '0') {
      cyb = 0;
    } else {
      cyb = (distValue / dailyValue) * userBuy;
    }
    const roundTable = {
      round,
      createPerDay: formatNumber(
        Math.floor(createOnDay * 10 ** -9 * 100) / 100,
        3
      ),
      dailyTotals: formatNumber(
        Math.floor(dailyTotals * 10 ** -18 * 10000) / 10000,
        3
      ),
      currentPrice: formatNumber(currentPrice, 7),
      userBuys: formatNumber(userBuys * 10 ** -18, 7),
      cyb: formatNumber(Math.floor(cyb * 100) / 100, 3),
    };
    table[round].dist = roundTable.createPerDay;
    table[round].total = roundTable.dailyTotals;
    table[round].price = roundTable.currentPrice;
    table[round].youCYB = roundTable.cyb;
    table[round].youETH = roundTable.userBuys;
    dynamics.y[round] = parseFloat(roundTable.dailyTotals);
    dynamics.x1[round] = parseFloat(roundTable.currentPrice);
    this.setState({
      table,
      dynamics,
    });
  };

  render() {
    const {
      roundThis,
      table,
      numberOfDays,
      timeLeft,
      currentPrice,
      raised,
      dynamics,
      loading,
      claimedAll,
      dailyTotals,
      createOnDay,
      typeTime,
      startTimeTot,
    } = this.state;
    // console.log(table);

    return (
      <div>
        <main className="block-body auction">
          <InfoPane openTime={typeTime} startTimeTot={startTimeTot} />
          <Statistics
            round={roundThis}
            roundAll={numberOfDays}
            timeLeft={timeLeft}
            currentPrice={exponentialToDecimal(currentPrice.toPrecision(2))}
            raised={exponentialToDecimal(raised.toPrecision(2))}
            cap={formatNumber(AUCTION.TOKEN_ALOCATION * currentPrice)}
            TOKEN_NAME={TOKEN_NAME}
          />
          {loading && (
            <div className="container-loading">
              <Loading />
            </div>
          )}
          {!loading && (
            <Dinamics
              data={dynamics}
              price={currentPrice}
              volume={dailyTotals}
              round={roundThis}
              distribution={
                Math.floor((createOnDay / Math.pow(10, 9)) * 100) / 100
              }
            />
          )}
          {!loading && (
            <div style={{ marginTop: '0px', width: '100%' }}>
              <Table
                data={table}
                TOKEN_NAME={TOKEN_NAME}
                claimed={claimedAll}
                web3={this.props.web3}
                contract={this.props.contract}
                round={roundThis}
              />
            </div>
          )}
        </main>
        {!loading && (
          <ActionBarAuction
            web3={this.props.web3}
            contract={this.props.contract}
            minRound={roundThis}
            maxRound={numberOfDays}
            claimed={claimedAll}
            startAuction={typeTime === 'intro'}
          />
        )}
      </div>
    );
  }
}

export default withWeb3(Auction);
