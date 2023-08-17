/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import DisplayOld from './ContainerGradient';
import { text100, title } from '../../../.storybook/stubs';
import { figmaDisplayUrl } from './Display/storybook.temp';

const meta: Meta<typeof DisplayOld> = {
  component: DisplayOld,
  title: 'Tech debt/Display',
  parameters: {
    design: {
      type: 'figma',
      url: figmaDisplayUrl,
    },
  },
};
export default meta;

type Story = StoryObj<typeof DisplayOld>;

const defaultArgs = {
  title,
  closedTitle: 'Closed title',
  children: text100,
};

export const Default: Story = {
  args: {
    ...defaultArgs,
  },
};

const txs = {
  rawLog: 'tsx log... lorem ipsum dolor sit amet',
  status: 'confirmed',
  txHash: '0x2839283jdkdjsk239320',
};

export const WithTxs: Story = {
  args: {
    ...defaultArgs,
    txs,
  },
};

export const WithTxsError: Story = {
  args: {
    ...defaultArgs,
    txs: {
      ...txs,
      status: 'error',
    },
  },
};
