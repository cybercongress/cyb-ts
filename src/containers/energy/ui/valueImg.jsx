import React from 'react';

const voltImg = require('../../../image/lightning2.png');
const amperImg = require('../../../image/light.png');

const ValueImg = ({ text, onlyImg }) => {
  let img;

  if (text === 'V') {
    img = voltImg;
  } else {
    img = amperImg;
  }

  return (
    <div style={{ display: 'flex' }}>
      {!onlyImg && <span>{text}</span>}
      <img style={{ width: 20, objectFit: 'contain' }} src={img} alt="text" />
    </div>
  );
};

export default ValueImg;
