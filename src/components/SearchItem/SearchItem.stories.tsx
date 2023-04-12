import { Story, Meta } from '@storybook/react';
import { ComponentProps } from 'react';
import { StatusType } from './status';
import SearchItem from './searchItem';

export default {
  title: 'search/SearchItem',
  component: SearchItem,
} as Meta;

const Template: Story<ComponentProps<typeof SearchItem>> = (args) => {
  return (
    <div style={{ width: 400 }}>
      <SearchItem {...args} />
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  children:
    'Lorem ipsum dolor sit amet consectetur adipisicing elit. Libero facere expedita, magnam laboriosam minima tenetur repellat quae perferendis corrupti, alias eligendi voluptatum laudantium. Reiciendis deleniti quod minima hic facere, quas sapiente velit odio ipsum at laboriosam ipsam facilis cumque voluptatum dolorem distinctio nesciunt nam, corporis iusto accusantium, tenetur ab accusamus? Non eos sint cumque eveniet consectetur eum voluptatum similique ea quasi necessitatibus earum facilis itaque ducimus alias unde hic quos reiciendis, tenetur ex ab veritatis debitis odit impedit atque. Culpa, cupiditate impedit quo sit ad voluptatum! Ex a, eum odit enim totam maiores officia ab neque rerum modi vitae error.',
  textPreview: 'Preview text',
};

export const WithStatus = Template.bind({});
WithStatus.args = {
  ...Default.args,
  status: 'availableDownload' as StatusType,
};

export const WithGrade = Template.bind({});
WithGrade.args = {
  ...Default.args,
  grade: {
    value: 4,
  },
};

export const WithStatusAndGrade = Template.bind({});
WithStatusAndGrade.args = {
  ...WithStatus.args,
  ...WithGrade.args,
};
