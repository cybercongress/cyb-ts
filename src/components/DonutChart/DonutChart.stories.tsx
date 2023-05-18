import { Meta } from '@storybook/react';
import DonutChart, { Props } from './index';

const mockData = [
  {
    color: '#ED2BE7',
    value: 70,
  },
  {
    color: '#76FF03',
    value: 65,
  },
  {
    color: '#525252',
    value: 133,
  },
];

const defaultArgs: Props = {
  data: mockData,
};

export default {
  component: DonutChart,
  title: 'Atoms/DonutChart',
} as Meta;

function Template(args) {
  return <DonutChart {...args} />;
}

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};
