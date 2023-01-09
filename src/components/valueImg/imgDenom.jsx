import React, { useEffect, useState, useCallback, useContext } from 'react';
import { connect } from 'react-redux';
import { AppContext } from '../../context';
import { getAvatarIpfs } from '../../utils/search/utils';
import { trimString } from '../../utils/utils';
import Tooltip from '../tooltip/tooltip';

const eth = require('../../image/Ethereum_logo_2014.svg');
const pool = require('../../image/gravitydexPool.png');
const ibc = require('../../image/ibc-unauth.png');
const voltImg = require('../../image/lightning2.png');
const amperImg = require('../../image/light.png');
const hydrogen = require('../../image/hydrogen.svg');
const tocyb = require('../../image/boot.png');
const boot = require('../../image/large-green.png');
const defaultImg = require('../../image/large-orange-circle.png');

const getNativeImg = (text) => {
  let img = null;

  switch (text) {
    case 'millivolt':
    case 'V':
      img = voltImg;
      break;

    case 'milliampere':
    case 'A':
      img = amperImg;
      break;

    case 'hydrogen':
    case 'H':
      img = hydrogen;
      break;

    case 'liquidpussy':
    case 'LP':
      img = hydrogen;
      break;

    case 'boot':
    case 'BOOT':
      img = boot;

      break;

    case 'tocyb':
    case 'TOCYB':
      img = tocyb;
      break;

    case 'eth':
    case 'ETH':
      img = eth;
      break;

    default:
      img = defaultImg;
  }
  return img;
};

function ImgDenom({
  coinDenom,
  node,
  marginImg,
  size,
  zIndexImg,
  tooltipStatus,
  infoDenom,
}) {
  const [imgDenom, setImgDenom] = useState(null);
  const [tooltipText, setTooltipText] = useState(coinDenom);

  useEffect(() => {
    if (
      infoDenom &&
      Object.prototype.hasOwnProperty.call(infoDenom, 'coinImageCid')
    ) {
      const { coinImageCid, path, native } = infoDenom;
      if (coinImageCid && coinImageCid.length > 0) {
        getImgFromIpfsByCid(coinImageCid);
      } else if (native) {
        if (coinDenom.includes('pool')) {
          setImgDenom(pool);
          setTooltipText(trimString(coinDenom, 9, 9));
        } else {
          setTooltipText(infoDenom.denom);
          const nativeImg = getNativeImg(coinDenom);
          setImgDenom(nativeImg);
        }
      } else {
        setImgDenom(ibc);
      }

      if (path && path.length > 0) {
        setTooltipText(path);
      }
    } else {
      setImgDenom(defaultImg);
    }
  }, [node, coinDenom, infoDenom]);

  const getImgFromIpfsByCid = useCallback(
    async (cidAvatar) => {
      if (cidAvatar) {
        const responseImg = await getAvatarIpfs(cidAvatar, node);
        if (responseImg && responseImg !== null) {
          setImgDenom(responseImg);
        }
      }
    },
    [node]
  );

  if (tooltipStatus) {
    return (
      <div>
        <Tooltip placement="top" tooltip={<div>{tooltipText}</div>}>
          <img
            style={{
              margin: marginImg || 0,
              width: size || 20,
              height: size || 20,
              // objectFit: 'cover',
              zIndex: zIndexImg || 0,
            }}
            src={imgDenom !== null ? imgDenom : defaultImg}
            alt="text"
          />
        </Tooltip>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex' }}>
      <img
        style={{
          margin: marginImg || 0,
          width: size || 20,
          height: size || 20,
          // objectFit: 'cover',
          zIndex: zIndexImg || 0,
        }}
        src={imgDenom !== null ? imgDenom : defaultImg}
        alt="text"
      />
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    node: store.ipfs.ipfs,
  };
};

export default connect(mapStateToProps)(ImgDenom);
