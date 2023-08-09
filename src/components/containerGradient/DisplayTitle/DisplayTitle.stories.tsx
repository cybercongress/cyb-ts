/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import DisplayTitle, { Props } from './DisplayTitle';

const meta: Meta<typeof DisplayTitle> = {
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

type Story = StoryObj<typeof DisplayTitle>;

const defaultTitle = 'Moon Citizenship';
const defaultImage: Props['image'] = {
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
