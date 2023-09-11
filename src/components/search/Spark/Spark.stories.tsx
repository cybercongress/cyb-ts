/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Spark from './Spark';
import stub from './stub';

const meta: Meta<typeof Spark> = {
  component: Spark,
  title: 'Molecules/Spark',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Spark>;

const defaultArgs = {
  itemData: stub,
  cid: stub.particle,
};

export const Main: Story = {
  args: defaultArgs,
};
