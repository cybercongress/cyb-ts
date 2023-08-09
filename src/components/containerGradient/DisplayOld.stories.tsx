/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import DisplayOld from './ContainerGradient';
import { text100, title } from '../../../.storybook/stubTexts';

const meta: Meta<typeof DisplayOld> = {
  component: DisplayOld,
  title: 'atoms/display/DisplayOld(refactor)',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=11052-15684',
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

export const Main: Story = {
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
