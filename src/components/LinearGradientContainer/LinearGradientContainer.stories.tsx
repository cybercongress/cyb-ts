import React from 'react';
import { Story, Meta } from '@storybook/react';
import LinearGradientContainer, { Props } from './LinearGradientContainer';

export default {
  title: 'Atoms/LinearGradientContainer',
  component: LinearGradientContainer,
} as Meta;

const Template: Story<LinearGradientContainerProps> = (args) => (
  <LinearGradientContainer {...args} />
);

export const Default = Template.bind({});
Default.args = {
  active: true,
};
