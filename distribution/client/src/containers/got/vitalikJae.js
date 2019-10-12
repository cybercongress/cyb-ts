import React, { Component } from 'react';
import { Speedometer } from './speedometer';

const vitalik = require('../../image/vitalik.png');
const jae = require('../../image/jae.png');

const popus = [
  {
    atom: {
      win: {
        x0: ['atom 0.0', 'atom 0.1', 'atom 0.2'],
        x2_4: ['atom 1.0', 'atom 1.1', 'atom 1.2'],
        x5_7: ['atom 2.0', 'atom 2.1', 'atom 2.2'],
        x7: ['atom 7.0', 'atom 7.1', 'atom 7.2']
      },
      loses: {
        x0: ['loses atom 0.0', 'loses atom 0.1', 'loses atom 0.2'],
        x2_4: ['loses atom 1.0', 'loses atom 1.1', 'loses atom 1.2'],
        x5_7: ['loses atom 2.0', 'loses atom 2.1', 'loses atom 2.2'],
        x7: ['loses atom 7.0', 'loses atom 7.1', 'loses atom 7.2']
      }
    },
    eth: {
      win: {
        x0: ['ETH 0.0', 'ETH 0.1', 'ETH 0.2'],
        x2_4: ['ETH 1.0', 'ETH 1.1', 'ETH 1.2'],
        x5_7: ['ETH 2.0', 'ETH 2.1', 'ETH 2.2'],
        x7: ['ETH 7.0', 'ETH 7.1', 'ETH 7.2']
      },
      loses: {
        x0: ['loses ETH 0.0', 'loses ETH 0.1', 'loses ETH 0.2'],
        x2_4: ['loses ETH 1.0', 'loses ETH 1.1', 'loses ETH 1.2'],
        x5_7: ['loses ETH 2.0', 'loses ETH 2.1', 'loses ETH 2.2'],
        x7: ['loses ETH 7.0', 'loses ETH 7.1', 'loses ETH 7.2']
      }
    }
  }
];

const Crown = () => <div className="crown" />;

const CrownJae = () => <div className="crown-jae" />;

export class VitalikJae extends Component {
  constructor(props) {
    super(props);
    this.state = {
      contentPopupVitalik: 'buy ETH',
      contentPopupJae: 'buy ATOMs',
      diff: 0,
      value: '',
      valueSelect: 'ethAtom'
    };
  }

  // componentDidMount() {
  //   switch (this.state.diff) {
  //     case 0:
  //       this.setState({
  //         contentPopupVitalik: popus[0].eth.win.x0,
  //         contentPopupJae: popus[0].atom.win.x0
  //       });
  //       break;
  //     case 1:
  //       this.setState({
  //         contentPopupVitalik: popus[0].eth.win.x1,
  //         contentPopupJae: popus[0].atom.win.x1
  //       });
  //       break;
  //     case 2:
  //       this.setState({
  //         contentPopupVitalik: popus[0].eth.win.x2,
  //         contentPopupJae: popus[0].atom.win.x2
  //       });
  //       break;
  //     case 4:
  //       this.setState({
  //         contentPopupVitalik: popus[0].eth.win.x4,
  //         contentPopupJae: popus[0].atom.win.x4
  //       });
  //       break;
  //     case 7:
  //       this.setState({
  //         contentPopupVitalik: popus[0].eth.win.x7,
  //         contentPopupJae: popus[0].atom.win.x7
  //       });
  //       break;

  //     default:
  //       this.setState({
  //         contentPopupVitalik: 'buyEHT!!',
  //         contentPopupJae: 'buyATOMs!!'
  //       });
  //       break;
  //   }
  // }

  onChangeTest = e =>
    this.setState({
      value: e.target.value,
      diff: e.target.value
    });

  onChangeSelect = e =>
    this.setState({
      valueSelect: e.target.value
    });

