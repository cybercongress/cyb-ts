import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import TabList from './TabList';

const meta: Meta<typeof TabList> = {
  component: TabList,
  title: 'atoms/TabList',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TabList>;

const TabButtonConfig = [
  {
    to: '',
    key: 'left',
  },
  {
    to: '',
    key: 'default',
  },
  {
    to: '',
    key: 'right',
  },
];

export const Main: Story = {
  render: () => {
    const [select, setSelect] = useState(TabButtonConfig[1].key);

    return (
      <div
        style={{
          width: '375px',
          margin: '0 auto',
        }}
      >
        <TabList
          options={TabButtonConfig.map((item) => ({
            key: item.key,
            onClick: () => setSelect(item.key),
          }))}
          selected={select}
        />
      </div>
    );
  },
};
