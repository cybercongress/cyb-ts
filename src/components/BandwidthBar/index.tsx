import { Battery } from '@cybercongress/gravity';
import React, { ComponentProps, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useQueryClient } from 'src/contexts/queryClient';
import { useAppDispatch, useAppSelector } from 'src/redux/hooks';
import { setBandwidth } from '../../redux/actions/bandwidth';
import {
  coinDecimals,
  convertResources,
  reduceBalances,
} from '../../utils/utils';
import Tooltip from '../tooltip/tooltip';
import ContentTooltip from './ContentTooltip';

interface BandwidthBarProps {
  tooltipPlacement: ComponentProps<typeof Tooltip>['placement'];
}

function BandwidthBar({ tooltipPlacement }: BandwidthBarProps) {
  const [linkPrice] = useState(4);
  const location = useLocation();
  const queryClient = useQueryClient();

  const [countLink, setCountLink] = useState(0);
  const [priceLink, setPriceLink] = useState(0.25);

  const [amounPower, setAmounPower] = useState(0);

  const bandwidth = useAppSelector((state) => state.bandwidth.bandwidth);
  const { defaultAccount } = useAppSelector((state) => state.pocket);

  const dispatch = useAppDispatch();

  const bwRemained = bandwidth.remained;
  const bwMaxValue = bandwidth.maxValue;

  const bwPercent =
    bwMaxValue > 0 ? Math.floor((bwRemained / bwMaxValue) * 100) : 0;

  useEffect(() => {
    const getBandwidth = async () => {
      try {
        const { account } = defaultAccount;
        if (account !== null && 'cyber' in account && queryClient) {
          const { bech32: cyberBech32 } = account.cyber;
          const responseAccountBandwidth = await queryClient.accountBandwidth(
            cyberBech32
          );

          if (
            responseAccountBandwidth !== null &&
            responseAccountBandwidth.neuronBandwidth
          ) {
            const { maxValue, remainedValue } =
              responseAccountBandwidth.neuronBandwidth;
            dispatch(setBandwidth(remainedValue, maxValue));
            setCountLink(remainedValue / (priceLink * 1000));
          } else {
            dispatch(setBandwidth(0, 0));
            setCountLink(0);
          }
        } else {
          dispatch(setBandwidth(0, 0));
          setCountLink(0);
        }
      } catch (error) {
        dispatch(setBandwidth(0, 0));
        setCountLink(0);
      }
    };
    getBandwidth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultAccount, location.pathname, priceLink, queryClient]);

  useEffect(() => {
    const getPrice = async () => {
      if (queryClient) {
        const response = await queryClient.price();
        setPriceLink(coinDecimals(response.price.dec));
      }
    };
    getPrice();
  }, [queryClient]);

  useEffect(() => {
    const getAmounPower = async () => {
      try {
        const { account } = defaultAccount;
        if (
          account !== null &&
          Object.prototype.hasOwnProperty.call(account, 'cyber') &&
          queryClient
        ) {
          const { bech32 } = account.cyber;
          const allBalances = await queryClient.getAllBalances(bech32);
          const reduceallBalances = reduceBalances(allBalances);
          if (reduceallBalances.milliampere && reduceallBalances.millivolt) {
            const { milliampere, millivolt } = reduceallBalances;
            setAmounPower(
              convertResources(milliampere) * convertResources(millivolt)
            );
          }
        } else {
          setAmounPower(0);
        }
      } catch (error) {
        setAmounPower(0);
      }
    };
    getAmounPower();
  }, [queryClient, defaultAccount]);

  return (
    <Tooltip
      placement={tooltipPlacement || 'bottom'}
      tooltip={
        <ContentTooltip
          bwMaxValue={bwMaxValue}
          countLink={countLink}
          amounPower={amounPower}
        />
      }
    >
      <Battery
        height="10px"
        fontSize={12}
        maxWidth={75}
        colorText="#000"
        bwPercent={bwPercent}
        bwRemained={bwRemained}
        bwMaxValue={bwMaxValue}
        linkPrice={linkPrice}
      />
    </Tooltip>
  );
}

export default React.memo(BandwidthBar);
