import { Meta, StoryObj } from '@storybook/react';
import Dot from './Dot';

const meta: Meta<typeof Dot> = {
  component: Dot,
  title: 'atoms/Dot',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Dot>;

export const Main: Story = {
  args: {
    color: 'green',
    animation: true,
  },
};
