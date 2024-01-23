/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import SenseButton from './SenseButton';

const meta: Meta<typeof SenseButton> = {
  component: SenseButton,
  title: 'features/sense/SenseButton',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof SenseButton>;
type Props = React.ComponentProps<typeof SenseButton>;

const defaultArgs: Props = {};

export const Main: Story = {
  args: defaultArgs,
};
