/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import { useState } from 'react';
import Dropdown from './Dropdown';

const defaultArgs = {
  options: [
    {
      label: 'Rank',
      value: 'rank',
    },
    {
      label: 'Date',
      value: 'date',
    },
    {
      label: 'Size',
      value: 'size',
    },
  ],
};

const meta: Meta<typeof Dropdown> = {
  component: Dropdown,
  title: 'atoms/Dropdown',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=20608-4734&mode=dev',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Dropdown>;

function Wrapper() {
  const [value, setValue] = useState<string>(defaultArgs.options[0].value);

  return <Dropdown {...defaultArgs} value={value} onChange={setValue} />;
}

export const Main: Story = {
  render: Wrapper,
};
