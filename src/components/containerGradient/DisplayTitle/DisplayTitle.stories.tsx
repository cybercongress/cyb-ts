/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import DisplayTitle, { TitleProps } from './DisplayTitle';

const meta: Meta<Omit<typeof DisplayTitle, 'animationState'>> = {
  component: DisplayTitle,
  title: 'atoms/display/DisplayTitle',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=11052-15684',
    },
  },
};
export default meta;

type Story = StoryObj<Omit<typeof DisplayTitle, 'animationState'>>;

const defaultTitle = 'Moon Citizenship';
const defaultImage: TitleProps['image'] = {
  src: 'https://cyb.ai/images/preview.png',
  alt: 'cyb.ai',
};

export const Main: Story = {
  args: {
    title: defaultTitle,
  },
};

export const WithImage: Story = {
  args: {
    title: defaultTitle,
    image: defaultImage,
  },
};

export const WithImageLarge: Story = {
  args: {
    title: defaultTitle,
    image: {
      ...defaultImage,
      isLarge: true,
    },
  },
};
