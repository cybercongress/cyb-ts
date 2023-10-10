/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Links from './Links';

const meta: Meta<typeof Links> = {
  component: Links,
  title: 'atoms/Links',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Links>;

const defaultArgs = {};

export const Main: Story = {
  args: defaultArgs,
};
