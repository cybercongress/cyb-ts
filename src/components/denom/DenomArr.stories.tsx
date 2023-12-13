/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import DenomArr from './denomArr';

const meta: Meta<typeof DenomArr> = {
  component: DenomArr,
  title: 'atoms/denoms/DenomArr',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof DenomArr>;
type DenomArrProps = React.ComponentProps<typeof DenomArr>;

const defaultArgs: DenomArrProps = {
  denomValue: 'hydrogen',
};

export const Main: Story = {
  args: defaultArgs,
};
