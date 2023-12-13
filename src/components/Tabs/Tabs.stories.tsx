import { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import Tabs from './Tabs';

const meta: Meta<typeof Tabs> = {
  component: Tabs,
  title: 'atoms/Tabs',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Tabs>;

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

const TabButtonConfigTwoItems = [
  {
    to: '',
    key: 'left',
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
        <Tabs
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

export const TwoItems: Story = {
  render: () => {
    const [select, setSelect] = useState(TabButtonConfigTwoItems[1].key);

    return (
      <div
        style={{
          width: '375px',
          margin: '0 auto',
        }}
      >
        <Tabs
          options={TabButtonConfigTwoItems.map((item) => ({
            key: item.key,
            onClick: () => setSelect(item.key),
          }))}
          selected={select}
        />
      </div>
    );
  },
};
