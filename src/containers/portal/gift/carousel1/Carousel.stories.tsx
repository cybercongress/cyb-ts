import { Meta, Story } from '@storybook/react';
import { useState } from 'react';
import Carousel, { Props } from './Carousel';

export default {
  title: 'Molecules/Carousel',
  component: Carousel,
  argTypes: {
    slides: {
      control: {
        type: 'array',
        defaultValue: [
          {
            title: 'Slide 1',
            step: 1,
          },
          {
            title: 'Slide 2',
            step: 2,
          },
          {
            title: 'Slide 3',
            step: 3,
          },
          {
            title: 'Slide 4',
            step: 4,
          },
          {
            title: 'Slide 5',
            step: 5,
          },
        ],
      },
    },
    speed: {
      control: {
        type: 'number',
      },
      defaultValue: 3000,
    },
    activeStep: {
      control: {
        type: 'number',
      },
      defaultValue: 1,
    },
    transitionSpeed: {
      control: {
        type: 'number',
      },
      defaultValue: 500,
    },
    slideWidth: {
      control: {
        type: 'number',
      },
      defaultValue: 200,
    },
    disableNext: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    disableMode: {
      control: {
        type: 'boolean',
      },
      defaultValue: false,
    },
    heightSlide: {
      control: {
        type: 'string',
      },
      defaultValue: '40px',
    },
  },
} as Meta;

const slides = [
  {
    title: 'Slide 1',
    step: 1,
  },
  {
    title: 'Slide 2',
    step: 2,
  },
  {
    title: 'Slide 3',
    step: 3,
  },
  {
    title: 'Slide 4',
    step: 4,
  },
  {
    title: 'Slide 5',
    step: 5,
  },
];

const Template: Story<Props> = (args) => {
  const [step, setStep] = useState(1);
  return (
    <Carousel
      {...args}
      setStep={() => setStep(step >= slides.length ? 0 : step + 1)}
      activeStep={step}
      slides={slides}
    />
  );
};

export const Default = Template.bind({});
