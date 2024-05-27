import { useEffect, useState, useCallback } from 'react';

import eth from 'images/Ethereum_logo_2014.svg';
import pool from 'images/gravitydexPool.png';
import ibc from 'images/ibc-unauth.png';
import voltImg from 'images/lightning2.png';
import amperImg from 'images/light.png';
import hydrogen from 'images/hydrogen.svg';
import tocyb from 'images/boot.png';
import boot from 'images/large-green.png';
import pussy from 'images/large-purple-circle.png';
import defaultImg from 'images/large-orange-circle.png';
import Tooltip from '../tooltip/tooltip';
import { trimString } from '../../utils/utils';
import useQueueIpfsContent from 'src/hooks/useQueueIpfsContent';
import styles from './TextDenom.module.scss';

// maybe reuse enum from DenomArr
const nativeImageMap = {
  millivolt: voltImg,
  v: voltImg,
  milliampere: amperImg,
  a: amperImg,
  hydrogen,
  h: hydrogen,
  liquidpussy: hydrogen,
  lp: hydrogen,
  boot,
  pussy,
  tocyb,
  eth,
};

const getNativeImg = (text: string) => {
  return nativeImageMap[text.toLowerCase()] || defaultImg;
};

type ImgDenomProps = {
  coinDenom: string;
  marginImg?: number;
  size?: number;
  zIndexImg?: number;
  tooltipStatus: boolean;
  infoDenom?: {
    coinImageCid?: string;
    path?: string;
    native?: boolean;
    denom?: string;
  };
};

function ImgDenom({
  coinDenom,
  marginImg,
  size,
  zIndexImg,
  tooltipStatus,
  infoDenom,
}: ImgDenomProps) {
  const [imgDenom, setImgDenom] = useState<string>();
  const [tooltipText, setTooltipText] = useState<string>(coinDenom);
  const { fetchWithDetails } = useQueueIpfsContent();

  const getImgFromIpfsByCid = useCallback(
    async (cidAvatar: string) => {
      if (cidAvatar && fetchWithDetails) {
        return fetchWithDetails(cidAvatar, 'image').then(
          (details) => details?.content && setImgDenom(details?.content)
        );
      }
      return null;
    },
    [fetchWithDetails]
  );

  useEffect(() => {
    if (
      infoDenom &&
      Object.prototype.hasOwnProperty.call(infoDenom, 'coinImageCid')
    ) {
      const { coinImageCid, path, native } = infoDenom;
      if (coinImageCid && fetchWithDetails) {
        getImgFromIpfsByCid(coinImageCid);
      } else if (native) {
        if (coinDenom.includes('pool')) {
          setImgDenom(pool);
          setTooltipText(trimString(coinDenom, 9, 9));
        } else {
          if (infoDenom.denom) {
            setTooltipText(infoDenom.denom);
          }

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
      setImgDenom(getNativeImg(coinDenom));
    }
  }, [coinDenom, infoDenom, fetchWithDetails, getImgFromIpfsByCid]);

  const img = (
    <img
      style={{
        margin: marginImg || 0,
        width: size || 20,
        height: size || 20,
        zIndex: zIndexImg || 0,
        verticalAlign: 'middle',
      }}
      src={imgDenom || defaultImg}
      alt="text"
    />
  );

  if (tooltipStatus) {
    return (
      <div>
        <Tooltip
          placement="top"
          tooltip={<div className={styles.denom}>{tooltipText}</div>}
        >
          {img}
        </Tooltip>
      </div>
    );
  }

  return <div style={{ display: 'flex' }}>{img}</div>;
}

export default ImgDenom;
