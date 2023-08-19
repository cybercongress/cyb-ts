import { Meta } from '@storybook/react';

import { useState } from 'react';
import TabBtn, { TabBtnProps } from '.';

export default {
  component: TabBtn,
  title: 'Tech debt/TabBtn',
} as Meta;

function Template(args: TabBtnProps) {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div
      style={{
        gap: 20,
        display: 'flex',
      }}
    >
      <TabBtn
        {...args}
        isSelected={isSelected}
        onSelect={() => setIsSelected(!isSelected)}
      />
      <TabBtn
        {...args}
        text="Tab 2"
        isSelected={isSelected}
        onSelect={() => setIsSelected(!isSelected)}
      />

      <TabBtn
        {...args}
        text="Tab 3"
        isSelected={isSelected}
        onSelect={() => setIsSelected(!isSelected)}
      />
    </div>
  );
}

export const Default = Template.bind({});
Default.args = {
  key: 'tab1',
  text: 'Tab 1',
  isSelected: true,
  onSelect: () => {},
  to: '/tab1',
};
