/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import NItem from './NItem';

const meta: Meta<typeof NItem> = {
  component: NItem,
  title: 'features/sense/NItem',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof NItem>;
type Props = React.ComponentProps<typeof NItem>;

const defaultArgs: Props = {};

export const Main: Story = {
  args: defaultArgs,
};
