import React, { PureComponent } from 'react';
import { Dinamics } from './dinamics';
import { Statistics } from './statistics';
import { Table } from './table';
import { ActionBar } from './actionBar';
import {
  asyncForEach,
  formatNumber,
  run,
  roundNumber
} from '../../utils/utils';
import { Loading } from '../../components/index';
import { wsURL, ATOMsALL } from '../../utils/config';
import {
  cybWon,
  funcDiscount,
  getEstimation,
  getDataPlot,
  getRewards,
  getGroupAddress
} from '../../utils/fundingMath';

class Funding extends PureComponent {
  ws = new WebSocket(wsURL);

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
      dataRewards: []
    };
  }

  async componentDidMount() {
    run(this.getDataWS);
    const dataPin = [];
    const jsonStr = localStorage.getItem('allpin');
    dataPin.push(JSON.parse(jsonStr));
    if (dataPin[0] != null) {
      if (dataPin[0].length) {
        this.setState({
          pin: true
        });
      }
    }
  }

  getDataWS = () => {
    this.ws.onopen = () => {
      console.log('connected');
    };
    this.ws.onmessage = async evt => {
      const message = JSON.parse(evt.data);
      console.log('txs', message);
      this.setState({
        dataTxs: message
      });
      this.init();
    };

    this.ws.onclose = () => {
      console.log('disconnected');
    };
  };

  init = async () => {
    await this.getStatistics();
    this.getTableData();
    this.getData();
    this.getPlot();
  };

  getStatistics = async () => {
    const { dataTxs } = this.state;
    let amount = 0;

    await asyncForEach(Array.from(Array(dataTxs.length).keys()), async item => {
      amount +=
        Number.parseInt(dataTxs[item].tx.value.msg[0].value.amount[0].amount) *
        10 ** -1;
    });
    const atomLeff = ATOMsALL - amount;
    const won = cybWon(amount);
    const currentPrice = won / amount;
    const currentDiscount = funcDiscount(amount);
    this.setState({
      amount,
      atomLeff,
      won,
      currentPrice,
      currentDiscount
    });
  };

  getPlot = async () => {
    const {
      dataAllPin,
      dataTxs,
      currentPrice,
      currentDiscount,
      amount
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
        color: '#36d6ae'
      }
    };
    const rewards = getRewards(currentPrice, currentDiscount, amount, amount);
    const rewards0 = getRewards(currentPrice, currentDiscount, amount, 0);
    dataAxisRewards.y = [rewards0, rewards];
    dataAxisRewards.x = [0, amount];

    Plot.push(dataAxisRewards);
    if (dataPin !== null) {
      if (dataPin[0] === undefined) {
        this.setState({
          dataRewards: Plot
        });
      }
      asyncForEach(Array.from(Array(dataPin.length).keys()), async itemsG => {
        let amountAtom = 0;
        const { group } = dataPin[itemsG];
        asyncForEach(Array.from(Array(dataTxs.length).keys()), async item => {
          const colorPlot = group.replace(/[^0-9]/g, '').substr(0, 6);
          const tempArrPlot = {
            x: 0,
            y: 0,
            fill: 'tozeroy',
            type: 'scatter',
            line: {
              width: 2,
              color: `#${colorPlot}`
            }
          };
          const address = dataTxs[item].tx.value.msg[0].value.from_address;
          const amou =
            Number.parseInt(
              dataTxs[item].tx.value.msg[0].value.amount[0].amount
            ) *
            10 ** -1;
          if (address === group) {
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
            tempArrPlot.x = [x0, x];
            tempArrPlot.y = [y0, y];
            Plot.push(tempArrPlot);
          } else {
            amountAtom += amou;
          }
        });
        this.setState({
          dataRewards: Plot
        });
      });
    } else {
      this.setState({
        dataRewards: Plot
      });
    }
  };

  getTableData = async () => {
    const { dataTxs, currentPrice, currentDiscount, amount } = this.state;
    try {
      const table = [];
      let temp = 0;
      await asyncForEach(
        Array.from(Array(dataTxs.length).keys()),
        async item => {
          let estimation = 0;
          const val =
            Number.parseInt(
              dataTxs[item].tx.value.msg[0].value.amount[0].amount
            ) *
            10 ** -1;
          const tempVal = temp + val;
          estimation =
            getEstimation(currentPrice, currentDiscount, amount, tempVal) -
            getEstimation(currentPrice, currentDiscount, amount, temp);
          temp += val;
          table.push({
            txhash: dataTxs[item].txhash,
            height: dataTxs[item].height,
            from: dataTxs[item].tx.value.msg[0].value.from_address,
            amount:
              Number.parseInt(
                dataTxs[item].tx.value.msg[0].value.amount[0].amount
              ) *
              10 ** -1,
            estimation
          });
        }
      );

      const groupsAddress = getGroupAddress(table);

      const groups = Object.keys(groupsAddress).map(key => ({
        group: key,
        address: groupsAddress[key],
        amountСolumn: null,
        cyb: null
      }));

      for (let i = 0; i < groups.length; i++) {
        let sum = 0;
        let sumEstimation = 0;
        for (let j = 0; j <= groups[i].address.length - 1; j++) {
          sum += groups[i].address[j].amount;
          sumEstimation += groups[i].address[j].cybEstimation;
        }
        groups[i].amountСolumn = sum;
        groups[i].cyb = sumEstimation;
      }
      this.setState({
        groups
      });
    } catch (error) {
      throw new Error();
    }
  };

  getData = async () => {
    const { dataTxs } = this.state;
    let amount = 0;

    await asyncForEach(Array.from(Array(dataTxs.length).keys()), async item => {
      amount +=
        Number.parseInt(dataTxs[item].tx.value.msg[0].value.amount[0].amount) *
        10 ** -1;
    });
    const dataPlot = await getDataPlot(amount);
    this.setState({
      dataPlot
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
      pin
    });
    this.getPlot();
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
      pin
    } = this.state;

    // if (dataRewards[0] === undefined) {
    //   return <Loading />;
    // }
    // console.log(dataPlot);
    return (
      <span>
        <main className="block-body">
          <span className="caption">Cyber~Funding</span>
          <Statistics
            atomLeff={formatNumber(atomLeff)}
            won={formatNumber(Math.floor(won * 10 ** -9 * 1000) / 1000)}
            price={formatNumber(
              Math.floor(currentPrice * 10 ** -9 * 1000) / 1000
            )}
            discount={Math.floor(currentDiscount * 100 * 1000) / 1000}
          />
          <Dinamics data3d={dataPlot} dataRewards={dataRewards} />
          <Table
            data={groups}
            dataPinTable={dataAllPin}
            update={this.updateList}
            pin={pin}
          />
        </main>
        <ActionBar />
      </span>
    );
  }
}

export default Funding;
