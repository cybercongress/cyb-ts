import { Meta, StoryObj } from '@storybook/react';
import TabItem, { Position } from './TabItem';
import { useState } from 'react';

const meta: Meta<typeof TabItem> = {
  component: TabItem,
  title: 'atoms/Tabs/TabItem',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TabItem>;

export const Main: Story = {
  args: {
    text: 'default',
    type: undefined,
    onClick: () => {
      console.log('clicked');
    },
  },
};
