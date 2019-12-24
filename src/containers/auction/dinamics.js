import React, { Component } from 'react';
import Plotly from 'react-plotly.js';
// import { x, y } from './list';

// const arr = [];
// for (let i = 0, l = 250; i < 300; ++i) {
//   arr.push(Math.floor(Math.random() * (l - 80)) + 80);
// }
Array.prototype.max = function() {
  return Math.max.apply(null, this);
};

export class Dinamics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      price: '',
      volume: '',
      round: '',
      distribution: ''
    };
  }

  // componentDidMount() {
  //   const { round, price, volume, distribution } = this.props;
  //   this.setState({
  //     price,
  //     round,
  //     volume,
  //     distribution
  //   });
  // }

  plotlyHover = dataPoint => {
    // console.log('dataPoint', dataPoint.points[1].y);
    if(dataPoint.points[1]) {
      this.setState({
      price: dataPoint.points[0].y,
      round: dataPoint.points[0].x,
      volume: dataPoint.points[1].y
    });
    }
    
  };

  plotUnhover = () => {
    // const { round, price, volume, distribution } = this.props;
    this.setState({
      price: '',
      round: '',
      volume: '',
      distribution: ''
    });
  };

  render() {
    const { x } = this.props.data;
    const { y } = this.props.data;
    const { x1 } = this.props.data;
    const { price, volume, round, distribution } = this.state;

    /* let x; */
    const _yaxis = y.max() / 0.3;

    const trace1 = {
      type: 'scatter',
      mode: 'line',
      x,
      y: x1,
      line: {
        color: '#36d6ae'
      },
      hovertemplate:
          `price: ${price}` +
          `<br>round: ${round}` +
          `<br>volume, ETH: ${volume}` +

          '<extra></extra>'
      // hoverinfo: 'none'
    };

    const trace2 = {
      opacity: 0.6,
      type: 'bar',
      x,
      y,
      yaxis: 'y2',
      hoverinfo: 'none',
      marker: {
        color: '#36d6ae'
      }
    };

    // var trace1 = {
    //     x: x,
    //     y: y,
    //     // mode: 'lines',
    //     type: 'bar',
    //     name: '2000'
    // };

    const data = [trace1, trace2];

    const layout = {
      bargap: 0,
      paper_bgcolor: '#000',
      plot_bgcolor: '#000',
      showlegend: false,
      hovermode: 'x',
      hoverlabel: {
        bgcolor: '#000',
        font: {
          color: '#fff'
        }
      },
      // scene: {
      yaxis: {
        title: 'Price, ETH/GGOL',
        type: 'linear',
        rangemode: 'tozero',
        ticklen: 10,
        tickcolor: '#000',
        spikemode: 'across',
        showspikes: true,
        side: 'right',
        spikecolor: '#fff',
        spikethickness: 1,
        spikedash: 'solid',
        gridwidth: 1,
        zeroline: false,
        fixedrange: true,
        // bargap:0,
        gridcolor: '#ffffff42',
        titlefont: { color: '#fff' },

        tickfont: {
          color: '#fff',
          size: 10
        }
      },
      yaxis2: {
        title: 'Volume, ETH',
        titlefont: { color: '#fff' },
        tickfont: { color: '#fff', size: 9 },
        overlaying: 'y',
        showgrid: false,
        zeroline: false,
        fixedrange: true,
        showline: false,
        // ticks: '',
        // showticklabels: false,
        range: [0, _yaxis],
        tickfont: {
          color: '#fff',
          size: 10
        }
      },
      xaxis: {

        title: 'Round',
        ticklen: 10,
        tickcolor: '#000',
        range: x,
        tick0: x[0],
        fixedrange: true,
        // dtick: 24*60*60*1000, // 7 days
        spikemode: 'across',
        showspikes: true,
        spikecolor: '#fff',
        spikethickness: 1,
        spikedash: 'solid',
        gridwidth: 1,
        zeroline: false,
        gridcolor: '#ffffff42',
        titlefont: { color: '#fff' },
        tickfont: {
          color: '#fff',
          size: 10
        }
      },

      // }
      // width: 550,
      height: 500
    };
    const config = {
      displayModeBar: false,
      scrollZoom: false,
      responsive: true,
      showSendToCloud: true
    };

    return (
      <div className="container-dinamics">
        {/* <div className="statistics-plot">
          <div>
            price: <span>{price} ETH/GGOL</span>
          </div>
          <div style={{ margin: '0 5px' }}>
            round: <span>{round}</span>
          </div>
          <div>
            volume: <span>{volume} ETH</span>
          </div>
          <div style={{ margin: '0 5px' }}>
            round distribution: <span>{distribution} GGOL</span>
          </div>
        </div> */}
        <Plotly
          data={data}
          layout={layout}
          onHover={figure => this.plotlyHover(figure)}
          onUnhover={figure => this.plotUnhover(figure)}
          config={config}
          style={{
            position: 'relative',
            display: 'block',
            width: '100%'
          }}
        />
      </div>
    );
  }
}
