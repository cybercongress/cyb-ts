import { Meta } from '@storybook/react';
import ProgressCard from './index';

export default {
  component: ProgressCard,
  title: 'Features/Gift/ProgressCard',
} as Meta;

function Template(args) {
  return <ProgressCard {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  headerText: 'left to release',
  footerText: 'total gift released',
  titleValue: 0,
  styleContainerTrack: {},
  progress: 50,
  status: 'red',
};
