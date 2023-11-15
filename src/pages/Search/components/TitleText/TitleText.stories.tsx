/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import TitleText from './TitleText';

const meta: Meta<typeof TitleText> = {
  component: TitleText,
  title: 'atoms/TitleText',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TitleText>;

const defaultArgs = {
  title: 'upgrade',
  text: 'your intelligence to superintelligence',
};

export const Main: Story = {
  args: defaultArgs,
};
