import { Story, Meta } from '@storybook/react';
import Input, { Props } from './Input';

export default {
  title: 'Components/Input',
  component: Input,
  argTypes: {
    color: {
      control: {
        type: 'inline-radio',
        options: ['pink', undefined],
      },
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <Input {...args} />;

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter...',
  value: 'Default',
};

export const Pink = Template.bind({});
Pink.args = {
  color: 'pink',
  value: 'Pink',
  placeholder: 'Enter...',
};
