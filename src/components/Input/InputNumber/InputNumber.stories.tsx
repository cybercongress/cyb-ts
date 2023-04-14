import { Story, Meta } from '@storybook/react';
import InputNumber, { Props } from './InputNumber';

export default {
  title: 'Atoms/Input/InputNumber',
  component: InputNumber,
  argTypes: {
    value: {
      control: {
        type: 'text',
      },
    },
  },
} as Meta;

const Template: Story<Props> = (args) => <InputNumber {...args} />;

export const Default = Template.bind({});
Default.args = {
  value: '238293289202380',
  onValueChange: () => {},
};
