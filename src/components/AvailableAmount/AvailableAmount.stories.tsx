import { Meta, StoryObj } from '@storybook/react';
import AvailableAmount from './AvailableAmount';

const meta: Meta<typeof AvailableAmount> = {
  component: AvailableAmount,
  title: 'atoms/AvailableAmount',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof AvailableAmount>;

export const Main: Story = {
  args: {
    title: 'available amount',
    amountToken: 10000,
  },
};
