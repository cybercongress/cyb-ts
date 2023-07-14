/* eslint-disable import/no-unused-modules */
import { Story, Meta } from '@storybook/react';
import Table, { Props } from './Table';
import { useState } from 'react';

export default {
  title: 'Atoms/Table',
  component: Table,
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
      <Table
        {...args}
        columns={['skill', 'network', 'provider', 'address']}
        data={[
          ['skill1', 'network', 'provider', 'address'],
          ['skill2', 'network', 'provider', 'address'],
          [null, 'network', 'provider', 'address'],
          ['skill4', 'network', 'provider', 'address'],
          ['skill4', 'network', 'provider', 'address'],
          ['skill4', 'network', 'provider', 'address'],
        ]}
      />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  placeholder: 'Enter...',
  value: 'Default',
};
