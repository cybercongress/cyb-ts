import { Story, Meta } from '@storybook/react';
import IPFSConnectError from './IPFSConnectError';

export default {
  title: 'molecules/IPFSConnectError',
  component: IPFSConnectError,
} as Meta;

const Template: Story = (args) => <IPFSConnectError {...args} />;

export const Default = Template.bind({});
Default.args = {};
