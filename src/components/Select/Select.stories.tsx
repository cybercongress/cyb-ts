import { Story, Meta } from '@storybook/react';
import Select, { SelectProps, OptionSelect } from '.';

export default {
  title: 'Atoms/Select',
  component: Select,
  argTypes: {
    valueSelect: {
      control: {
        type: 'text',
      },
    },
    onChangeSelect: {
      action: 'onChange',
    },
    children: {
      control: {
        disable: true,
      },
    },
    width: {
      control: {
        type: 'text',
      },
    },
    disabled: {
      control: {
        type: 'boolean',
      },
    },
    currentValue: {
      control: {
        type: 'text',
      },
    },
  },
} as Meta;

const Template: Story<SelectProps> = (args) => (
  <Select {...args}>
    <OptionSelect
      value="1"
      text="BOOT"
      // bgrImg={require('../../image/boot.png')}
    />
    <OptionSelect value="2" text="ATOM" />
    <OptionSelect value="3" text="PUSSY" />
    <OptionSelect value="3" text="JUNO" />
  </Select>
);

export const Default = Template.bind({});
Default.args = {
  valueSelect: '',
  onChangeSelect: () => {},
  width: '220px',
  disabled: false,
  currentValue: 'BOOT',
};

// export const Disabled = Template.bind({});
// Default.args = {
//   valueSelect: '',
//   onChangeSelect: () => {},
//   width: '220px',
//   disabled: true,
//   currentValue: 'BOOT',
// };
