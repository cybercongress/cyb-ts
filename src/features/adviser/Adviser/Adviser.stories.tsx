/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import { Link } from 'react-router-dom';
import Adviser, { AdviserColors } from './Adviser';

const meta: Meta<typeof Adviser> = {
  component: Adviser,
  title: 'molecules/Adviser',
};
export default meta;

type Story = StoryObj<typeof Adviser>;

export const Main: Story = {
  render: () => (
    <div>
      <Adviser
        children={
          <>
            Connect your wallet by adding a <Link to="/">key</Link> to start
            using robot.
            <br /> Get your first <Link to="/">citizenship</Link> to unlock all
            features of cyb.
          </>
        }
        color={AdviserColors.blue}
      />

      <br />

      <hr />

      <h3>One line: </h3>

      <Adviser
        children={
          <>
            Connect your wallet by adding a <Link to="/">key</Link> to start
            using robot.
          </>
        }
        color={AdviserColors.blue}
      />
    </div>
  ),
};

export const Default: Story = {
  args: {
    children: (
      <>
        Connect your wallet by adding a <Link to="/">key</Link> to start using
        robot.
        <br /> Get your first <Link to="/">citizenship</Link> to unlock all
        features of cyb.
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};
