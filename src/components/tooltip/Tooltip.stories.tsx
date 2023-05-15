import { Story, Meta } from '@storybook/react';
import Tooltip, { TooltipProps } from './tooltip';

export default {
  title: 'Atoms/Tooltip',
  component: Tooltip,
  argTypes: {
    children: {
      control: {
        disable: true,
      },
    },
    trigger: {
      control: {
        type: 'inline-radio',
        options: ['click', 'hover'],
      },
    },
    tooltip: {
      control: {
        type: 'text',
      },
    },
    hideBorder: {
      control: {
        type: 'boolean',
      },
    },
    placement: {
      control: {
        type: 'inline-radio',
        options: ['top', 'bottom', 'left', 'right'],
      },
    },
  },
} as Meta;

const Template: Story<TooltipProps> = (args) => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <Tooltip {...args}>
      <span>Hover or click me</span>
    </Tooltip>
  </div>
);

export const Default = Template.bind({});
Default.args = {
  tooltip: 'This is a tooltip',
};
