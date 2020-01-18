import React, { PureComponent } from 'react';
import { Text, Pane } from '@cybercongress/gravity';
import Dinamics from './dinamics';
import Statistics from './statistics';
import Table from './table';
import ActionBarTakeOff from './actionBar';
import { asyncForEach, formatNumber } from '../../utils/utils';
import { Loading } from '../../components/index';
import { COSMOS, TAKEOFF } from '../../utils/config';
import {
  cybWon,
  funcDiscount,
  getEstimation,
  getDataPlot,
  getRewards,
  getGroupAddress,
} from '../../utils/fundingMath';

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

class Funding extends PureComponent {
  ws = new WebSocket(GAIA_WEBSOCKET_URL);

  constructor(props) {
    super(props);
    const tempArr = localStorage.getItem('allpin');
    const allPin = JSON.parse(tempArr);
    this.state = {
      groups: [],
      amount: 0,
      dataAllPin: allPin,
      dataTxs: null,
      atomLeff: 0,
      won: 0,
      pin: false,
      currentPrice: 0,
      currentDiscount: 0,
      dataPlot: [],
      dataRewards: [],
      loader: true,
      loading: 0,
    };
  }

  async componentDidMount() {
    // const txs = JSON.parse(localStorage.getItem('txs'));
    // if (txs !== null) {
    //   this.setState({
    //     dataTxs: txs
    //   });
    // }
    this.getDataWS();
    // console.log('groupsDidMount', groups);
    const dataPin = [];
    const jsonStr = localStorage.getItem('allpin');
    dataPin.push(JSON.parse(jsonStr));
    if (dataPin[0] != null) {
      if (dataPin[0].length) {
        // // debugger;
        // for(let i = 0; i <= groups.length; i++){
        //   for(let j = 0; j <= dataPin.length; j++){
        //     if(groups[i].group.indexOf(`${dataPin[j].group}`) !== -1){
        //       groups.pin = true;
        //     }
        //   }
        // }
        this.setState({
          pin: true,
          // groups
        });
      }
    }
  }

