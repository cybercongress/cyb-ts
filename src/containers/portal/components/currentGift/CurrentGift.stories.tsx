import { Meta, Story } from '@storybook/react';
import BigNumber from 'bignumber.js';
import CurrentGift from '.';

const mockGift = {
  amount: '10000000',
  baseAmount: null,
  claim: null,
  isClaimed: false,
  multiplier: null,
  address: 'cyber1p34c7yh5q3wtwde7xq4z4h4md4n0n4v9k9whg6',
  details: {
    Astronaut: { gift: 5 },
    'Average Citizens': { gift: 4 },
    Cyberpunk: { gift: 6 },
    'Extraordinary Hacker': { gift: 7 },
    'Key Opinion Leader': { gift: 8 },
    Devil: { gift: 0 },
    'Master of the Great Web': { gift: 2 },
    'Passionate Investor': { gift: 1 },
    'True Hero of the Great Web': { gift: 3 },
  },
};

const mockTotalGiftAmount = {
  amount: '5000000000',
  claim: null,
};

const mockTotalGiftClaimed = {
  amount: '2500000000',
  claim: null,
};

const mockSelectedAddress = 'cyber1p34c7yh5q3wtwde7xq4z4h4md4n0n4v9k9whg6';

const mockValueTextResult = 'claimable';

const mockCurrentBonus = new BigNumber(1.5);

export default {
  title: 'Features/Gift/CurrentGift',
  component: CurrentGift,
} as Meta;

const Template: Story = (args) => (
  <CurrentGift
    {...args}
    currentGift={mockGift}
    currentBonus={{ current: mockCurrentBonus }}
    stateOpen
    selectedAddress={mockSelectedAddress}
    initStateCard={{ lamp: 'green' }}
    totalGiftClaimed={mockTotalGiftClaimed}
    totalGiftAmount={mockTotalGiftAmount}
    title="Congratulations!"
    valueTextResult={mockValueTextResult}
  />
);

export const Default = Template.bind({});
