import { Meta, StoryObj } from '@storybook/react';
import TabButton from './TabButton';

const meta: Meta<typeof TabButton> = {
  component: TabButton,
  title: 'atoms/TabButton',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TabButton>;

const configTabButton = [
  {
    to: '',
    key: 'left',
  },
  {
    to: '',
    key: 'default',
  },
  {
    to: '',
    key: 'right',
  },
];

export const Main: Story = {
  args: {
    options: configTabButton,
    selected: configTabButton[1].key,
  },
};
