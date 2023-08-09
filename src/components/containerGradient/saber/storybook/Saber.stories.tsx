/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';
import Saber from './Saber';
import { Positions, Colors } from '../../types';
import styles from './storybook.module.scss';

const meta: Meta<typeof Saber> = {
  component: Saber,
  title: 'atoms/Saber',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=11052-15684',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Saber>;

export const Main: Story = {
  args: {
    color: 'green',
    position: Positions.LEFT,
  },
};

export const Group: Story = {
  render: () => (
    <div className={styles.group}>
      <div>
        <h3>Colors:</h3>
        {Object.keys(Colors).map((color) => (
          <Saber color={Colors[color]} position={Positions.RIGHT} />
        ))}
      </div>

      <div>
        <h3>Positions:</h3>
        {Object.keys(Positions).map((position) => (
          <Saber position={Positions[position]} />
        ))}
      </div>
    </div>
  ),
};
