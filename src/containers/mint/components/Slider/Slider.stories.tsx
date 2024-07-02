/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Slider from './Slider';
import { useState } from 'react';

const meta: Meta<typeof Slider> = {
  component: Slider,
  title: 'atoms/SliderHFR',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Slider>;
type Props = React.ComponentProps<typeof Slider>;

const defaultArgs: Props = {
  minMax: {
    min: 0,
    max: 10,
  },
  value: {
    amount: 5,
    onChange: (amount: number) => console.log(amount),
  },
  marks: {
    0: '0',
    10: '10',
  },
};

export const Main: Story = {
  args: defaultArgs,
  render: (props) => {
    const [value, setValue] = useState(5);

    return (
      <Slider
        {...props}
        value={{
          amount: value,
          onChange: (amount: number) => setValue(amount),
        }}
      />
    );
  },
};
