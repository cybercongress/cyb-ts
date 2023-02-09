import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { Play } from './pages';
import { MainContainer, ContainerGradient } from '../portal/components';
import Carousel from '../portal/gift/carousel1/Carousel';
// import Carousel from './components/corusel';
import { BOOT_ICON } from '../portal/utils';
import { PlayContent, PlayTitle } from './pages';

const itemCarousel = [
  { title: 'compute' },
  { title: 'earn' },
  { title: 'play' },
  { title: 'create' },
  { title: 'hack' },
];

const itemLinks = [
  { title: 'vision', to: '/search/vision' },
  { title: 'story', to: '/search/story' },
  { title: 'gift', to: '/search/gift' },
  { title: 'moon', to: '/search/moon' },
  { title: 'soft3', to: '/search/soft3' },
  { title: 'updates', to: '/search/updates' },
  { title: 'more..', to: '/search/more' },
];

const itemCarousel1 = [
  { title: <div style={{ color: '#777777' }}>🔵 cyber</div> },
  {
    title: (
      <div
        style={{
          height: '72px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '12px 0',
          alignItems: 'center',
        }}
      >
        <div style={{ fontSize: '30px', lineHeight: '26px' }}>
          {BOOT_ICON} bostrom
        </div>
        <div
          style={{
            background:
              'linear-gradient(90.05deg, rgb(118, 255, 3) 1.43%, rgb(0, 196, 255) 66.55%)',
            WebkitTextFillColor: 'transparent',
            WebkitBackgroundClip: 'text',
          }}
        >
          collaborative ai
        </div>
      </div>
    ),
  },
  { title: <div style={{ color: '#777777' }}>🟣 spase-pussy</div> },
];

function Temple() {
  const [step, setStep] = useState(3);
  return (
    <>
      <MainContainer width="82%">
        <Carousel
          slides={itemCarousel1}
          activeStep={2}
          setStep={setStep}
          slideWidth={266}
          disableMode
          heightSlide="72px"
        />

        <ContainerGradient
          userStyleContent={{ minHeight: '50px' }}
          togglingDisable
          title={<PlayTitle />}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#36D6AE',
              padding: '0 50px',
            }}
          >
            {itemLinks.map((item) => (
              <Link to={item.to}>
                <div>{item.title}</div>
              </Link>
            ))}
          </div>
        </ContainerGradient>

        <Carousel
          slides={itemCarousel}
          activeStep={step}
          setStep={setStep}
          slideWidth={266}
          disableMode
        />

        <PlayContent />
      </MainContainer>
    </>
  );
}

export default Temple;