  render() {
    const { win, arow, diff } = this.props;
    // const { contentPopupVitalik, contentPopupJae } = this.state;
    let contentPopupVitalik = '!!';
    let contentPopupJae = '112';

    if (this.state.valueSelect === 'eth') {
      switch (parseInt(this.state.diff)) {
        case 0:
        case 1:
          contentPopupVitalik =
            popus[0].eth.win.x0[
              Math.floor(Math.random() * popus[0].eth.win.x0.length)
            ];
          contentPopupJae =
            popus[0].atom.loses.x0[
              Math.floor(Math.random() * popus[0].atom.loses.x0.length)
            ];
          break;
        case 2:
        case 3:
        case 4:
          contentPopupVitalik =
            popus[0].eth.win.x2_4[
              Math.floor(Math.random() * popus[0].eth.win.x2_4.length)
            ];
          contentPopupJae =
            popus[0].atom.loses.x2_4[
              Math.floor(Math.random() * popus[0].atom.loses.x2_4.length)
            ];

          break;
        case 5:
        case 6:
        case 7:
          contentPopupVitalik =
            popus[0].eth.win.x5_7[
              Math.floor(Math.random() * popus[0].eth.win.x5_7.length)
            ];
          contentPopupJae =
            popus[0].atom.loses.x5_7[
              Math.floor(Math.random() * popus[0].atom.loses.x5_7.length)
            ];

          break;

        default:
          contentPopupVitalik =
            popus[0].eth.win.x7[
              Math.floor(Math.random() * popus[0].eth.win.x7.length)
            ];
          contentPopupJae =
            popus[0].atom.loses.x7[
              Math.floor(Math.random() * popus[0].atom.loses.x7.length)
            ];
          break;
      }
    } else if (this.state.valueSelect === 'atom') {
      switch (parseInt(this.state.diff)) {
        case 0:
        case 1:
          contentPopupVitalik =
            popus[0].eth.loses.x0[
              Math.floor(Math.random() * popus[0].eth.loses.x0.length)
            ];
          contentPopupJae =
            popus[0].atom.win.x0[
              Math.floor(Math.random() * popus[0].atom.win.x0.length)
            ];
          break;
        case 2:
        case 3:
        case 4:
          contentPopupVitalik =
            popus[0].eth.loses.x2_4[
              Math.floor(Math.random() * popus[0].eth.loses.x2_4.length)
            ];
          contentPopupJae =
            popus[0].atom.win.x2_4[
              Math.floor(Math.random() * popus[0].atom.win.x2_4.length)
            ];
          break;
        case 5:
        case 6:
        case 7:
          contentPopupVitalik =
            popus[0].eth.loses.x5_7[
              Math.floor(Math.random() * popus[0].eth.loses.x5_7.length)
            ];
          contentPopupJae =
            popus[0].atom.win.x5_7[
              Math.floor(Math.random() * popus[0].atom.win.x5_7.length)
            ];
          break;

        default:
          contentPopupVitalik =
            popus[0].eth.loses.x7[
              Math.floor(Math.random() * popus[0].eth.loses.x7.length)
            ];
          contentPopupJae =
            popus[0].atom.win.x7[
              Math.floor(Math.random() * popus[0].atom.win.x7.length)
            ];
          break;
      }
    } else {
      contentPopupVitalik = 'atomEth';
      contentPopupJae = 'atomEth';
    }

    return (
      <div>
        <div className="container">
          <div className={`vitalik ${win === 'eth' ? 'win-opacity' : ''}`}>
            {win === 'eth' && <Crown />}
            <img src={vitalik} />
            <div className="vitalik-popups">
              <span>{contentPopupVitalik}</span>
            </div>
          </div>
          {/* <div>{diff}</div> */}
          <Speedometer arow={arow} />
          <div className={`jae ${win === 'atom' ? 'win-opacity' : ''}`}>
            {win === 'atom' && <CrownJae />}
            <img src={jae} />
            <div className="jae-popups">
              <span>{contentPopupJae}</span>
            </div>
          </div>
        </div>
        <div>
          <input value={this.state.value} onChange={this.onChangeTest} />
          <select value={this.valueSelect} onChange={this.onChangeSelect}>
            <option value="ethAtom">ethAtom</option>
            <option value="eth">eth</option>
            <option value="atom">atom</option>
          </select>
        </div>
      </div>
    );
  }
}
