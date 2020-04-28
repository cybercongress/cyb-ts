import {
  run,
  formatNumber,
  roundNumber,
  asyncForEach,
  timer,
  exponentialToDecimal,
  getTimeRemaining,
} from '../../utils/utils';

const dateFormat = require('dateformat');

const DEFAULT_PROOF = 'Processing by cyber~Congress';
const MILLISECONDS_IN_SECOND = 1000;

export const getDinamics = async (methods, contractAuctionUtils) => {
  try {
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
    return {
      dynamics,
      raised,
    };
  } catch (error) {
    console.log(error);
    return {
      raised: 0,
      dynamics: {
        x: [],
        y: [],
        x1: [],
        y1: [],
        time: [],
      },
    };
  }
};

export const getTableData = async (accounts, methods, contractAuctionUtils) => {
  try {
    console.log('accounts', accounts);
    let userBuysAuctionUtils = null;
    let userClaims = null;
    const table = [];
    const roundThis = await methods.today().call();
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

    let raisedToken = 0;
    let canClaim = 0;

    await asyncForEach(
      Array.from(Array(dailyTotalsUtils.length).keys()),
      async item => {
        let createOnDay;
        let userBuy = 0;
        if (item === 0) {
          createOnDay = createFirstDay;
        } else {
          createOnDay = createPerDay;
        }
        // if (item <= roundThis) {
        const currentPrice = roundNumber(
          dailyTotalsUtils[item] / (createOnDay * 10 ** 9),
          10
        );

        const distValue = Math.floor((createOnDay / 10 ** 9) * 100) / 100;
        const dailyValue =
          Math.floor((dailyTotalsUtils[item] / 10 ** 18) * 10000) / 10000;
        if (accounts === null || accounts === undefined) {
          userBuy = 0;
        } else {
          userBuy = userBuysAuctionUtils[item] / 10 ** 18;
        }
        let cyb;
        if (!userBuy || userClaims[item] === true) {
          cyb = 0;
        } else {
          cyb = (distValue / dailyValue) * userBuy;
        }
        let claimedItem;
        if (cyb === 0 || item >= parseInt(roundThis, 10)) {
          claimedItem = false;
        } else {
          claimedItem = item;
        }

        const youCYB = formatNumber(Math.floor(cyb * 100) / 100, 3);

        if (item < roundThis) {
          canClaim += parseFloat(youCYB);
        }

        raisedToken += parseFloat(youCYB);

        table.push({
          period: item,
          dist: formatNumber(
            Math.floor((createOnDay / 10 ** 9) * 100) / 100,
            3
          ),
          total: formatNumber(
            Math.floor((dailyTotalsUtils[item] / 10 ** 18) * 10000) / 10000,
            3
          ),
          price: formatNumber(currentPrice, 7),
          closing: (23 * (parseInt(roundThis, 10) - item)) / 23,
          youETH: formatNumber(userBuy, 7),
          youCYB,
          claimed: claimedItem,
          // _youCYB.length ? _youCYB[0].returnValues.amount : '0'
        });
        // console.log('CR', {_createOnDay, _dailyTotals, today}, (_createOnDay/Math.pow(10,18)  +  _dailyTotals/2) /_dailyTotals);
        // }
      }
    );
    return { table, raisedToken, canClaim };
  } catch (error) {
    console.log(error);
    return { table: [], raisedToken: 0, canClaim: 0 };
  }
};

export const getDataTableRound = async (
  round,
  methods,
  tableData,
  dynamicsData,
  accounts
) => {
  try {
    const table = tableData;
    const dynamics = dynamicsData;

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

    return {
      table,
      dynamics,
      token: parseFloat(roundTable.cyb),
    };
  } catch (error) {
    console.log(error);

    return {
      table: null,
      dynamics: null,
    };
  }
};

export const getVestingDataTable = async (
  accounts,
  contractTokenManager,
  contractVesting
) => {
  try {
    const data = [];
    if (accounts && accounts !== null) {
      const vestingsLengths = await contractTokenManager.methods
        .vestingsLengths(accounts)
        .call();

      await asyncForEach(
        Array.from(Array(parseInt(vestingsLengths, 10)).keys()),
        async item => {
          let getProof;

          const {
            amount,
            start,
          } = await contractTokenManager.methods
            .getVesting(accounts, item)
            .call();

          const getClaimAddress = await contractVesting.methods
            .getClaimAddress(accounts, item)
            .call();

          if (getClaimAddress.length === 0) {
            return;
          }

          getProof = await contractVesting.methods
            .getProof(accounts, item)
            .call();

          if (getProof.length === 0) {
            getProof = DEFAULT_PROOF;
          }

          data.push({
            id: item,
            amount,
            start: dateFormat(
              new Date(start * MILLISECONDS_IN_SECOND),
              'dd/mm/yyyy, hh:MM:ss tt'
            ),
            recipient: getClaimAddress,
            proof: getProof,
          });
        }
      );

      const table = data.reverse();

      return { table };
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};
