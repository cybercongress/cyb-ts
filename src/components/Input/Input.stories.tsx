import React from 'react';
import { Input, InputNumber } from './';

export default {
  title: 'Input',
  component: Input,
  argTypes: {
    color: { control: 'radio', options: ['default', 'pink'] },
    placeholder: { control: 'text' },
  },
};

const Template = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter text...',
};

export const Pink = Template.bind({});
Pink.args = {
  placeholder: 'Enter pink text...',
  color: 'pink',
};

export const DefaultNumber = () => (
  <InputNumber
    value="1234.567"
    onValueChange={(value, event) => console.log(value, event)}
  />
);

export const PinkNumber = () => (
  <InputNumber
    value="9876.543"
    onValueChange={(value, event) => console.log(value, event)}
    color="pink"
  />
);
