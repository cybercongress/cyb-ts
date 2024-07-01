/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import DateTitle from './DateTitle';

const meta: Meta<typeof DateTitle> = {
  component: DateTitle,
  title: 'features/sense/DateTitle',
  //   parameters: {
  //     design: {
  //       type: 'figma',
  //       url: '',
  //     },
  //   },
};
export default meta;

type Story = StoryObj<typeof DateTitle>;
type Props = React.ComponentProps<typeof DateTitle>;

const defaultArgs: Props = {
  date: new Date(),
};

export const Main: Story = {
  args: defaultArgs,
  render: (args) => (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <DateTitle {...args} />
    </div>
  ),
};
