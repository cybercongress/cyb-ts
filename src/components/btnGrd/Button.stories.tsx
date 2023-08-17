import type { Meta, StoryObj } from '@storybook/react';
import BtnGrd, { Props } from './';

const Button = BtnGrd;

const meta: Meta<typeof Button> = {
  component: Button,
  title: 'Atoms/Buttons/Button',
  // argTypes: { onClick: { action: 'clicked' } },
};

export default meta;
type Story = StoryObj<typeof Button>;

const defaultArgs: Props = {
  onClick: () => {
    console.log('button clicked');
  },
  text: 'Click me',
};

export const Main: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Link: Story = {
  args: {
    ...defaultArgs,
    link: '/',
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    disabled: true,
  },
};

export const Pending: Story = {
  args: {
    ...defaultArgs,
    pending: true,
  },
};

export const ButtonWithImage: Story = {
  args: {
    ...defaultArgs,
    img: require('../../image/Bitcoin.svg'),
  },
};
