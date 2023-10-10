/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Display from './Display';
import { text100, title } from '../../../../.storybook/stubs';
import { figmaDisplayUrl } from './storybook.temp';
import DisplayTitle from '../DisplayTitle/DisplayTitle';

const meta: Meta<typeof Display> = {
  component: Display,
  title: 'atoms/Display',
  argTypes: {
    status: {
      table: {
        disable: true,
      },
    },
  },
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

export const Horizontal: Story = {
  args: defaultArgs,
};

export const WithTitle: Story = {
  args: {
    ...defaultArgs,
    title: <DisplayTitle title={title} />,
  },
};

export const Vertical: Story = {
  args: {
    ...defaultArgs,
    isVertical: true,
  },
};

export const Left: Story = {
  args: {
    ...defaultArgs,
    sideSaber: 'left',
  },
};

export const WithNoPadding: Story = {
  args: {
    ...defaultArgs,
    noPaddingX: true,
  },
};
