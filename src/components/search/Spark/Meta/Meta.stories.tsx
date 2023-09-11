/* eslint-disable import/no-unused-modules */

import { Meta as MetaSB, StoryObj } from '@storybook/react';

import Meta from './Meta';
import stub from '../stub';

const meta: MetaSB<typeof Meta> = {
  component: Meta,
  title: 'Molecules/Spark/Meta',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Meta>;

const defaultArgs = {
  cid: stub.particle,
};

export const Main: Story = {
  args: defaultArgs,
};
