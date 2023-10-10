/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Rank from './rank';
import stub from '../search/Spark/stub';

const meta: Meta<typeof Rank> = {
  component: Rank,
  title: 'Molecules/Spark/Rank',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Rank>;

const defaultArgs = {
  hash: stub.particle,
  rank: 1,
};

export const Main: Story = {
  args: defaultArgs,
  decorators: [
    (Story) => (
      <div style={{ width: '100px', height: '100px', position: 'relative' }}>
        <Story />
      </div>
    ),
  ],
};
