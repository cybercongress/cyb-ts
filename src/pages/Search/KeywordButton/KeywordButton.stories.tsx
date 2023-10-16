/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import KeywordButton from './KeywordButton';

const meta: Meta<typeof KeywordButton> = {
  component: KeywordButton,
  title: 'atoms/KeywordButton',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof KeywordButton>;

const defaultArgs = {
  keyword: 'cyber',
};

export const Main: Story = {
  args: defaultArgs,
};
