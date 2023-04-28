import { Meta } from '@storybook/react';
import imgKeplr from '../../image/keplr-icon.svg';
import ButtonIcon, { Props } from '.';

export default {
  component: ButtonIcon,
  title: 'Atoms/ButtonIcon',
} as Meta;

const defaultArgs: Props = {
  img: imgKeplr,
  text: 'tooltip text',
  onClick: () => {
    console.log('button clicked');
  },
};

function Template(args: Props) {
  return (
    <div
      style={{
        gap: 20,
        display: 'flex',
      }}
    >
      <ButtonIcon {...args} />
    </div>
  );
}

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};

export const Active = Template.bind({});
Active.args = {
  ...defaultArgs,
  active: true,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...defaultArgs,
  disabled: true,
};
