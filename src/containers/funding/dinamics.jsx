import React, { Component } from 'react';
import Plotly from 'react-plotly.js';
import { x, y, z } from '../../utils/list';
import { CYBER } from '../../utils/config';

const { DENOM_CYBER_G, DENOM_CYBER } = CYBER;

class Dinamics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      main: true,
      share: false,
      discount: false,
      rewards: false,
      activebtn: 'main',
      center: {
        x: 0,
        y: -0.4,
        z: -1.5,
      },
      eye: {
        x: 1,
        y: -0.4,
        z: -5,
      },
      up: {
        x: 0,
        y: 0,
        z: 1,
      },
      textX: 'x',
      textY: 'y',
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 4,
      },
    };
  }

  state1 = () => {
    this.setState({
      share: false,
      main: true,
      discount: false,
      rewards: false,
      activebtn: 'main',
      center: {
        x: 0,
        y: -0.4,
        z: -1.5,
      },
      eye: {
        x: 1,
        y: -0.4,
        z: -5,
      },
      up: {
        x: 0,
        y: 0,
        z: 1,
      },
      margin: {
        l: 0,
        r: 0,
        b: 0,
        t: 0,
        pad: 4,
      },
    });
  };

  state2 = () => {
    this.setState({
      activebtn: 'share',
      share: true,
      main: false,
      discount: false,
      rewards: false,
      textX: 'Donation, ATOMs',
      textY: `${DENOM_CYBER.toLocaleUpperCase()}s won, ${(
        DENOM_CYBER_G + DENOM_CYBER
      ).toLocaleUpperCase()}`,
      margin: {
        l: 50,
        r: 50,
        b: 80,
        t: 10,
        pad: 4,
      },
    });
  };

  state3 = () => {
    this.setState({
      share: false,
      main: false,
      discount: true,
      rewards: false,
      activebtn: 'discount',
      textX: 'Donation, ATOMs',
      textY: 'Discount, %',
      margin: {
        l: 50,
        r: 50,
        b: 80,
        t: 10,
        pad: 4,
      },
    });
  };

  render() {
    const {
      center,
      eye,
      up,
      activebtn,
      // data,
      textX,
      textY,
      margin,
      main,
      share,
      discount,
      rewards,
    } = this.state;
    const { data3d, dataRewards } = this.props;
    // console.log('data3d', data3d);
    // console.log('dataRewards', dataRewards);

    const dataShare = [
      {
        type: 'scatter',
        mode: 'lines+points',
        opacity: 0.45,
        x: y,
        y: x,
        line: {
          width: 2,
          opacity: 1,
          color: '#fff',
        },
        hoverinfo: 'none',
        // hovertemplate:
        //   'ATOMs contributed: %{x}' +
        //   '<br>TCYB allocated: %{y: .2f}%' +
        //   '<extra></extra>'
      },
      {
        type: 'scatter',
        mode: 'lines+points',
        x: data3d.y,
        y: data3d.x,
        line: {
          width: 2,
          color: '#36d6ae',
        },
        // hoverinfo: 'none'
        hovertemplate:
          'ATOMs contributed: %{x}' +
          `<br>${(
            DENOM_CYBER_G + DENOM_CYBER
          ).toLocaleUpperCase()} allocated: %{y: .2f}%` +
          '<extra></extra>',
      },
    ];

    const dataDiscount = [
      {
        type: 'scatter',
        x: y,
        y: z,
        opacity: 0.45,
        line: {
          width: 2,
          opacity: 1,
          color: '#fff',
        },
        hoverinfo: 'none',
        // hovertemplate:
        //   'ATOMs contributed: %{x}<br>' +
        //   'Personal discount: %{y:.2f%}%<br>' +
        //   '<extra></extra>'
      },
      {
        type: 'scatter',
        x: data3d.y,
        y: data3d.z,
        line: {
          width: 2,
          color: '#36d6ae',
        },
        // hoverinfo: 'none'
        hovertemplate:
          'ATOMs contributed: %{x}<br>' +
          'Personal discount: %{y:.2f%}%<br>' +
          '<extra></extra>',
      },
    ];

    const data = [
      {
        type: 'scatter3d',
        mode: 'lines',
        opacity: 0.45,
        x,
        y,
        z,
        line: {
          width: 8,
          opacity: 1,
          color: '#fff',
        },
        hovertemplate:
          `${(
            DENOM_CYBER_G + DENOM_CYBER
          ).toLocaleUpperCase()} allocated: %{x: .2f}<br>` +
          'ATOMs contributed: %{y}<br>' +
          'Personal discount: %{z:.2f%}%<br>' +
          '<extra></extra>',
      },
      {
        type: 'scatter3d',
        mode: 'lines',
        x: data3d.x,
        y: data3d.y,
        z: data3d.z,
        line: {
          width: 8,
          color: '#36d6ae',
        },
        ticks: '',
        hovertemplate:
          `${(
            DENOM_CYBER_G + DENOM_CYBER
          ).toLocaleUpperCase()} allocated: %{x: .2f}<br>` +
          'ATOMs contributed: %{y}<br>' +
          'Personal discount: %{z:.2f%}%<br>' +
          '<extra></extra>',
      },
    ];

    const layout = {
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      showlegend: false,
      hovermode: 'closest',
      hoverlabel: {
        bgcolor: '#000',
        font: {
          color: '#fff',
        },
      },
      yaxis: {
        autotick: true,
        title: {
          text: `${textY}`,
        },
        tickfont: {
          color: '#36d6ae',
        },
        gridcolor: '#ffffff66',
        color: '#fff',
        zerolinecolor: '#dedede',
      },
      xaxis: {
        autotick: true,
        title: {
          text: `${textX}`,
        },
        tickfont: {
          color: '#36d6ae',
        },
        gridcolor: '#ffffff66',
        color: '#fff',
        zerolinecolor: '#dedede',
      },
      scene: {
        dragmode: false,
        yaxis: {
          autotick: false,
          dtick: 50000,
          title: {
            text: 'Donation, ATOMs',
          },
          gridcolor: '#dedede',
          color: '#fff',
          tickfont: {
            color: '#36d6ae',
          },
          zerolinecolor: '#000',
        },
        xaxis: {
          autotick: false,
          dtick: 1,
          tickcolor: '#000',
          title: {
            text: `${DENOM_CYBER.toLocaleUpperCase()} won, ${(
              DENOM_CYBER_G + DENOM_CYBER
            ).toLocaleUpperCase()}s`,
          },
          gridcolor: '#dedede',
          color: '#fff',
          tickfont: {
            color: '#36d6ae',
          },
          zerolinecolor: '#000',
        },
        zaxis: {
          title: {
            text: 'Discount, %',
          },
          gridcolor: '#dedede',
          // autorange: 'reversed',
          color: '#fff',
          tickfont: {
            color: '#36d6ae',
          },
          zerolinecolor: '#000',
        },
        aspectratio: {
          x: 2.6,
          y: 6.5,
          z: 2,
        },
        font: {
          family: 'Play',
        },
        camera: {
          center,
          up,
          eye,
        },
      },
      width: 890,
      height: 400,
      margin,
    };
    const config = {
      displayModeBar: false,
      // scrollZoom: false
      // staticPlot: true,
    };

    const Btn = () => (
      <div className="cont-btn">
        <div
          style={{
            left: '50%',
            position: 'absolute',
            transform: 'translate(-50%, 0)',
            display: 'flex',
          }}
        >
          <button
            type="button"
            className={`btn-view margin ${
              activebtn === 'share' ? 'activebtn' : ''
            }`}
            onClick={this.state2}
          >
            Share
          </button>
          <button
            type="button"
            className={`btn-view margin ${
              activebtn === 'main' ? 'activebtn' : ''
            }`}
            onClick={this.state1}
          >
            Main
          </button>
          <button
            type="button"
            className={`btn-view margin ${
              activebtn === 'discount' ? 'activebtn' : ''
            }`}
            onClick={this.state3}
          >
            Discount
          </button>
        </div>
      </div>
    );

    return (
      <div className="container-dinamics">
        <Btn />

        {main && <Plotly data={data} layout={layout} config={config} />}
        {share && <Plotly data={dataShare} layout={layout} config={config} />}
        {discount && (
          <Plotly data={dataDiscount} layout={layout} config={config} />
        )}
      </div>
    );
  }
}

export default Dinamics;
