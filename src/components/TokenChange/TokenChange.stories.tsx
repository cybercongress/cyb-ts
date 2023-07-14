import React from 'react';
import { Meta, Story } from '@storybook/react';
import TokenChange, { Props } from './TokenChange';

export default {
  title: 'Molecules/TokenChange',
  component: TokenChange,
} as Meta;

const Template: Story<Props> = (args) => <TokenChange {...args} />;

export const Default = Template.bind({});
Default.args = {
  total: 1000,
  change: 0,
};

export const Increase = Template.bind({});
Increase.args = {
  total: 1000,
  change: 500,
};

export const Decrease = Template.bind({});
Decrease.args = {
  total: 1000,
  change: -500,
};

export const NoChange = Template.bind({});
NoChange.args = {
  total: 1000,
};
