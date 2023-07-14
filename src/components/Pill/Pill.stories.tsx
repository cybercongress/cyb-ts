import React from 'react';
import { Story, Meta } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import Pill, { Props, Colors } from './Pill';
import cyber from '../../image/cyber.png';

export default {
  title: 'Atoms/Pill',
  component: Pill,
} as Meta;

const Template: Story<Props> = (args) => {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          gap: '20px',
          marginBottom: 40,
        }}
      >
        {Object.values(Colors).map((color) => (
          <Pill color={color} text={color} />
        ))}
      </div>
      <div>
        <h5>With image:</h5>

        <Pill
          image={{
            src: cyber,
            alt: 'cyber',
          }}
          text="cyber"
        />
      </div>

      <div>
        <h5>Custom:</h5>
        <Pill {...args} />
      </div>
    </div>
  );
};

export const Default = Template.bind({});
Default.args = {
  text: 'Custom pill',
  color: Colors.green,
};
