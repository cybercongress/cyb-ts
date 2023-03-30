import React from 'react';
import { trimString } from '../../utils/utils';

const voltImg = require('../../image/lightning2.png');
const amperImg = require('../../image/light.png');
const hydrogen = require('../../image/hydrogen.svg');
const tocyb = require('../../image/boot.png');
const boot = require('../../image/large-green.png');
const downOutline = require('../../image/chevronDownOutline.svg');
const gol = require('../../image/seedling.png');
const atom = require('../../image/cosmos-2.svg');
const eth = require('../../image/Ethereum_logo_2014.svg');
const pool = require('../../image/gravitydexPool.png');
const ibc = require('../../image/ibc-unauth.png');
const cosmos = require('../../image/cosmos-2.svg');
const osmosis = require('../../image/osmosis.svg');
const pussy = require('../../image/large-purple-circle.png');
const customNetwork = require('../../image/large-orange-circle.png');

function ValueImg({
  text,
  onlyImg,
  onlyText,
  marginImg,
  marginContainer,
  justifyContent,
  zIndexImg,
  flexDirection,
  size,
  type,
  ...props
}) {
  let img = null;
  let textCurency = text;

  switch (text) {
    case 'millivolt':
      img = voltImg;
      textCurency = 'V';
      break;

    case 'milliampere':
      img = amperImg;
      textCurency = 'A';
      break;

    case 'hydrogen':
      img = hydrogen;
      textCurency = 'H';
      break;

    case 'liquidpussy':
      img = hydrogen;
      textCurency = 'LP';
      break;

    case 'boot':
      img = boot;
      textCurency = 'BOOT';
      break;

    case 'tocyb':
      img = tocyb;
      textCurency = 'TOCYB';
      break;

    case 'choose':
      img = downOutline;
      textCurency = 'choose';
      break;

    case 'GOL':
      img = gol;
      textCurency = 'GOL';
      break;

    case 'ATOM':
    case 'atom':
      img = atom;
      textCurency = 'ATOM';
      break;

    case 'eth':
      img = eth;
      textCurency = 'ETH';
      break;

    case 'cosmos':
      img = cosmos;
      textCurency = 'cosmos';
      break;

    case 'bostrom':
      img = boot;
      textCurency = 'bostrom';
      break;

    case 'osmo':
    case 'OSMO':
      img = osmosis;
      textCurency = 'OSMO';
      break;

    case 'osmosis':
      img = osmosis;
      textCurency = 'osmosis';
      break;

    case 'pussy':
    case 'PUSSY':
      img = pussy;
      textCurency = 'PUSSY';
      break;

    case 'space-pussy':
      img = pussy;
      textCurency = 'space-pussy';
      break;

    default:
      if (text.includes('pool')) {
        textCurency = trimString(text, 3, 3);
        img = pool;
        break;
      } else if (text.includes('ibc')) {
        textCurency = trimString(text, 3, 3);
        img = ibc;
        break;
      } else if (text.length > 32) {
        textCurency = text.slice(0, 32);
        img = customNetwork;
        break;
      } else {
        textCurency = text;
        img = customNetwork;
        break;
      }
  }

  if (type && type === 'pool') {
    img = pool;
  }
  if (type && type === 'ibc') {
    img = ibc;
  }

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: justifyContent || 'flex-start',
        margin: marginContainer || 0,
        flexDirection: flexDirection || 'unset',
      }}
      {...props}
    >
      {!onlyImg && (
        <span
          style={{
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
          }}
        >
          {textCurency}
        </span>
      )}
      {!onlyText && img !== null && (
        // <Tooltip placement="top" tooltip={<div>{textCurency}</div>}>
        <img
          style={{
            margin: marginImg || 0,
            width: size || 20,
            height: size || 20,
            // objectFit: 'cover',
            zIndex: zIndexImg || 0,
          }}
          src={img}
          alt="text"
        />
        // </Tooltip>
      )}
    </div>
  );
}

export default ValueImg;
