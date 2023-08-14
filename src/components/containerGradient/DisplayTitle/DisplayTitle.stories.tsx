/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import { img } from '../../../../.storybook/stubs';
import DisplayTitle from './DisplayTitle';
import { figmaDisplayUrl } from '../Display/storybook.temp';

const meta: Meta<typeof DisplayTitle> = {
  component: DisplayTitle,
  title: 'atoms/display/DisplayTitle',
  parameters: {
    design: {
      type: 'figma',
      url: figmaDisplayUrl,
    },
  },
};
export default meta;

type Story = StoryObj<typeof DisplayTitle>;

const defaultTitle = 'Moon Citizenship';
const defaultImage = <img src={img} alt="cyb" />;

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
    image: defaultImage,
    isImgLarge: true,
  },
};
