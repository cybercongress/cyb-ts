import { Story, Meta } from '@storybook/react';
import { useState } from 'react';
import CoinDenom, { CoinDenomProps } from './TextDenom';

export default {
  title: 'Atoms/CoinDenom',
  component: CoinDenom,
  argTypes: {
    coinDenom: {
      control: {
        type: 'text',
      },
    },
    infoDenom: {
      control: {
        type: 'object',
      },
    },
    tooltipStatus: {
      control: {
        type: 'boolean',
      },
    },
  },
} as Meta;

const Template: Story<CoinDenomProps> = (args) => {
  return <CoinDenom {...args} tooltipStatus={true} />;
};

export const Default = Template.bind({});
Default.args = {
  coinDenom: 'ATOM',
  infoDenom: null,
};

export const WithInfoDenom = Template.bind({});
WithInfoDenom.args = {
  coinDenom: 'eth',
  infoDenom: {
    denom: 'Ether',
    path: "m/44'/60'/0'/0/0",
    native: false,
  },
};

export const WithPoolDenom = Template.bind({});
WithPoolDenom.args = {
  coinDenom: 'osmosis/pool/123',
  infoDenom: null,
};
