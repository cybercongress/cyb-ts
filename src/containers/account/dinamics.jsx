import React from 'react';
import Plotly from 'react-plotly.js';

const color = ['#00e676', '#d500f9', '#00e5ff', '#651fff'];

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
    l: 0,
    r: 0,
    b: 0,
    t: 0,
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
  height: 130,
  width: 130,
  showlegend: false,
};
const config = {
  displayModeBar: false,
  showSendToCloud: true,
};

const Dinamics = ({ data }) => {
  const { available, delegation, unbonding, rewards } = data;

  const dataPlot = [
    {
      values: [available, delegation, unbonding, rewards],
      labels: ['available', 'delegation', 'unbonding', 'rewards'],
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
  return (
    <Plotly
      data={dataPlot}
      layout={layout}
      config={config}
      onLegendClick={() => false}
    />
  );
};

export default Dinamics;
