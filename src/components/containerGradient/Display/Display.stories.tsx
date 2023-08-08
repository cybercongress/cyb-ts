/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Display from './Display';

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

export const Main: Story = {
  args: {
    titleProps: {
      title: 'Moon Citizenship',
    },
    children:
      'Welcome to the portal. Take a quick look on what Bostrom are, and what you can do here. Get or manage your Moon Citizenship, check the ongoing gift status and more. Welcome to the portal. Take a quick look on what Bostrom are, and what you can do here. Get or manage your Moon Citizenship, check the ongoing gift status and more. Welcome to the portal. Take a quick look on what Bostrom are, and what you can do here. Get or manage your Moon Citizenship',
  },
};
