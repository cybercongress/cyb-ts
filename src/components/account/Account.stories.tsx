/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Account from './account';

const meta: Meta<typeof Account> = {
  component: Account,
  title: 'atoms/Account',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Account>;

const defaultArgs = {
  address: 'bostrom1f5warat4vc0q98k7ygys4saka8u04rfxpmthvl',
  avatar: true,
};

export const Main: Story = {
  args: defaultArgs,
};
