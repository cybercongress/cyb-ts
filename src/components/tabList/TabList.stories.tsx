import { Meta, StoryObj } from '@storybook/react';
import TabButton from '../tabButton/TabButton';
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
    text: 'left',
  },
  {
    to: '',
    text: 'default',
  },
  {
    to: '',
    text: 'right',
  },
];

export const Main: Story = {
  render: () => {
    return (
      <div
        style={{
          width: '375px',
          margin: '0 auto',
        }}
      >
        <TabList>
          <TabButton
            options={TabButtonConfig}
            selected={TabButtonConfig[1].text}
          />
        </TabList>
      </div>
    );
  },
};
