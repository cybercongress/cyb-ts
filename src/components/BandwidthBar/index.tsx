import { useContext, useEffect, useState } from 'react';
import { Battery, Pane, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import Tooltip from '../tooltip/tooltip';
import { CYBER } from '../../utils/config';
import {
  coinDecimals,
  convertResources,
  formatCurrency,
  reduceBalances,
} from '../../utils/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppContext } from '../../context';
import { setBandwidth } from '../../redux/actions/bandwidth';
import React from 'react';

const PREFIXES = [
  {
    prefix: 't',
    power: 10 ** 12,
  },
  {
    prefix: 'g',
    power: 10 ** 9,
  },
  {
    prefix: 'm',
    power: 10 ** 6,
  },
  {
    prefix: 'k',
    power: 10 ** 3,
  },
];

function ContentTooltip({ bwRemained, bwMaxValue, amounPower, countLink }) {
  let text =
    'Empty battery. You have no power & energy so you cannot submit cyberlinks. ';

  if (bwMaxValue > 0) {
    text = `You have ${formatCurrency(
      amounPower,
      'W',
      2,
      PREFIXES
    )} and can immediately submit ${Math.floor(countLink)} cyberlinks. `;
  }
  return (
    <Pane zIndex={4} paddingX={10} paddingY={10} maxWidth={200}>
      <Pane marginBottom={12}>
        <Text color="#fff" size={400}>
          {text}
          <Link to="/search/get BOOT">
            Get {CYBER.DENOM_CYBER.toUpperCase()}
          </Link>
        </Text>
      </Pane>
    </Pane>
  );
}

function BandwidthBar(
  {
    // bwRemained = 0,
    // bwMaxValue = 0,
    // countLink = 0,
    // amounPower,
    // ...props
  }
) {
  const [linkPrice] = useState(4);

  const { jsCyber } = useContext(AppContext);

  const [countLink, setCountLink] = useState(0);
  const [priceLink, setPriceLink] = useState(0.25);

  const [amounPower, setAmounPower] = useState(0);

  const bandwidth = useSelector((state) => state.bandwidth.bandwidth);
  const { defaultAccount } = useSelector((state) => state.pocket);

  const dispatch = useDispatch();

  const bwRemained = bandwidth.remained;
  const bwMaxValue = bandwidth.maxValue;

  const bwPercent =
    bwMaxValue > 0 ? Math.floor((bwRemained / bwMaxValue) * 100) : 0;

  useEffect(() => {
    const getBandwidth = async () => {
      try {
        const { account } = defaultAccount;
        console.log(`account getBandwidth`, account);
        if (
          account !== null &&
          Object.prototype.hasOwnProperty.call(account, 'cyber') &&
          jsCyber !== null
        ) {
          const { bech32: cyberBech32 } = account.cyber;
          const responseAccountBandwidth = await jsCyber.accountBandwidth(
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
  }, [defaultAccount, location.pathname, priceLink, jsCyber]);

  useEffect(() => {
    const getPrice = async () => {
      if (jsCyber !== null) {
        const response = await jsCyber.price();
        setPriceLink(coinDecimals(response.price.dec));
      }
    };
    getPrice();
  }, [jsCyber]);

  useEffect(() => {
    const getAmounPower = async () => {
      try {
        const { account } = defaultAccount;
        if (
          account !== null &&
          Object.prototype.hasOwnProperty.call(account, 'cyber') &&
          jsCyber !== null
        ) {
          const { bech32 } = account.cyber;
          const allBalances = await jsCyber.getAllBalances(bech32);
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
  }, [jsCyber, defaultAccount]);

  return (
    <Tooltip
      placement="bottom"
      trigger="click"
      tooltip={
        <ContentTooltip
          bwRemained={bwRemained}
          bwMaxValue={bwMaxValue}
          linkPrice={linkPrice}
          countLink={countLink}
          amounPower={amounPower}
        />
      }
    >
      <Battery
        // {...props}
        height="10px"
        // // styleText={{ display: 'none' }}
        fontSize={12}
        colorText="#000"
        bwPercent={bwPercent}
        bwRemained={bwRemained}
        bwMaxValue={bwMaxValue}
        linkPrice={linkPrice}
      />
    </Tooltip>
  );
}

export default BandwidthBar;
