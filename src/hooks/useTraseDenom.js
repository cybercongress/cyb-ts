import { useContext, useEffect, useState } from 'react';
import { AppContext } from '../context';
import { isNative, findDenomInTokenList } from '../utils/utils';

export const useTraseDenom = (denomTrase) => {
  const { ibcDataDenom } = useContext(AppContext);
  const [infoDenom, setInfoDenom] = useState({
    denom: denomTrase,
    coinDecimals: 0,
    path: '',
    coinImageCid: '',
  });

  useEffect(() => {
    if (ibcDataDenom !== null) {
      if (!isNative(denomTrase)) {
        if (Object.prototype.hasOwnProperty.call(ibcDataDenom, denomTrase)) {
          const { baseDenom, sourceChannelId: sourceChannelIFromPath } =
            ibcDataDenom[denomTrase];
          const denomInfoFromList = findDenomInTokenList(baseDenom);

          let infoDenomTemp = {
            denom: baseDenom,
            coinDecimals: 0,
            path: sourceChannelIFromPath,
            coinImageCid: '',
          };

          if (denomInfoFromList !== null) {
            const { denom, counterpartyChainId, coinImageCid, coinDecimals } =
              denomInfoFromList;

            infoDenomTemp = {
              denom,
              coinDecimals,
              coinImageCid,
              path: `${counterpartyChainId}/${sourceChannelIFromPath}`,
            };
          }
          setInfoDenom((item) => ({ ...item, ...infoDenomTemp }));
        }
      } else {
        let infoDenomTemp = {
          denom: denomTrase.toUpperCase(),
          coinDecimals: 0,
        };
        const denomInfoFromList = findDenomInTokenList(denomTrase);

        if (denomInfoFromList !== null) {
          const { denom, coinDecimals } = denomInfoFromList;
          infoDenomTemp = {
            denom,
            coinDecimals,
          };
        }
        setInfoDenom((item) => ({ ...item, ...infoDenomTemp }));
      }
    }
  }, [ibcDataDenom, denomTrase]);

  return { infoDenom };
};
