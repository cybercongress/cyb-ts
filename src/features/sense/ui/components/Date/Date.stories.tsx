/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Date from './Date';

const meta: Meta<typeof Date> = {
  component: Date,
  title: 'features/sense/Date',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Date>;
type Props = React.ComponentProps<typeof Date>;

const defaultArgs: Props = {
  timestamp: 1703523444483,
};

export const Main: Story = {
  args: defaultArgs,
};
