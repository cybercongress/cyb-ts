/* eslint-disable import/no-unused-modules */

import { Meta, StoryObj } from '@storybook/react';
import Display from '../Display/Display';
import { text100 } from '../../../../.storybook/stubs';
import TextCenterer from './TextCenterer';

const meta: Meta<typeof TextCenterer> = {
  component: TextCenterer,
  title: 'atoms/TextCenterer',
  parameters: {
    design: {
      type: 'figma',
      url: '',
    },
  },
};
export default meta;

type Story = StoryObj<typeof TextCenterer>;

function withDisplayDecorator(Story: any) {
  return (
    <Display>
      <Story />
    </Display>
  );
}

const textShort = 'Moon';
const textMedium = 'Moon passport moon passport';
const textLarge = text100;

export const Group: Story = {
  render: () => (
    <div
      style={{
        display: 'grid',
        gap: '20px 0',
      }}
    >
      {[textShort, textMedium, textLarge].map((text) => (
        <Display>
          <TextCenterer text={text} />
        </Display>
      ))}
    </div>
  ),
};

export const Default: Story = {
  args: {
    text: textMedium,
  },
  decorators: [
    (Story) => (
      <div style={{ backgroundColor: 'grey' }}>
        <Story />
      </div>
    ),
  ],
};

export const Title: Story = {
  args: {
    text: textShort,
  },
  decorators: [withDisplayDecorator],
};

export const Keywords: Story = {
  args: {
    text: textMedium,
  },
  decorators: [withDisplayDecorator],
};

export const LongText: Story = {
  args: {
    text: textLarge,
  },
  decorators: [withDisplayDecorator],
};
