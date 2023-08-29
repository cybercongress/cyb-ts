/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import $Component from './$Component';

const meta: Meta<typeof $Component> = {
  component: $Component,
  title: 'atoms/$Component',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof $Component>;

const defaultArgs = {};

export const Main: Story = {
  args: defaultArgs,
};
