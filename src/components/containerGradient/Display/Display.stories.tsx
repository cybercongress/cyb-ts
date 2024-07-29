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

export const WithNoHorizontalPadding: Story = {
  args: {
    ...defaultArgs,
    noPaddingX: true,
  },
};

export const WithNoVerticalPadding: Story = {
  args: {
    ...defaultArgs,
    noPaddingY: true,
  },
};

export const Custom: Story = {
  render: () => (
    <Display
      color="green"
      noPaddingX
      noPaddingY
      title={<DisplayTitle title={title} color="yellow" />}
    >
      <DisplayTitle title={title} color="red" inDisplay />
      <DisplayTitle title={title} color="green" inDisplay />
      <DisplayTitle title={title} color="purple" inDisplay />
      {text100}
    </Display>
  ),
};
