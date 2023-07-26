import React from 'react';
import { Story, Meta } from '@storybook/react';
import Adviser from './Adviser';

const Template: Story = (args) => <Adviser {...args} />;

export default {
  title: 'Components/Adviser',
  component: Adviser,
} as Meta;

export const Default = Template.bind({});
Default.args = {
  children: (
    <>
      Connect your wallet by adding a key to start using robot. <br /> Get your
      first citizenship to unlock all features of cyb.{' '}
    </>
  ),
};

// export { Default };
