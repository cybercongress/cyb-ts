/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import SenseListItem from './SenseListItem';
import * as stubs from '../../../../../../.storybook/stubs';

const meta: Meta<typeof SenseListItem> = {
  component: SenseListItem,
  title: 'features/sense/SenseListItem',
  // parameters: {
  //   design: {
  //     type: 'figma',
  //     url: '',
  //   },
  // },
};
export default meta;

type Story = StoryObj<typeof SenseListItem>;
type Props = React.ComponentProps<typeof SenseListItem>;

const defaultArgs: Props = {
  address: stubs.address,
  date: new Date().toISOString(),
  unreadCount: 6,
  title: 'Some title',
  content: stubs.text50,
  fromLog: true,
  amountData: {
    amount: stubs.amounts,
  },
};

export const Main: Story = {
  args: defaultArgs,
};

export const Particle: Story = {
  args: {
    ...defaultArgs,
    address: stubs.particle,
  },
};

export const WithAmounts: Story = {
  args: defaultArgs,
  render: (args) => (
    <div>
      <SenseListItem {...args} />
      <SenseListItem
        {...args}
        amountData={{
          amount: [stubs.amounts[2]],
          isAmountSendToMyAddress: false,
        }}
      />
    </div>
  ),
};

export const Group: Story = {
  args: defaultArgs,
  render: (args) => (
    <div>
      <SenseListItem {...args} address={stubs.address} />
      <SenseListItem
        {...args}
        address={stubs.particle}
        unreadCount={1000}
        amountData={undefined}
      />
      <SenseListItem {...args} address={stubs.address} unreadCount={14} />
      <SenseListItem
        {...args}
        address={stubs.particle}
        status="pending"
        amountData={{
          ...args.amountData!,
          isAmountSendToMyAddress: false,
        }}
      />
      <SenseListItem
        {...args}
        amountData={undefined}
        address={stubs.particle}
        unreadCount={7}
        status="error"
      />
    </div>
  ),
};
