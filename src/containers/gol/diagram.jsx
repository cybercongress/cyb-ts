import React from 'react';
import Plotly from 'react-plotly.js';

const color = [
  '#00e676',
  '#3d5afe',
  '#ffea00',
  '#ff3d00',
  '#d500f9',
  '#00e5ff',
  '#651fff',
  '#ffc400',
];

const data = [
  {
    values: [60, 15, 6, 5, 5, 5, 2, 2],
    labels: [
      'takeoff donations',
      'relevance',
      'load',
      'delegation',
      'full validator set',
      'euler-4 rewards',
      'lifetime',
      'community pool',
    ],
    textposition: 'inside',
    domain: { column: 1 },
    hoverinfo: 'label+percent',
    hole: 0.4,
    type: 'pie',
    marker: {
      colors: color,
    },
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
  width: 1000,
  // showlegend: false,
};
const config = {
  displayModeBar: false,
  showSendToCloud: true,
};

const Dinamics = () => (
  <Plotly
    data={data}
    layout={layout}
    config={config}
    onLegendClick={() => false}
  />
);

export default Dinamics;
