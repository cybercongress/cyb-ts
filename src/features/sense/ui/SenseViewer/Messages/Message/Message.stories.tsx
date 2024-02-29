/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import Message from './Message';
import styles from './Message.storybook.module.scss';
import * as stubs from '../../../../../../../.storybook/stubs';
import { Coin } from '@cosmjs/launchpad';

const meta: Meta<typeof Message> = {
  component: Message,
  title: 'features/sense/Message',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Message>;
type Props = React.ComponentProps<typeof Message>;

const defaultArgs: Props = {
  transactionHash: stubs.transactionHash,
  date: new Date().toISOString(),
  content: stubs.text50,
  fromLog: true,
  amountData: {
    amount: [stubs.amounts[0]],
  },
};

export const Main: Story = {
  args: defaultArgs,
};

export const WithAmounts: Story = {
  args: {
    ...defaultArgs,
    amountData: {
      ...defaultArgs.amountData,
      amount: stubs.amounts,
    },
  },

  render: (args) => (
    <div className={styles.wrapper}>
      <Message {...args} />
      <Message
        {...args}
        myMessage
        amountData={{
          ...args.amountData!,
          isAmountSendToMyAddress: false,
        }}
      />
    </div>
  ),
};

export const withIcons: Story = {
  args: defaultArgs,
  render: (args) => (
    <div className={styles.wrapper}>
      <Message {...args} fromLog />
    </div>
  ),
};

export const Group: Story = {
  args: defaultArgs,
  render: (args) => (
    <div className={styles.wrapper}>
      <Message {...args} />
      <Message {...args} myMessage />

      <Message {...args} status="pending" />
      <Message {...args} status="pending" myMessage />

      <Message {...args} status="error" />
      <Message {...args} status="error" myMessage />
    </div>
  ),
};
