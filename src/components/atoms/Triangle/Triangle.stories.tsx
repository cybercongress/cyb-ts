/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Triangle from './Triangle';

const meta: Meta<typeof Triangle> = {
  component: Triangle,
  title: 'atoms/Triangle',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Triangle>;
type Props = React.ComponentProps<typeof Triangle>;

const defaultArgs: Props = {};

export const Main: Story = {
  args: defaultArgs,
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
