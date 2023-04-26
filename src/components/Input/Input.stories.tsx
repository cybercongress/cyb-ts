import { Story, Meta } from '@storybook/react';
import Input, { Props } from './Input';

export default {
  title: 'Atoms/Input',
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

function InputWrapper({ children }: { children: React.ReactNode }) {
  return <div style={{ width: 400 }}>{children}</div>;
}

const Template: Story<Props> = (args) => (
  <InputWrapper>
    <Input {...args} />
  </InputWrapper>
);

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
