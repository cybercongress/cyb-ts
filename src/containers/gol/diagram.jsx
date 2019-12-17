import React from 'react';
import Plotly from 'react-plotly.js';

const data = [
  {
    values: [100, 100, 20, 10, 2, 1],
    labels: ['Takeoff', 'Gifts', 'Euler-4', 'GOL', 'Community', 'Tot'],
    textposition: 'inside',
    domain: { column: 1 },
    hoverinfo: 'label+percent',
    hole: 0.4,
    type: 'pie',
  },
];
const layout = {
  bargap: 0,
  paper_bgcolor: '#000',
  plot_bgcolor: '#000',
  legend: {
    font: {
      family: 'sans-serif',
      size: 20,
      color: '#fff',
    },
  },
  margin: {
    l: 50,
    r: 50,
    b: 50,
    t: 50,
    pad: 4,
  },
  // showlegend: false,
  annotations: [
    {
      font: {
        size: 20,
      },
      showarrow: false,
      text: '',
      x: 0.82,
      y: 0.5,
    },
  ],
  // height: 400,
  // width: 600,
  // showlegend: false,
};
const config = {
  displayModeBar: false,
  responsive: true,
  showSendToCloud: true,
};

const Dinamics = () => <Plotly data={data} layout={layout} config={config} />;

export default Dinamics;
