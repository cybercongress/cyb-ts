import React, { Component } from 'react';
import Plotly from 'react-plotly.js';
import { x, y, z } from '../../utils/list';

class Dinamics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      general: true,
      share: false,
      discount: false,
      rewards: false,
      activebtn: 'general',
      center: {
        x: 0,
        y: 0,
        z: 0,
      },
      eye: {
        x: 1,
        y: 0,
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
      general: true,
      discount: false,
      rewards: false,
      activebtn: 'general',
      center: {
        x: 0,
        y: 0,
        z: 0,
      },
      eye: {
        x: 1,
        y: 0,
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
      general: false,
      discount: false,
      rewards: false,
      textX: 'Donation, ATOMs',
      textY: 'CYBs won, TCYBs',
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4,
      },
    });
  };

  state3 = () => {
    this.setState({
      share: false,
      general: false,
      discount: true,
      rewards: false,
      activebtn: 'discount',
      textX: 'Donation, ATOMs',
      textY: 'Discount, %',
      margin: {
        l: 50,
        r: 50,
        b: 50,
        t: 50,
        pad: 4,
      },
    });
  };

  state4 = () => {
    this.setState({
      share: false,
      general: false,
      discount: false,
      rewards: true,
      activebtn: 'rewards',
      textX: 'Donation, ATOMs',
      textY: 'Price, ATOMs/CYB',
      margin: {
        l: 60,
        r: 50,
        b: 50,
        t: 50,
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
      general,
      share,
      discount,
      rewards,
    } = this.state;
    const { data3d, dataRewards } = this.props;
    // console.log('data3d', data3d);
    // console.log('dataRewards', dataRewards);
    let _yaxis = 0;
    let _xaxis = 0;
    if (dataRewards[0] !== undefined) {
      _yaxis = dataRewards[0].y[0] / 0.8;
      _xaxis = 600000 / 0.95;
    }

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
          '<br>TCYB allocated: %{y: .2f}%' +
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
          'TCYB allocated: %{x: .2f}<br>' +
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
          'TCYB allocated: %{x: .2f}<br>' +
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
        autorange: !rewards,
        rangemode: 'normal',
        range: [0, _yaxis],
        title: {
          text: `${textY}`,
        },
        gridcolor: '#ffffff66',
        color: '#fff',
        zerolinecolor: '#dedede',
      },
      xaxis: {
        autotick: true,
        autorange: !rewards,
        title: {
          text: `${textX}`,
        },
        range: [0, _xaxis],
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
            text: 'CYBs won, TCYBs',
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
          x: 2,
          y: 6,
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
      // staticPlot: true
    };

    const Btn = () => (
      <div className="cont-btn">
        <button
          type="button"
          className={`btn-view margin ${
            activebtn === 'general' ? 'activebtn' : ''
          }`}
          onClick={this.state1}
        >
          General
        </button>
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
            activebtn === 'discount' ? 'activebtn' : ''
          }`}
          onClick={this.state3}
        >
          Discount
        </button>
        <button
          type="button"
          className={`btn-view margin ${
            activebtn === 'rewards' ? 'activebtn' : ''
          }`}
          onClick={this.state4}
        >
          My CYBs estimation
        </button>
      </div>
    );

    return (
      <div className="container-dinamics">
        {general && <Plotly data={data} layout={layout} config={config} />}
        {share && <Plotly data={dataShare} layout={layout} config={config} />}
        {discount && (
          <Plotly data={dataDiscount} layout={layout} config={config} />
        )}
        {rewards && (
          <Plotly data={dataRewards} layout={layout} config={config} />
        )}

        <Btn />
      </div>
    );
  }
}

export default Dinamics;
