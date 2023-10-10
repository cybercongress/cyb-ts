/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';

import MusicalAddress from './MusicalAddress';

const stubAddress = 'bostrom1f5warat4vc0q98k7ygys4saka8u04rfxpmthvl';
const stubAddress2 = 'cosmos1f5warat4vc0q98k7ygys4saka8u04rfxzglyjc';
const stubAddress3 = 'osmo1f5warat4vc0q98k7ygys4saka8u04rfx2nv5y2';
const stubAddress4 = '0xbb5913bb6fa84f02ce78ffeeb9e7d43e3d075b16';

const meta: Meta<typeof MusicalAddress> = {
  component: MusicalAddress,
  title: 'atoms/MusicalAddress',
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=17023-16986',
    },
  },
};
export default meta;

type Story = StoryObj<typeof MusicalAddress>;

const defaultArgs = {
  address: stubAddress,
};

export const Default: Story = {
  args: defaultArgs,
};

export const Group: Story = {
  render: () => {
    return (
      <div
        style={{
          display: 'grid',
          gap: '30px 0',
        }}
      >
        <MusicalAddress {...defaultArgs} />
        <MusicalAddress address={stubAddress2} />
        <MusicalAddress address={stubAddress3} />
        <MusicalAddress address={stubAddress4} disabled />
      </div>
    );
  },
};

export const Disabled: Story = {
  args: {
    ...defaultArgs,
    disabled: true,
  },
};
