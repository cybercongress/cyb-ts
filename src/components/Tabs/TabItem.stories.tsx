import { Meta, StoryObj } from '@storybook/react';
import TabItem from './TabItem';
import { useState } from 'react';

const meta: Meta<typeof TabItem> = {
  component: TabItem,
  title: 'atoms/Tabs',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TabItem>;

export const Main: Story = {
 render: () => {
  const [select, setSelect] = useState(false)
  return (
    <TabItem
      isSelected={select}
      onClick={() => setSelect((item) => !item)}
      text="default"
    />
  );
 }
};
