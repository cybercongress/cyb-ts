/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import InputNumber from './InputNumber';

const meta: Meta<typeof InputNumber> = {
  component: InputNumber,
  title: 'Atoms/Input/InputNumber',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=11052-15433',
    },
  },
};
export default meta;

type Story = StoryObj<typeof InputNumber>;

const defaultArgs = {
  value: 1100000000,
  onValueChange: () => {},
};

export const Main: Story = {
  args: defaultArgs,
};

export const withMax: Story = {
  args: { ...defaultArgs, maxValue: 1000000000000 },
};
