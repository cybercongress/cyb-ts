/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import { Display2 } from './ContainerGradient';

const meta: Meta<typeof Display2> = {
  component: Display2,
  title: 'atoms/display/DisplayOld(refactor)',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=11052-15684',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Display2>;

export const Main: Story = {
  args: {
    title: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
    children:
      'Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum incidunt nostrum numquam quibusdam tempora soluta natus cupiditate explicabo magni debitis tempore ipsa optio est ullam ipsum aliquid illum non nisi, sint saepe at? Illum possimus doloribus molestias, voluptate voluptas dolores error vel, nostrum qui earum corrupti esse culpa voluptatem aut rerum voluptatibus quaerat consequuntur obcaecati magnam quae quidem quisquam animi velit incidunt. Nam accusantium sunt, quae dolorum odio id blanditiis porro esse praesentium! Ab, cupiditate beatae deleniti, iusto corrupti ratione illum dolor vero ad nostrum neque aut a odio, repellat asperiores quis ea perferendis minus maiores officia odit quisquam. Mollitia.',
  },
};
