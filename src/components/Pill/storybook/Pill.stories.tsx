/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';
import { ComponentProps } from 'react';
import cyber from 'images/cyber.png';
import styles from './Pill.storybook.module.scss';

import Pill from '../Pill';

const meta: Meta<typeof Pill> = {
  component: Pill,
  title: 'atoms/Pill',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=17411-16660&mode=dev',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Pill>;

type Props = ComponentProps<typeof Pill>;
const defaultArgs: Props = {
  text: 'cyber',
};
const img = <img src={cyber} alt="" />;

export const Main: Story = {
  args: defaultArgs,
};

export const WithImage: Story = {
  args: {
    ...defaultArgs,
    image: img,
  },
};

const colors: Props['color'][] = ['white', 'black', 'blue', 'red', 'green'];

export const Group: Story = {
  render: () => {
    return (
      <div className={styles.wrapper}>
        <div className={styles.items}>
          {colors.map((color) => (
            <Pill key={color} color={color} text={color} />
          ))}
        </div>
        <div>
          <h5>With image:</h5>
          <Pill {...defaultArgs} image={img} />
        </div>

        <div>
          <h5>Custom:</h5>
          <Pill {...defaultArgs} color="green" />
        </div>
      </div>
    );
  },
};
