import { Meta, StoryObj, Story } from '@storybook/react';
import { useState } from 'react';
import Carousel, { Props } from './Carousel';

const meta: Meta<typeof Carousel> = {
  component: Carousel,
  title: 'molecules/carousels/CarouselOld',
  //   parameters: {
  //     design: {
  //       type: 'figma',
  //       url: 'https://www.figma.com/file/7i0Ly3YF587km0F8iDZod4/cyb?type=design&node-id=18318-21114',
  //     },
  //   },
};
export default meta;

type Story = StoryObj<typeof Carousel>;

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
