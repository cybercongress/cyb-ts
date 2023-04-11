// Button.stories.js

import React from 'react';
// import { action } from '@storybook/addon-actions';
import BtnGrd, { Props } from './';

export default {
  title: 'Button',
  component: BtnGrd,
  argTypes: {
    text: { control: 'text' },
    img: { control: 'text' },
    disabled: { control: 'boolean' },
    pending: { control: 'boolean' },
    onClick: { action: 'clicked' },
  },
};

const Template = (args: Props) => <BtnGrd {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Click me',
  // onClick: action('Button clicked'),
};

export const Disabled = Template.bind({});
Disabled.args = {
  children: 'Click me',
  disabled: true,
};

export const Pending = Template.bind({});
Pending.args = {
  children: 'Click me',
  pending: true,
};
