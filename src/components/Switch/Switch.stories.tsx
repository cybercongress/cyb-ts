/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';
import Switch from './Switch';
import React from 'react';

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'atoms/Switch',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=17413-16929',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Switch>;

type Props = React.ComponentProps<typeof Switch>;
const defaultArgs: Props = {
  label: 'Chat bot',
  onChange: (checked) => {
    console.log(checked);
  },
};

export const Main: Story = {
  args: {
    ...defaultArgs,
  },
};

export const Group: Story = {
  render: () => {
    return (
      <div
        style={{
          display: 'grid',
          gap: '1rem',
        }}
      >
        <Switch {...defaultArgs} />
        <Switch {...defaultArgs} label={undefined} />
      </div>
    );
  },
};
