import React from 'react';
import { Story, Meta } from '@storybook/react';
import Advicer from './Advicer';

const Template: Story = (args) => <Advicer {...args} />;

export default {
  title: 'Components/Advicer',
  component: Advicer,
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
