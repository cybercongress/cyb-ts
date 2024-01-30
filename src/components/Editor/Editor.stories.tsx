/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';
import { useCallback, useRef } from 'react';
import Editor from './Editor';
import { MilkdownRef } from './components/MilkdownEditor/MilkdownEditor';

const meta: Meta<typeof Editor> = {
  component: Editor,
  title: 'atoms/Editor',
};
export default meta;

type Story = StoryObj<typeof Editor>;

const markdown = `# Milkdown React Commonmark

[cyber](skdfn)

~(cyber) Commonmark demo @(cyb)  
`;

function Wrapper() {
  const milkdownRef = useRef<MilkdownRef>(null);

  // const onCodemirrorChange = useCallback((getCode: () => string) => {
  //   const { current } = milkdownRef;
  //   if (!current) return;
  //   const value = getCode();
  //   current.update(value);
  // }, []);

  const onMilkdownChange = useCallback((markdown: string) => {
    console.log('markdown', markdown);
  }, []);

  return (
    <Editor
      milkdownRef={milkdownRef}
      content={markdown}
      onChange={onMilkdownChange}
    />
  );
}

export const Main: Story = {
  render: Wrapper,
};
