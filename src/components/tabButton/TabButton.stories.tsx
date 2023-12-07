import { Meta } from '@storybook/react';
import { useState } from 'react';
import TabButton, { Props } from './TabButton';

export default {
  component: TabButton,
  title: 'Tech debt/TabButton',
} as Meta;

function Template(args: Props) {
  const [isSelected, setIsSelected] = useState(false);
  return (
    <div
      style={{
        display: 'flex',
      }}
    >
      <TabButton
        {...args}
        isSelected={isSelected}
        onSelect={() => setIsSelected(!isSelected)}
      >
        default
      </TabButton>
    </div>
  );
}

export const Default = Template.bind({});
Default.args = {
  isSelected: true,
  onSelect: () => {},
};
