/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import SenseListItem from './SenseListItem';

const meta: Meta<typeof SenseListItem> = {
  component: SenseListItem,
  title: 'features/sense/SenseListItem',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof SenseListItem>;
type Props = React.ComponentProps<typeof SenseListItem>;

const defaultArgs: Props = {};

export const Main: Story = {
  args: defaultArgs,
};
