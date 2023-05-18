import { Meta } from '@storybook/react';
import ReleaseStatus from './index';

export default {
  component: ReleaseStatus,
  title: 'Features/Gift/ReleaseStatus',
} as Meta;

function Template(args) {
  return <ReleaseStatus {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  status: 'red',
  amountGiftValue: 10,
  progress: 10,
};
