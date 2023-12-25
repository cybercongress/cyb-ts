/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Carousel from './Carousel';

const meta: Meta<typeof Carousel> = {
  component: Carousel,
  title: 'atoms/Tabs/Carousel',
  //   parameters: {
  //     design: {
  //       type: 'figma',
  //       url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=18318-21114',
  //     },
  //   },
};
export default meta;

type Story = StoryObj<typeof Carousel>;

const slides = [
  {
    title: 'Slide 1',
    step: 1,
  },
  {
    title: 'Slide 2',
    step: 2,
  },
  {
    title: 'Slide 3',
    step: 3,
  },
  {
    title: 'Slide 4',
    step: 4,
  },
];

export const Main: Story = {
  args: {
    slides,
  },
};

export const Disabled: Story = {
  args: {
    slides,
    disableMode: true,
  },
};
