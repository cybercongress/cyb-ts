import { useEffect, useState, useCallback } from 'react';
import {
  isNativeChainId,
  useTraseNetworks,
} from '../../hooks/useTraseNetworks';
import Tooltip from '../tooltip/tooltip';

import boot from '../../image/large-green.png';
import pussy from '../../image/large-purple-circle.png';
import eth from 'images/Ethereum_logo_2014.svg';
import osmo from 'images/osmosis.svg';
import cosmos from 'images/cosmos-2.svg';
import terra from 'images/terra.svg';
import defaultImg from '../../image/large-orange-circle.png';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';

// maybe reuse enum from DenomArr
const getNativeImg = (text) => {
  let img = null;

  switch (text) {
    case 'bostrom':
      img = boot;
      break;

    case 'space-pussy':
      img = pussy;
      break;

    case 'eth':
      img = eth;
      break;

    case 'cosmos':
      img = cosmos;
      break;

    case 'osmo':
      img = osmo;
      break;

    case 'terra':
      img = terra;
      break;

    default:
      img = defaultImg;
  }
  return img;
};

function ImgNetwork({ network, marginImg, size, zIndexImg, tooltipStatus }) {
  const { chainInfo } = useTraseNetworks(network);
  const [imgDenom, setImgDenom] = useState(null);
  const [tooltipText, setTooltipText] = useState(network);

  const { fetchWithDetails } = useQueueIpfsContent();

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainInfo, network]);

  const getImgFromIpfsByCid = useCallback(
    async (cidAvatar) => {
      if (cidAvatar && fetchWithDetails) {
        return fetchWithDetails(cidAvatar, 'image').then(
          (details) => details?.content && setImgDenom(details?.content)
        );
      }
      return null;
    },
    [fetchWithDetails]
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

export default ImgNetwork;
