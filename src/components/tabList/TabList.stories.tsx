import { Meta } from '@storybook/react';
import { useState } from 'react';
import TabButton, { Position } from '../tabButton/TabButton';
import TabList from './TabList';

export default {
  component: TabList,
  title: 'Tech debt/TabList',
} as Meta;

const TabButtonConfig = [
  {
    type: Position.Left,
    key: 'tb1',
    text: Position.Left,
  },
  {
    key: 'tb2',
    text: 'Default',
  },
  {
    type: Position.Right,
    key: 'tb3',
    text: Position.Right,
  },
];

function Template() {
  const [isSelected, setIsSelected] = useState('tb2');
  return (
    <TabList>
      {TabButtonConfig.map((item) => (
        <TabButton
          key={item.key}
          type={item.type}
          isSelected={isSelected === item.key}
          onSelect={() => setIsSelected(item.key)}
        >
          {item.text}
        </TabButton>
      ))}
    </TabList>
  );
}

export const Default = Template.bind({});
Default.args = {};
