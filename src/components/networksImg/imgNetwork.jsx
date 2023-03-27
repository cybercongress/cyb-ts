import React, { useEffect, useState, useCallback } from 'react';
import { connect } from 'react-redux';
import {
  isNativeChainId,
  useTraseNetworks,
} from '../../hooks/useTraseNetworks';
import { getAvatarIpfs } from '../../utils/search/utils';
import Tooltip from '../tooltip/tooltip';

import boot from '../../image/large-green.png';
import pussy from '../../image/large-purple-circle.png';
import defaultImg from '../../image/large-orange-circle.png';

const getNativeImg = (text) => {
  let img = null;

  switch (text) {
    case 'bostrom':
      img = boot;
      break;

    case 'space-pussy':
      img = pussy;
      break;

    default:
      img = defaultImg;
  }
  return img;
};

function ImgNetwork({
  network,
  node,
  marginImg,
  size,
  zIndexImg,
  tooltipStatus,
}) {
  const { chainInfo } = useTraseNetworks(network);
  const [imgDenom, setImgDenom] = useState(null);
  const [tooltipText, setTooltipText] = useState(network);

  useEffect(() => {
    if (network && !isNativeChainId(network)) {
      if (Object.prototype.hasOwnProperty.call(chainInfo, 'chainIdImageCid')) {
        const { chainIdImageCid, chainName } = chainInfo;
        if (chainIdImageCid && chainIdImageCid.length > 0) {
          getImgFromIpfsByCid(chainIdImageCid);
        } else {
          setImgDenom(defaultImg);
        }
        setTooltipText(chainName);
      }
    } else {
      setTooltipText(network);
      const nativeImg = getNativeImg(network);
      setImgDenom(nativeImg);
    }
  }, [chainInfo, node, network]);

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

export default connect(mapStateToProps)(ImgNetwork);
