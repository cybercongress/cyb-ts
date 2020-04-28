import React, { PureComponent } from 'react';
import { Link, Route } from 'react-router-dom';
import { Pane, Text, Tablist } from '@cybercongress/gravity';
import { fromWei, toBN, toWei } from 'web3-utils';
import withWeb3 from '../../components/web3/withWeb3';
import { Statistics } from './statistics';
import ActionBarAuction from './actionBar';
import Dinamics from './dinamics';
import Table from './table';
import { Loading, TabBtn } from '../../components';
import {
  run,
  formatNumber,
  roundNumber,
  asyncForEach,
  timer,
  exponentialToDecimal,
  getTimeRemaining,
} from '../../utils/utils';
import {
  getDinamics,
  getTableData,
  getDataTableRound,
  getVestingDataTable,
} from './utils';
import InfoPane from './infoPane';
import TableVesting from './tableVesting';
import BalancePane from './balancePane';
import InfoPaneVesting from './infoPaneVesting';
import ActionBarVesting from './actionBarVesting';
import StatisticsClaim from './statisticsClaim';
import InfoPaneClaim from './infoPaneClaim';

import { AUCTION } from '../../utils/config';

const dateFormat = require('dateformat');

const DEFAULT_PROOF = 'Processing';
const MILLISECONDS_IN_SECOND = 1000;

