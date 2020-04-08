import React, { useEffect, useState } from 'react';
import { Battery, Pane, Heading, Text } from '@cybercongress/gravity';
import { Link } from 'react-router-dom';

const ContentTooltip = ({ bwRemained, bwMaxValue, linkPrice }) => {
  let text =
    'Empty battery. You have no power & energy so can not submit cyberlinks. ';

  if (bwMaxValue > 0) {
    text = `You have left ${bwRemained} kW and can immediately submit ${Math.floor(
      bwRemained / linkPrice
    )} cyberlinks. `;
  }
  return (
    <Pane
      minWidth={200}
      paddingX={18}
      paddingY={14}
      borderRadius={4}
      backgroundColor="#fff"
    >
      <Pane marginBottom={12}>
        <Text size={300}>
          {text}
          <Link style={{ color: '#068661', fontSize: '14px' }} to="/search/get">
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
    <Battery
      {...props}
      bwPercent={bwPercent}
      bwRemained={bwRemained}
      bwMaxValue={bwMaxValue}
      linkPrice={linkPrice}
      contentTooltip={
        <ContentTooltip
          bwRemained={bwRemained}
          bwMaxValue={bwMaxValue}
          linkPrice={linkPrice}
        />
      }
    />
  );
};

export default BandwidthBar;
