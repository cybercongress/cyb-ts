/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';
import { MilkdownProvider } from '@milkdown/react';

import Editor from './Editor';
import ControlPanel from './ControlPanel/ControlPanel';
import { useState } from 'react';

const meta: Meta<typeof Editor> = {
  component: Editor,
  title: 'atoms/Editor',
};
export default meta;

type Story = StoryObj<typeof Editor>;

function Wrapper() {
  const [onsave, onSave] = useState('');
  return (
    <>
      <MilkdownProvider>
        <ControlPanel />
        <Editor onSave={onSave} />
      </MilkdownProvider>
      <div>{onsave}</div>
    </>
  );
}

export const Main: Story = {
  render: Wrapper,
};
