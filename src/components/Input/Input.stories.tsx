/* eslint-disable import/no-unused-modules */
import { Story, Meta } from '@storybook/react';
import Input, { Props } from './Input';
import { useState } from 'react';

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

const Template: Story<Props> = (args) => {
  const [value, setValue] = useState('Search');
  return (
    <div style={{ width: 400 }}>
      <Input
        {...args}
        title="Search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter...',
  value: 'Default',
};
