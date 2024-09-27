/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';
import ControlPanel from './ControlPanel';

const meta: Meta<typeof ControlPanel> = {
  component: ControlPanel,
  title: 'atoms/Editor/ControlPanel',
};
export default meta;

type Story = StoryObj<typeof ControlPanel>;

function Wrapper() {

  return <ControlPanel />;
}

export const Main: Story = {
  render: Wrapper,
};
