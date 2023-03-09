import React, { useEffect, useState } from 'react';
import { Battery, Pane, Heading, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import Tooltip from '../tooltip/tooltip';
import { CYBER } from '../../utils/config';
import { formatCurrency } from '../../utils/utils';

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

const ContentTooltip = ({ bwRemained, bwMaxValue, amounPower, countLink }) => {
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
          <Link to="/search/get BOOT">Get {CYBER.DENOM_CYBER.toUpperCase()}</Link>
        </Text>
      </Pane>
    </Pane>
  );
};

const BandwidthBar = ({
  bwRemained = 0,
  bwMaxValue = 0,
  countLink = 0,
  amounPower,
  ...props
}) => {
  const [linkPrice, setlinkPrice] = useState(4);
  const bwPercent =
    bwMaxValue > 0 ? Math.floor((bwRemained / bwMaxValue) * 100) : 0;

  // useEffect(() => {

  // }, [])

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
        {...props}
        bwPercent={bwPercent}
        bwRemained={bwRemained}
        bwMaxValue={bwMaxValue}
        linkPrice={linkPrice}
      />
    </Tooltip>
  );
};

export default BandwidthBar;
