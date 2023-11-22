import { Meta } from '@storybook/react';
import CreatedAt, { Props } from './CreatedAt';

export default {
  component: CreatedAt,
  title: 'atoms/CreatedAt',
} as Meta;

const defaultArgs: Props = {
  timeAt: '2023-11-16T08:28:04Z',
};

function Template(args: Props) {
  return (
    <div
      style={{
        gap: 20,
        display: 'flex',
      }}
    >
      <CreatedAt {...args} />
    </div>
  );
}

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};