const {
  ADDR_SMART_CONTRACT,
  TOKEN_NAME,
  TOPICS_SEND,
  TOPICS_CLAIM,
  ROUND_DURATION,
} = AUCTION;

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
      endTimeVesting: null,
      createOnDay: 0,
      raisedToken: 0,
      canClaim: 0,
      balanceVesting: 0,
      loadingVesting: true,
      spendableBalance: 0,
      tableVestingLoading: true,
      tableVesting: [],
      popupsBuy: false,
      roundTable: null,
      typeTime: 'start',
      startTimeTot: null,
      selected: '',
      dynamics: {
        x: [],
        y: [],
        x1: [],
        y1: [],
      },
    };
  }

  async componentDidMount() {
    this.chekPathname();
    this.init();
    this.subscription();
    this.accountsChanged();
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

    if (pathname.match(/claim/gm) && pathname.match(/claim/gm).length > 0) {
      this.setState({ selected: 'claim' });
    } else if (
      pathname.match(/vest/gm) &&
      pathname.match(/vest/gm).length > 0
    ) {
      this.setState({ selected: 'vest' });
    } else {
      this.setState({ selected: 'bid' });
    }
  };

  init = async () => {
    const {
      accounts,
      contract: { methods },
      contractVesting,
    } = this.props;
    await this.setState({
      accounts,
    });
    const roundThis = parseInt(await methods.today().call());
    const numberOfDays = await methods.numberOfDays().call();
    const openTime = await methods.openTime().call();
    let startTimeTot;
    let typeTime;

    const end = await contractVesting.methods.vestingEnd().call();
    if (end * MILLISECONDS_IN_SECOND < Date.parse(new Date())) {
      const endTime = dateFormat(
        new Date(end * MILLISECONDS_IN_SECOND),
        'dd/mm/yyyy, HH:MM:ss'
      );
      this.setState({
        endTimeVesting: endTime,
      });
    }

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
        this.setState({
          tableVestingLoading: false,
        });
      } else {
        console.log('accounts');
        timer(this.getTimeEndRound);
        this.statistics();
        this.dinamics();
        this.getDataTable();
        this.getBalance();
        this.getVesting();
      }
    } else {
      this.setState({ loading: false });
    }
  };

  subscription = async () => {
    const { web3, accounts, contractVesting } = this.props;
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

    if (accounts && accounts !== null) {
      contractVesting.events.NewLock(
        {
          filter: { lockAddress: accounts },
        },
        (error, event) => {
          console.log('NewLock', event);
          this.newLockUpdate(event);
        }
      );

      contractVesting.events.NewProof(
        {
          filter: { lockAddress: accounts },
        },
        (error, event) => {
          this.newProofUpdate(event);
          console.log('NewProof', event);
        }
      );
      const lowerCaseAcc = accounts.toLowerCase();
      const subscriptionClaim = web3.eth.subscribe(
        'logs',
        {
          address: ADDR_SMART_CONTRACT,
          topics: [TOPICS_CLAIM],
        },
        (error, result) => {
          if (!error) {
            console.log(result);
            if (result.topics[2].indexOf(lowerCaseAcc.slice(2)) !== -1) {
              this.getBalance();
              run(this.getDataTable);
            }
          }
        }
      );
      // unsubscribes the subscription
      subscriptionClaim.unsubscribe((error, success) => {
        if (success) {
          console.log('Successfully unsubscribed!');
        }
      });
    }
  };

  getBalance = async () => {
    const { contractTokenManager, contractToken } = this.props;
    const { accounts } = this.state;

    const balance = await contractToken.methods.balanceOf(accounts).call();
    const spendableBalance = await contractTokenManager.methods
      .spendableBalanceOf(accounts)
      .call();

    this.setState({
      balanceVesting: balance,
      loadingVesting: false,
      spendableBalance,
    });
  };

  getVesting = async () => {
    const { contractTokenManager, contractVesting } = this.props;
    const { accounts } = this.state;
    let table = [];

    const dataTable = await getVestingDataTable(
      accounts,
      contractTokenManager,
      contractVesting
    );

    if (dataTable !== undefined) {
      table = dataTable.table.reverse();
    }

    this.setState({ tableVesting: table, tableVestingLoading: false });
  };

  newLockUpdate = async dataEvent => {
    const { tableVesting, accounts } = this.state;
    const { contractTokenManager } = this.props;
    if (accounts === dataEvent.returnValues.claimer.toLowerCase()) {
      let data = [];

      const { vestingId, claimer, amount, account } = dataEvent.returnValues;

      const { start } = await contractTokenManager.methods
        .getVesting(claimer, parseInt(vestingId, 10))
        .call();

      data = [
        {
          id: parseInt(vestingId, 10),
          amount,
          start: dateFormat(
            new Date(start * MILLISECONDS_IN_SECOND),
            'dd/mm/yyyy, hh:MM:ss tt'
          ),
          recipient: account,
          proof: DEFAULT_PROOF,
        },
        ...tableVesting,
      ];

      this.setState({ tableVesting: data });
      this.getBalance();
    }
  };

  newProofUpdate = async dataEvent => {
    const { tableVesting, accounts } = this.state;
    const data = [...tableVesting];
    if (accounts === dataEvent.returnValues.claimer.toLowerCase()) {
      data.forEach((element, index) => {
        if (element.id === parseInt(dataEvent.returnValues.vestingId, 10)) {
          tableVesting[index].proof = dataEvent.returnValues.proofTx;
        }
      });
      console.log('newProofUpdate', data);
      this.setState({ tableVesting: data });
    }
  };

  accountsChanged = () => {
    const { accounts } = this.props;
    if (accounts) {
      window.ethereum.on('accountsChanged', async accountsChanged => {
        const defaultAccounts = accountsChanged[0];
        const tmpAccount = defaultAccounts;
        // console.log(tmpAccount);
        await this.setState({
          accounts: tmpAccount,
        });
        this.getDataTable();
        this.getBalance();
        this.getVesting();
      });
    }
  };

  getTimeEndRound = async () => {
    const {
      contract: { methods },
    } = this.props;
    const today = await methods.today().call();
    const time = await methods.time().call();
    const startTime = await methods.startTime().call();

    const times = parseFloat(
      parseFloat(today) * 23 * 60 * 60 -
        (parseFloat(time) - parseFloat(startTime))
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
    const roundThis = await methods.today().call();
    const numberOfDays = await methods.numberOfDays().call();
    const today = parseInt(roundThis, 10);
    const createOnDay = await methods.createOnDay(today).call();
    const dailyTotals = await methods.dailyTotals(today).call();

    const currentPrice = dailyTotals / (createOnDay * 10 ** 9);

    return this.setState({
      roundThis: parseInt(roundThis, 10),
      currentPrice,
      numberOfDays,
      dailyTotals: Math.floor((dailyTotals / 10 ** 18) * 10000) / 10000,
    });
  };

  dinamics = async () => {
    const {
      contract: { methods },
      contractAuctionUtils,
    } = this.props;
    let dynamics = [];
    let raised = 0;

    const { dynamics: dynamicsData, raised: raisedData } = await getDinamics(
      methods,
      contractAuctionUtils
    );

    if (dynamicsData && raisedData) {
      dynamics = dynamicsData;
      raised = raisedData;
    }

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

    const { table, raisedToken, canClaim } = await getTableData(
      accounts,
      methods,
      contractAuctionUtils
    );

    if (table && table.length > 0) {
      if (table.some(this.even)) {
        this.setState({
          claimedAll: true,
          table,
          raisedToken,
          canClaim,
        });
      } else {
        this.setState({
          claimedAll: false,
          table,
          raisedToken,
          canClaim,
        });
      }
    } else {
      this.setState({ table, raisedToken, canClaim });
    }
  };

  getDataTableForRound = async round => {
    const {
      contract: { methods },
    } = this.props;
    const {
      accounts,
      raisedToken,
      table: tableState,
      dynamics: dynamicsState,
    } = this.state;

    const { table, dynamics, token } = await getDataTableRound(
      round,
      methods,
      tableState,
      dynamicsState,
      accounts
    );

    if (table !== null && dynamics !== null) {
      this.setState({
        table,
        dynamics,
        raisedToken: raisedToken + token,
      });
    }
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
      accounts,
      selected,
      balanceVesting,
      loadingVesting,
      spendableBalance,
      raisedToken,
      tableVestingLoading,
      tableVesting,
      endTimeVesting,
      canClaim,
    } = this.state;
    let content;
    let contentStatistics;
    let contentInfoPane;

    const { contract, web3, contractVesting } = this.props;

    const Bid = () => (
      <>
        <Dinamics
          data={dynamics}
          price={currentPrice}
          volume={dailyTotals}
          round={roundThis}
          distribution={Math.floor((createOnDay / 10 ** 9) * 100) / 100}
        />
        <Table
          data={table}
          TOKEN_NAME={TOKEN_NAME}
          claimed={claimedAll}
          web3={web3}
          contract={contract}
          round={roundThis}
        />
      </>
    );

    const Claim = () => (
      <Table
        data={table}
        TOKEN_NAME={TOKEN_NAME}
        claimed={claimedAll}
        web3={web3}
        contract={contract}
        round={roundThis}
        onlyClaim
      />
    );

    const Vesting = () => {
      if (tableVestingLoading) {
        return (
          <div className="container-loading">
            <Loading />
          </div>
        );
      }

      return <TableVesting data={tableVesting} />;
    };

    if (selected === 'bid') {
      content = <Bid />;
      contentInfoPane = (
        <InfoPane openTime={typeTime} startTimeTot={startTimeTot} />
      );
      contentStatistics = (
        <Statistics
          round={roundThis}
          roundAll={numberOfDays}
          timeLeft={timeLeft}
          currentPrice={exponentialToDecimal(currentPrice.toPrecision(2))}
          raised={exponentialToDecimal(raised.toPrecision(2))}
          cap={formatNumber(AUCTION.TOKEN_ALOCATION * currentPrice)}
          TOKEN_NAME={TOKEN_NAME}
        />
      );
    }

    if (selected === 'claim') {
      content = <Route path="/gol/faucet/claim" render={() => <Claim />} />;
      contentInfoPane = (
        <InfoPaneClaim openTime={typeTime} startTimeTot={startTimeTot} />
      );
      contentStatistics = (
        <StatisticsClaim
          round={roundThis}
          roundAll={numberOfDays}
          canClaim={canClaim}
          raisedToken={raisedToken}
        />
      );
    }

    if (selected === 'vest') {
      content = <Route path="/gol/faucet/vest" render={() => <Vesting />} />;
      contentInfoPane = <InfoPaneVesting endTime={endTimeVesting} />;
      contentStatistics = (
        <BalancePane
          marginTop={30}
          marginBottom={50}
          balance={balanceVesting}
          spendableBalance={spendableBalance}
          accounts={accounts}
        />
      );
    }

    return (
      <div>
        <main className="block-body auction">
          {contentInfoPane}
          {contentStatistics}
          <Tablist
            display="grid"
            gridTemplateColumns="repeat(auto-fit, minmax(120px, 1fr))"
            gridGap="10px"
            marginY={20}
          >
            <TabBtn
              text="Bid"
              isSelected={selected === 'bid'}
              to="/gol/faucet"
            />
            <TabBtn
              text="Claim"
              isSelected={selected === 'claim'}
              to="/gol/faucet/claim"
            />
            <TabBtn
              text="Vest"
              isSelected={selected === 'vest'}
              to="/gol/faucet/vest"
            />
          </Tablist>
          {loading && (
            <div className="container-loading">
              <Loading />
            </div>
          )}
          {!loading && content}
        </main>
        {!loading && selected !== 'vest' ? (
          <ActionBarAuction
            web3={web3}
            contract={contract}
            minRound={roundThis}
            maxRound={numberOfDays}
            claimed={claimedAll}
            accounts={accounts}
            selected={selected}
          />
        ) : (
          <ActionBarVesting
            available={spendableBalance}
            contractVesting={contractVesting}
            web3={web3}
            accounts={accounts}
            endTime={endTimeVesting}
          />
        )}
      </div>
    );
  }
}

export default withWeb3(Auction);
