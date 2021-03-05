import { x, p } from './list';

const dataDiscount = (caps, data3d) => [
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
    hovertemplate:
      'Price: %{y:.2f%} ETH/GCYB<br>' +
      'Tokens claimed: %{x} GCYB<br>' +
      `Cap: ${caps} ETH` +
      '<extra></extra>',
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
    hovertemplate:
      'Price: %{y:.2f%} ETH/GCYB<br>' +
      'Tokens claimed: %{x} GCYB<br>' +
      `Cap: ${caps} ETH` +
      '<extra></extra>',
  },
];

const layout = (size, width, height, margin) => ({
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
      text: `Price, ETH/GCYB`,
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
});

const config = {
  displayModeBar: false,
  scrollZoom: false,
  showSendToCloud: true,
};

export { layout, config, dataDiscount };