  getDataWS = () => {
    this.ws.onopen = () => {
      console.log('connected');
    };
    this.ws.onmessage = async evt => {
      // const txs = JSON.parse(localStorage.getItem('txs'));
      const message = JSON.parse(evt.data);
      console.log('txs', message);
      // if (txs == null) {
      // localStorage.setItem('txs', JSON.stringify(message));
      this.setState({
        dataTxs: message,
      });
      this.init(message);
      // } else if (txs.length !== message.length) {
      //   console.log('localStorage !== ws');
      //   const diffTsx = diff('txhash', txs, message);
      //   this.setState({
      //     dataTxs: message,
      //   });
      //   localStorage.setItem('txs', JSON.stringify(message));
      //   console.log('txsLocalStorage', diff('txhash', txs, message));
      //   this.init(diffTsx);

      // } else {
      //   console.log('localStorage == ws');
      //   this.getItemLocalStorage();
      // }
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  getItemLocalStorage = () => {
    const statistics = JSON.parse(localStorage.getItem('statistics'));
    const { amount, atomLeff, won, currentPrice, currentDiscount } = statistics;
    const groups = JSON.parse(localStorage.getItem('groups'));
    const dataPlot = JSON.parse(localStorage.getItem('dataPlot'));
    const dataRewards = JSON.parse(localStorage.getItem('dataRewards'));

    this.setState({
      amount,
      atomLeff,
      won,
      currentPrice,
      currentDiscount,
      groups,
      dataPlot,
      dataRewards,
      loader: false,
    });
  };

  init = async txs => {
    await this.getStatistics(txs);
    this.getTableData();
    this.checkPin();
    this.getData();
    this.getPlot();
  };

  getStatistics = async txs => {
    const dataTxs = txs;
    console.log('dataTxs', dataTxs);
    // const statisticsLocalStorage = JSON.parse(
    //   localStorage.getItem('statistics')
    // );

    let amount = 0;
    let atomLeff = 0;
    let currentDiscount = 0;
    let won = 0;
    let currentPrice = 0;
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
    // if (statisticsLocalStorage !== null) {
    //   amount += statisticsLocalStorage.amount;
    // }
    console.log('amount', amount);
    atomLeff = ATOMsALL - amount;
    currentDiscount = funcDiscount(amount);
    won = cybWon(amount);
    currentPrice = won / amount;
    console.log('won', won);
    console.log('currentDiscount', currentDiscount);
    const statistics = {
      amount,
      atomLeff,
      won,
      currentPrice,
      currentDiscount,
    };
    // localStorage.setItem(`statistics`, JSON.stringify(statistics));
    this.setState({
      amount,
      atomLeff,
      won,
      currentPrice,
      currentDiscount,
      loader: false,
    });
  };

  getPlot = async () => {
    const {
      dataAllPin,
      dataTxs,
      currentPrice,
      currentDiscount,
      amount,
    } = this.state;
    // console.log('dataAllPin', dataAllPin);
    const dataPin = dataAllPin;

    const Plot = [];
    const dataAxisRewards = {
      type: 'scatter',
      x: 0,
      y: 0,
      line: {
        width: 2,
        color: '#36d6ae',
      },
      hoverinfo: 'none',
    };
    if (amount <= ATOMsALL) {
      const rewards = getRewards(currentPrice, currentDiscount, amount, amount);
      const rewards0 = getRewards(currentPrice, currentDiscount, amount, 0);
      dataAxisRewards.y = [rewards0, rewards];
      dataAxisRewards.x = [0, amount];
    } else {
      const rewards = getRewards(
        currentPrice,
        currentDiscount,
        ATOMsALL,
        ATOMsALL
      );
      const rewards0 = getRewards(currentPrice, currentDiscount, ATOMsALL, 0);
      dataAxisRewards.y = [rewards0, rewards];
      dataAxisRewards.x = [0, ATOMsALL];
    }

    Plot.push(dataAxisRewards);
    if (dataPin !== null) {
      if (dataPin[0] === undefined) {
        // localStorage.setItem(`dataRewards`, JSON.stringify(Plot));
        this.setState({
          dataRewards: Plot,
        });
      }
      asyncForEach(Array.from(Array(dataPin.length).keys()), async itemsG => {
        let amountAtom = 0;
        let temp = 0;
        const { group } = dataPin[itemsG];
        // asyncForEach(Array.from(Array(dataTxs.length).keys()), async item => {
        for (let item = 0; item < dataTxs.length; item++) {
          let estimation = 0;
          const colorPlot = group.replace(/[^0-9]/g, '').substr(0, 6);
          const tempArrPlot = {
            x: 0,
            y: 0,
            estimationPlot: 0,
            fill: 'tozeroy',
            type: 'scatter',
            line: {
              width: 2,
              color: '#36d6ae',
            },
            hovertemplate: '',
          };
          const address = dataTxs[item].tx.value.msg[0].value.from_address;
          const amou =
            Number.parseInt(
              dataTxs[item].tx.value.msg[0].value.amount[0].amount,
              10
            ) / COSMOS.DIVISOR_ATOM;
          if (address === group) {
            if (amountAtom <= ATOMsALL) {
              const x0 = amountAtom;
              const y0 = getRewards(currentPrice, currentDiscount, amount, x0);
              amountAtom += amou;
              const x = amountAtom;
              const y = getRewards(
                currentPrice,
                currentDiscount,
                amount,
                amountAtom
              );
              // const tempVal = temp + amou;
              let tempVal = temp + amou;
              if (tempVal >= ATOMsALL) {
                tempVal = ATOMsALL;
              }
              estimation =
                getEstimation(currentPrice, currentDiscount, amount, tempVal) -
                getEstimation(currentPrice, currentDiscount, amount, temp);
              temp += amou;
              // console.log('estimation', estimation);
              tempArrPlot.estimationPlot = estimation;
              tempArrPlot.hovertemplate =
                `My CYBs estimation: ${formatNumber(
                  Math.floor(estimation * 10 ** -9 * 1000) / 1000,
                  3
                )}` +
                `<br>Atoms: ${formatNumber(
                  Math.floor((x - x0) * 10 ** -3 * 1000) / 1000,
                  3
                )}k` +
                '<extra></extra>';
              tempArrPlot.x = [x0, x];
              tempArrPlot.y = [y0, y];
              Plot.push(tempArrPlot);
            } else {
              amountAtom += amou;
              temp += amou;
              break;
            }
          } else {
            amountAtom += amou;
            temp += amou;
          }
        }
        // localStorage.setItem(`dataRewards`, JSON.stringify(Plot));
        this.setState({
          dataRewards: Plot,
        });
      });
    } else {
      // localStorage.setItem(`dataRewards`, JSON.stringify(Plot));
      this.setState({
        dataRewards: Plot,
      });
    }
  };

  getTableData = async () => {
    const {
      dataTxs,
      currentPrice,
      currentDiscount,
      amount,
      dataAllPin,
    } = this.state;
    try {
      let estimationTemp = 0;
      const table = [];
      let temp = 0;
      for (let item = 0; item < dataTxs.length; item++) {
        let estimation = 0;
        if (temp <= ATOMsALL) {
          const val =
            Number.parseInt(
              dataTxs[item].tx.value.msg[0].value.amount[0].amount,
              10
            ) / COSMOS.DIVISOR_ATOM;
          let tempVal = temp + val;
          if (tempVal >= ATOMsALL) {
            tempVal = ATOMsALL;
          }
          estimation =
            getEstimation(currentPrice, currentDiscount, amount, tempVal) -
            getEstimation(currentPrice, currentDiscount, amount, temp);
          temp += val;
          estimationTemp += estimation;
        } else {
          break;
        }
        const d = new Date(dataTxs[item].timestamp);
        table.push({
          txhash: dataTxs[item].txhash,
          height: dataTxs[item].height,
          from: dataTxs[item].tx.value.msg[0].value.from_address,
          timestamp: dateFormat(d, 'dd/mm/yyyy, h:MM:ss TT'),
          amount:
            Number.parseInt(
              dataTxs[item].tx.value.msg[0].value.amount[0].amount,
              10
            ) / COSMOS.DIVISOR_ATOM,
          estimation,
        });
      }
      console.log('table', table);
      console.log('estimationTemp', estimationTemp);
      const groupsAddress = getGroupAddress(table);
      const groups = Object.keys(groupsAddress).map(key => ({
        group: key,
        address: groupsAddress[key],
        height: null,
        timestamp: null,
        amountСolumn: null,
        pin: false,
        cyb: null,
      }));
      for (let i = 0; i < groups.length; i++) {
        let sum = 0;
        let sumEstimation = 0;
        for (let j = 0; j <= groups[i].address.length - 1; j++) {
          sum += groups[i].address[j].amount;
          sumEstimation += groups[i].address[j].cybEstimation;
          groups[i].height = groups[i].address[0].height;
          groups[i].timestamp = groups[i].address[0].timestamp;
        }
        groups[i].amountСolumn = sum;
        groups[i].cyb = sumEstimation;
      }
      // localStorage.setItem(`groups`, JSON.stringify(groups));
      console.log('groups', groups);

      this.setState({
        groups,
      });
    } catch (error) {
      throw new Error();
    }
  };

  checkPin = async () => {
    const { dataAllPin, groups } = this.state;
    if (dataAllPin !== null) {
      await asyncForEach(
        Array.from(Array(dataAllPin.length).keys()),
        async pin => {
          for (let i = 0; i < groups.length; i++) {
            if (groups[i].group.indexOf(`${dataAllPin[pin].group}`) !== -1) {
              groups[i].pin = true;
            }
          }
        }
      );
    }
  };

  getData = async () => {
    const { amount } = this.state;
    let dataPlot = [];
    dataPlot = getDataPlot(amount);
    // localStorage.setItem(`dataPlot`, JSON.stringify(dataPlot));
    this.setState({
      dataPlot,
    });
  };

  updateList = async data => {
    const tempArr = data;
    let pin = false;
    if (tempArr != null) {
      if (tempArr.length) {
        pin = true;
      }
    }
    await this.setState({
      dataAllPin: tempArr,
      pin,
    });
    this.getPlot();
  };

  pinItem = async item => {
    // console.log('item', item);
    const { groups } = this.state;
    let allPin = JSON.parse(localStorage.getItem('allpin'));
    if (allPin == null) {
      allPin = [];
    }
    const { group } = item;
    const value = item;
    const pin = {
      group,
      value,
    };
    localStorage.setItem(`item_pin`, JSON.stringify(pin));
    allPin.push(pin);
    localStorage.setItem('allpin', JSON.stringify(allPin));
    this.updateList(allPin);
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].group.indexOf(`${item.group}`) !== -1) {
        groups[i].pin = true;
      }
    }
    this.setState({
      groups,
    });
  };

  unPinItem = item => {
    const { groups } = this.state;
    const tempArr = localStorage.getItem('allpin');
    const allPin = JSON.parse(tempArr);
    if (allPin != null) {
      for (let i = 0; i < allPin.length; i++) {
        const tempindexItem = allPin[i].group.indexOf(`${item.group}`) !== -1;
        if (tempindexItem) {
          allPin.splice(i, 1);
          localStorage.setItem('allpin', JSON.stringify(allPin));
          this.updateList(allPin);
        }
      }
      for (let i = 0; i < groups.length; i++) {
        if (groups[i].group.indexOf(`${item.group}`) !== -1) {
          groups[i].pin = false;
        }
      }
      this.setState({
        groups,
      });
    }
  };

  render() {
    const {
      groups,
      atomLeff,
      won,
      currentPrice,
      currentDiscount,
      dataPlot,
      dataAllPin,
      dataRewards,
      pin,
      loader,
    } = this.state;

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
              universe: <a href="#/gol">Game of Links</a>.
            </Text>
          </Pane>
          <Statistics
            atomLeff={formatNumber(atomLeff)}
            won={formatNumber(Math.floor(won * 10 ** -9 * 1000) / 1000)}
            price={formatNumber(
              Math.floor(currentPrice * 10 ** -9 * 1000) / 1000
            )}
            discount={formatNumber(currentDiscount * 100, 3)}
          />
          <Dinamics data3d={dataPlot} dataRewards={dataRewards} />

          {groups.length > 0 && (
            <Table
              data={groups}
              dataPinTable={dataAllPin}
              update={this.updateList}
              pin={pin}
              fPin={this.pinItem}
              fUpin={this.unPinItem}
            />
          )}
        </main>
        <ActionBarTakeOff />
      </span>
    );
  }
}

export default Funding;
