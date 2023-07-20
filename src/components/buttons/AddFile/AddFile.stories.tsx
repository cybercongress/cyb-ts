import React, { useState } from 'react';
import { Story, Meta } from '@storybook/react';
import AddFile, { Props } from './AddFile';

export default {
  title: 'atoms/buttons/AddFile',
  component: AddFile,
} as Meta;

const Template: Story<Props> = (args) => {
  const [isRemove, setIsRemove] = useState(false);

  return (
    <AddFile
      {...args}
      isRemove={isRemove}
      onClick={() => setIsRemove(!isRemove)}
    />
  );
};

export const Default = Template.bind({});
// AddFileStory.args = {
//   isRemove: false,
//   onClick: () => {},
// };
