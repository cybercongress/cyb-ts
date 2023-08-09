/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Display from './Display';
import { text100, title } from '../../../../.storybook/stubTexts';

const meta: Meta<typeof Display> = {
  component: Display,
  title: 'atoms/display/Display',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=11052-15684',
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
