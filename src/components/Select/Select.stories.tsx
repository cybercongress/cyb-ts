import React, { useState } from 'react';
import { Select, OptionSelect } from './';

export default {
  title: 'Select',
  component: Select,
  argTypes: {
    width: { control: 'text' },
    disabled: { control: 'boolean' },
    currentValue: { control: 'text' },
  },
};

const Template = (args) => {
  const [valueSelect, setValueSelect] = useState('option1');
  const handleSelectChange = (option) => setValueSelect(option);

  return (
    <Select
      {...args}
      valueSelect={valueSelect}
      onChangeSelect={handleSelectChange}
    >
      <OptionSelect value="option1" text="Option 1" />
      <OptionSelect value="option2" text="Option 2" />
      <OptionSelect value="option3" text="Option 3" />
    </Select>
  );
};

export const Default = Template.bind({});
Default.args = {
  currentValue: 'Option 1',
};

export const WithWidth = Template.bind({});
WithWidth.args = {
  currentValue: 'Option 1',
  width: '200px',
};

export const Disabled = Template.bind({});
Disabled.args = {
  currentValue: 'Option 1',
  disabled: true,
};

// export default {
//   title: 'OptionSelect',
//   component: OptionSelect,
//   argTypes: {
//     text: { control: 'text' },
//     img: { control: 'text' },
//     bgrImg: { control: 'boolean' },
//   },
// };

// export const DefaultOptionSelect = () => (
//   <OptionSelect value="option1" text="Option 1" />
// );

// export const WithImage = () => (
//   <OptionSelect
//     value="option2"
//     text="Option 2"
//     img={<img src="https://via.placeholder.com/20x20" />}
//   />
// );

// export const WithBackgroundImage = () => (
//   <OptionSelect
//     value="option3"
//     text="Option 3"
//     img={<img src="https://via.placeholder.com/20x20" />}
//     bgrImg
//   />
// );
