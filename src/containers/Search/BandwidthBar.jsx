import React from 'react';
import { Battery, Pane, Heading, Text } from '@cybercongress/gravity';

const ContentTooltip = ({ bwRemained, bwMaxValue, linkPrice }) => (
  <Pane
    minWidth={200}
    paddingX={18}
    paddingY={14}
    borderRadius={4}
    backgroundColor="#fff"
  >
    <Pane marginBottom={12}>
      <Text size={300}>
        You have {bwRemained} BP out of {bwMaxValue} BP.
      </Text>
    </Pane>
    <Pane marginBottom={12}>
      <Text size={300}>
        Full regeneration of bandwidth points or BP happens in 24 hours.
      </Text>
    </Pane>
    <Pane display="flex" marginBottom={12}>
      <Text size={300}>
        Current rate for 1 cyberlink is
        {linkPrice} BP.
      </Text>
    </Pane>
  </Pane>
);

const BandwidthBar = ({ bwRemained, bwMaxValue, linkPrice }) => {
  const bwPercent = ((bwRemained / bwMaxValue) * 100).toFixed(2);

  return (
    <Pane marginBottom={56}>
      <Heading size={600} color="#fff" marginBottom={24}>
        My bandwidth
      </Heading>
      <Battery
        style={{ height: 16 }}
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
    </Pane>
  );
};

export default BandwidthBar;
