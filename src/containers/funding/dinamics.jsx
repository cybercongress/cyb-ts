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
      width: 890,
      height: 350,
      size: 16,
      margin: {
        l: 40,
        r: 20,
        b: 40,
        t: 10,
        pad: 4,
      },
    };
  }

  componentDidMount() {
    const { mobile } = this.props;
    if (mobile) {
      this.setState({
        width: 360,
        height: 250,
        size: 14,
        margin: {
          l: 30,
          r: 8,
          b: 35,
          t: 0,
          pad: 2,
        },
      });
    }
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
    const { caps, width, height, size, margin } = this.state;
    const { data3d, dataRewards } = this.props;
    // console.log('data3d', data3d);
    // console.log('dataRewards', dataRewards);

    const dataDiscount = [
      {
        mode: 'line',
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
          'Price: %{y:.2f%} ATOM/GCYB<br>' +
          'Tokens claimed: %{x} GCYB<br>' +
          `Cap: ${caps} ATOM` +
          '<extra></extra>',
        // hovertemplate:
        //   'ATOM contributed: %{x}<br>' +
        //   'Personal discount: %{y:.2f%}%<br>' +
        //   '<extra></extra>'
      },
      {
        type: 'scatter',
        mode: 'lines',
        line: {
          color: '#36d6ae',
          width: 3,
        },
        x: data3d.x,
        y: data3d.y,
        // hoverinfo: 'none'
        hovertemplate:
          'Price: %{y:.2f%} ATOM/GCYB<br>' +
          'Tokens claimed: %{x} GCYB<br>' +
          `Cap: ${caps} ATOM` +
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
    //       'ATOM contributed: %{y}<br>' +
    //       'Personal discount: %{z:.2f%}%<br>' +
    //       `price: ${price}ATOM` +
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
    //       'ATOM contributed: %{y}<br>' +
    //       'Personal discount: %{z:.2f%}%<br>' +
    //       `price: ${price}ATOM` +
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
        autotick: true,
        fixedrange: true,
        title: {
          text: `Price, ATOM/GCYB`,
        },
        tickfont: {
          color: '#36d6ae',
        },
        titlefont: {
          size,
        },
        gridcolor: '#ffffff66',
        color: '#fff',
        zerolinecolor: '#dedede',
      },
      xaxis: {
        autotick: true,
        fixedrange: true,
        title: {
          text: `Tokens claimed, GCYB`,
        },
        titlefont: {
          size,
        },
        tickfont: {
          color: '#36d6ae',
        },
        gridcolor: '#ffffff66',
        color: '#fff',
        zerolinecolor: '#dedede',
      },
      width,
      height,
      margin,
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
