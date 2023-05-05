import { Story, Meta } from '@storybook/react';
import Select, { SelectProps } from '.';
import { useState } from 'react';
import bootImg from '../../image/boot.png';

// eslint-disable-next-line import/no-unused-modules
export default {
  title: 'Atoms/Select',
  component: Select,
  // argTypes: {
  //   valueSelect: {
  //     control: {
  //       type: 'text',
  //     },
  //   },
  //   children: {
  //     control: {
  //       disable: true,
  //     },
  //   },
  //   width: {
  //     control: {
  //       type: 'text',
  //     },
  //   },
  //   disabled: {
  //     control: {
  //       type: 'boolean',
  //     },
  //   },
  //   currentValue: {
  //     control: {
  //       type: 'text',
  //     },
  //   },
  // },
} as Meta;

const image = <img src={bootImg} />;

// eslint-disable-next-line react/function-component-definition
const Template: Story<SelectProps> = (args) => {
  const [value, setValue] = useState('1');

  return (
    <Select
      valueSelect={value}
      placeholder="Select token"
      {...args}
      onChangeSelect={setValue}
      options={[
        { text: '', value: '' },
        {
          text: 'BOOT',
          value: '1',
          img: image,
        },
        {
          text: 'ATOM',
          value: '2',
          img: image,
        },
        {
          text: 'PUSSY',
          value: '3',
          img: image,
        },
        {
          text: 'JUNO',
          value: '4',
        },
      ]}
    />
  );
};

export const Default = Template.bind({});
Default.args = {
  width: '220px',
  disabled: false,
};

export const Disabled = Template.bind({});
Disabled.args = {
  valueSelect: '',
  width: '220px',
  disabled: true,
  currentValue: 'BOOT',
};
