import { Story, Meta } from '@storybook/react';
import ValueImg from '.';

export default {
  title: 'Atoms/ValueImg',
  component: ValueImg,
  argTypes: {
    text: {
      control: {
        type: 'text',
      },
    },
    onlyImg: {
      control: {
        type: 'boolean',
      },
    },
    onlyText: {
      control: {
        type: 'boolean',
      },
    },
    marginImg: {
      control: {
        type: 'text',
      },
    },
    marginContainer: {
      control: {
        type: 'text',
      },
    },
    justifyContent: {
      control: {
        type: 'text',
      },
    },
    zIndexImg: {
      control: {
        type: 'number',
      },
    },
    flexDirection: {
      control: {
        type: 'inline-radio',
        options: ['row', 'column', 'row-reverse', 'column-reverse'],
      },
    },
    size: {
      control: {
        type: 'number',
      },
    },
    type: {
      control: {
        type: 'inline-radio',
        options: ['pool', 'ibc'],
      },
    },
  },
} as Meta;

const Template: Story = (args) => <ValueImg {...args} />;

export const Default = Template.bind({});
Default.args = {
  text: 'millivolt',
};
