/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import _Component from './_Component';

const meta: Meta<typeof _Component> = {
  component: _Component,
  title: 'atoms/_Component',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof _Component>;
type Props = React.ComponentProps<typeof _Component>;

const defaultArgs: Props = {};

export const Main: Story = {
  args: defaultArgs,
};
