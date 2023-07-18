import InfoCard, { Props, Statuses } from './InfoCard';
import { Meta, Story } from '@storybook/react';

export default {
  title: 'atoms/InfoCard',
  component: InfoCard,
} as Meta;

const Template: Story<Props> = (args) => <InfoCard {...args} />;

export const Default = Template.bind({});
Default.args = {
  children: 'Default InfoCard',
};

export const WithStatus = Template.bind({});
WithStatus.args = {
  children: 'InfoCard red',
  status: Statuses.red,
};
