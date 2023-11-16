import { Meta } from '@storybook/react';
import imgKeplr from '../../../image/keplr-icon.svg';
import Slider, { SliderProps } from '.';
import { useState } from 'react';

export default {
  component: Slider,
  title: 'atoms/Slider',
} as Meta;

let currentPercents = 0;
let defaultTokenPair = {
  tokenA: 'boot',
  tokenB: 'h',
  priceA: 1,
  priceB: 0.01,
};

const defaultArgs: SliderProps = {
  valuePercents: 0,
  onChange: (percents) => {
    console.log('slider change', percents);
    currentPercents = percents;
  },
  onSwapClick: () => {
    console.log('button clicked');
  },
};

function Template(args: SliderProps) {
  return (
    <div
      style={{
        gap: 20,
        display: 'flex',
      }}
    >
      <Slider {...args} valuePercents={currentPercents} />
    </div>
  );
}

export const Default = Template.bind({});
Default.args = {
  ...defaultArgs,
};

export const Disabled = Template.bind({});
Disabled.args = {
  ...defaultArgs,
  disabled: true,
};

export const WithTokens = () => {
  const [tokenPairState, setTokenPairState] = useState(defaultTokenPair);

  const onSwapClickHandler = () =>
    setTokenPairState({
      tokenA: tokenPairState.tokenB,
      tokenB: tokenPairState.tokenA,
      priceA: tokenPairState.priceB,
      priceB: tokenPairState.priceA,
    });

  return (
    <Slider
      {...defaultArgs}
      tokenPair={tokenPairState}
      onSwapClick={onSwapClickHandler}
    />
  );
};
