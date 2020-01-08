import React, { Component } from 'react';
import { Speedometer } from './speedometer';
import { Difference } from './statistics';

const vitalik = require('../../image/vitalik.png');
const jae = require('../../image/jae.png');

const popus = [
  {
    atom: {
      win: {
        x0: ['Hey Vitalik, have you heard about IBC?'],
        x2_4: ['Hey Vitalik, have you heard about IBC?'],
        x5_7: ['Hey Vitalik, have you heard about IBC?'],
        x7: ['Hey Vitalik, have you heard about IBC?'],
      },
      loses: {
        x0: [
          'Yeah, I know its very cool, 10 protocol implementations is fucking amazing',
        ],
        x2_4: [
          'Yeah, I know its very cool, 10 protocol implementations is fucking amazing',
        ],
        x5_7: [
          'Yeah, I know its very cool, 10 protocol implementations is fucking amazing',
        ],
        x7: [
          'Yeah, I know its very cool, 10 protocol implementations is fucking amazing',
        ],
      },
    },
    eth: {
      win: {
        x0: ['Hey Jae, We will launch eth2 soon ©'],
        x2_4: ['Hey Jae, We will launch eth2 soon ©'],
        x5_7: ['Hey Jae, We will launch eth2 soon ©'],
        x7: ['Hey Jae, We will launch eth2 soon ©'],
      },
      loses: {
        x0: [
          'Nope, I believe in the biggest computer with cross-shard communications',
        ],
        x2_4: [
          'Nope, I believe in the biggest computer with cross-shard communications',
        ],
        x5_7: [
          'Nope, I believe in the biggest computer with cross-shard communications',
        ],
        x7: [
          'Nope, I believe in the biggest computer with cross-shard communications',
        ],
      },
    },
  },
];

const Crown = () => <div className="crown" />;

const CrownJae = () => <div className="crown-jae" />;

class VitalikJae extends Component {
  onChangeTest = e =>
    this.setState({
      value: e.target.value,
      diff: e.target.value,
    });

  onChangeSelect = e =>
    this.setState({
      valueSelect: e.target.value,
    });

  render() {
    const { win, arow, diff, col, difference } = this.props;
    // const { contentPopupVitalik, contentPopupJae } = this.state;
    // console.log(col.atom);
    let contentPopupVitalik = '!!';
    let contentPopupJae = '112';

    if (win === 'eth') {
      switch (parseInt(diff.diff)) {
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
    } else if (win === 'atom') {
      switch (parseInt(diff.diff)) {
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
          <div className="vitalik">
            {win === 'eth' ? (
              <Crown />
            ) : (
              <Difference
                custom="position-difference-container"
                difference={difference}
              />
            )}
            <img src={vitalik} />
            <div className="vitalik-popups">
              <span>{contentPopupVitalik}</span>
            </div>
          </div>
          {/* <div>{diff}</div> */}
          <Speedometer colEthAtom={col} />
          <div className="jae">
            {win === 'atom' ? (
              <CrownJae />
            ) : (
              <Difference
                custom="position-difference-container"
                difference={difference}
              />
            )}
            <img src={jae} />
            <div className="jae-popups">
              <span>{contentPopupJae}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VitalikJae;
