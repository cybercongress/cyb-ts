/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Display from './Display';
import { text100, title } from '../../../../.storybook/stubs';
import { figmaDisplayUrl } from './storybook.temp';

const meta: Meta<typeof Display> = {
  component: Display,
  title: 'atoms/display/Display',
  parameters: {
    design: {
      type: 'figma',
      url: figmaDisplayUrl,
    },
  },
};
export default meta;

type Story = StoryObj<typeof Display>;

const defaultArgs = {
  children: text100,
};

export const Main: Story = {
  args: defaultArgs,
};

export const WithTitle: Story = {
  args: {
    ...defaultArgs,
    titleProps: {
      title,
    },
  },
};

export const Vertical: Story = {
  args: {
    ...defaultArgs,
    isVertical: true,
  },
};
