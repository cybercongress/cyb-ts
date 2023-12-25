/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Message from './Message';

const meta: Meta<typeof Message> = {
  component: Message,
  title: 'features/sense/Message',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Message>;
type Props = React.ComponentProps<typeof Message>;

const defaultArgs: Props = {
  address: 'cyber2i102101280',
  text: 'Hello, world!',
  timestamp: 1703523444483,
};

export const Main: Story = {
  args: defaultArgs,
};
