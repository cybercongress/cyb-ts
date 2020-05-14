import React, { Component } from 'react';
import Plotly from 'react-plotly.js';
import { x, cap, p } from '../../utils/list';
import { CYBER } from '../../utils/config';
import { formatNumber } from '../../utils/utils';

const { DENOM_CYBER_G, DENOM_CYBER } = CYBER;

class Dinamics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      caps: '',
    };
  }

  plotlyHover = dataPoint => {
    const { cap: capProps } = this.props;
    try {
      if (dataPoint.points[0]) {
        if (x.indexOf(dataPoint.points[0].x) !== -1) {
          const capPoint = cap[x.indexOf(dataPoint.points[0].x)];
          this.setState({
            caps: formatNumber(capPoint),
          });
        } else {
          this.setState({
            caps: formatNumber(capProps),
          });
        }
      }
    } catch (error) {
      this.setState({
        caps: formatNumber(capProps),
      });
    }
  };

  plotUnhover = () => {
    // const { round, price, volume, distribution } = this.props;
    this.setState({
      caps: '',
    });
  };

  render() {
    const { caps } = this.state;
    const { data3d, dataRewards } = this.props;
    // console.log('data3d', data3d);
    // console.log('dataRewards', dataRewards);

    const dataDiscount = [
      {
        type: 'scatter',
        x,
        y: p,
        opacity: 0.45,
        line: {
          width: 2,
          opacity: 1,
          color: '#fff',
        },
        // hoverinfo: 'none',
        hovertemplate:
          'Price: %{y:.2f%} ATOMs/GCYB<br>' +
          'ATOMs contributed: %{x} ATOMs<br>' +
          `Cap: ${caps} ATOMs` +
          '<extra></extra>',
        // hovertemplate:
        //   'ATOMs contributed: %{x}<br>' +
        //   'Personal discount: %{y:.2f%}%<br>' +
        //   '<extra></extra>'
      },
      {
        type: 'scatter',
        x: data3d.x,
        y: data3d.y,
        line: {
          width: 2,
          color: '#36d6ae',
        },
        // hoverinfo: 'none'
        hovertemplate:
          'Price: %{y:.2f%} ATOMs/GCYB<br>' +
          'ATOMs contributed: %{x} ATOMs<br>' +
          `Cap: ${caps} ATOMs` +
          '<extra></extra>',
      },
    ];

    // const data = [
    //   {
    //     type: 'scatter3d',
    //     mode: 'lines',
    //     opacity: 0.45,
    //     x,
    //     y,
    //     z,
    //     p,
    //     line: {
    //       width: 8,
    //       opacity: 1,
    //       color: '#fff',
    //     },
    //     hovertemplate:
    //       `GCYB allocated: %{x: .2f}<br>` +
    //       'ATOMs contributed: %{y}<br>' +
    //       'Personal discount: %{z:.2f%}%<br>' +
    //       `price: ${price}ATOMs` +
    //       '<extra></extra>',
    //   },
    //   {
    //     type: 'scatter3d',
    //     mode: 'lines',
    //     x: data3d.x,
    //     y: data3d.y,
    //     z: data3d.z,
    //     line: {
    //       width: 8,
    //       color: '#36d6ae',
    //     },
    //     ticks: '',
    //     hovertemplate:
    //       `GCYB allocated: %{x: .2f}<br>` +
    //       'ATOMs contributed: %{y}<br>' +
    //       'Personal discount: %{z:.2f%}%<br>' +
    //       `price: ${price}ATOMs` +
    //       '<extra></extra>',
    //   },
    // ];

    const layout = {
      bargap: 0,
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
        // autotick: true,
        autotick: false,
        dtick: 0.25,
        fixedrange: true,
        title: {
          text: `Price, ATOMs/GCYB`,
        },
        tickfont: {
          color: '#36d6ae',
        },
        gridcolor: '#ffffff66',
        color: '#fff',
        zerolinecolor: '#dedede',
      },
      xaxis: {
        // autotick: true,
        autotick: false,
        dtick: 50000,
        fixedrange: true,
        title: {
          text: `Donation, ATOMs`,
        },
        tickfont: {
          color: '#36d6ae',
        },
        gridcolor: '#ffffff66',
        color: '#fff',
        zerolinecolor: '#dedede',
      },
      width: 890,
      height: 400,
      margin: {
        l: 50,
        r: 50,
        b: 80,
        t: 10,
        pad: 4,
      },
    };
    const config = {
      displayModeBar: false,
      scrollZoom: false,
      showSendToCloud: true,
    };

    return (
      <div className="container-dinamics">
        <Plotly
          data={dataDiscount}
          layout={layout}
          onHover={figure => this.plotlyHover(figure)}
          onUnhover={figure => this.plotUnhover(figure)}
          config={config}
        />
      </div>
    );
  }
}

export default Dinamics;
