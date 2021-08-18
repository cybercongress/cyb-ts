import React from 'react';

const voltImg = require('../../image/lightning2.png');
const amperImg = require('../../image/light.png');
const hydrogen = require('../../image/hydrogen.svg');

const ValueImg = ({ text, onlyImg }) => {
  let img;
  let textCurency = text;

  switch (text) {
    case 'mvolt':
      img = voltImg;
      textCurency = 'V';
      break;

    case 'mamper':
      img = amperImg;
      textCurency = 'A';
      break;

    case 'hydrogen':
      img = hydrogen;
      textCurency = 'H';
      break;

    default:
      textCurency = text;
      img = voltImg;
      break;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {!onlyImg && <span>{textCurency}</span>}
      <img
        style={{
          marginLeft: onlyImg || text === 'hydrogen' ? 4 : 0,
          width: 20,
          height: 20,
          objectFit: 'contain',
        }}
        src={img}
        alt="text"
      />
    </div>
  );
};

export default ValueImg;
