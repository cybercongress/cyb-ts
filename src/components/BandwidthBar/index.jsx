import React, { useEffect, useState } from 'react';
import { Battery, Pane, Heading, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';
import { Tooltip } from '..';

const ContentTooltip = ({ bwRemained, bwMaxValue, linkPrice }) => {
  let text =
    'Empty battery. You have no power & energy so you cannot submit cyberlinks. ';

  if (bwMaxValue > 0) {
    text = `You have ${bwRemained} kW left and can immediately submit ${Math.floor(
      bwRemained / linkPrice
    )} cyberlinks. `;
  }
  return (
    <Pane zIndex={4} paddingX={10} paddingY={10} minWidth={200}>
      <Pane marginBottom={12}>
        <Text color="#fff" size={400}>
          {text}
          <Link to="/gol/faucet">
            Get EUL
          </Link>
        </Text>
      </Pane>
    </Pane>
  );
};

const BandwidthBar = ({ bwRemained = 0, bwMaxValue = 0, ...props }) => {
  const [linkPrice, setlinkPrice] = useState(4);
  const bwPercent =
    bwMaxValue > 0 ? Math.floor((bwRemained / bwMaxValue) * 100) : 0;

  // useEffect(() => {

  // }, [])

  return (
    <Tooltip
      placement="bottom"
      tooltip={
        <ContentTooltip
          bwRemained={bwRemained}
          bwMaxValue={bwMaxValue}
          linkPrice={linkPrice}
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
