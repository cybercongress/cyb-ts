import React, { useState } from 'react';
import { Link } from 'react-router-dom';
// import { Play } from './pages';
import { connect } from 'react-redux';
import { MainContainer, ContainerGradient } from '../portal/components';
// import Carousel from '../portal/gift/carousel1/Carousel';
import Carousel from './components/corusel';
import { BOOT_ICON } from '../portal/utils';
import { PlayContent, PlayTitle } from './pages';
import { ActionBar } from '../../components';
import BtnGrd from '../../components/btnGrd';
import useGetPassportByAddress from '../sigma/hooks/useGetPassportByAddress';

/*
const itemCarousel = [
  { title: 'compute' },
  { title: 'earn' },
  { title: 'play' },
  { title: 'create' },
  { title: 'hack' },
];
*/

const itemLinks = [
  { title: 'vision', to: '/ipfs/QmXzGkfxZV2fzpFmq7CjAYsYL1M581ZD4yuF9jztPVTpCn' },
  { title: 'story', to: '/genesis' },
  { title: 'gift', to: '/gift' },
  { title: 'moon code', to: '/ipfs/QmanZyMFnEti618crNPkn93g7MFaoDGrZ4Pta5drfdt9jb' },
  { title: 'more..', to: '/help' },
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

function Temple({ defaultAccount }) {
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [step, setStep] = useState(2);

  const showCoords = (event) => {
    const boxShadow = 0;

    const mX = event.pageX;
    const mY = event.pageY;
    const from = { x: mX, y: mY };

    console.log(from);

    const element = document.getElementById('github-bar');
    const off = element.getBoundingClientRect();
    const { width } = off;
    const { height } = off;
    // console.log('height', height);
    // console.log('width', width);

    const nx1 = off.left;
    const ny1 = off.top;
    const nx2 = nx1 + width;
    const ny2 = ny1 + height;
    const maxX1 = Math.max(mX, nx1);
    const minX2 = Math.min(mX, nx2);
    const maxY1 = Math.max(mY, ny1);
    const minY2 = Math.min(mY, ny2);
    const intersectX = minX2 >= maxX1;
    const intersectY = minY2 >= maxY1;
    const to = {
      x: intersectX ? mX : nx2 < mX ? nx2 : nx1,
      y: intersectY ? mY : ny2 < mY ? ny2 : ny1,
    };
    const distX = to.x - from.x;
    const distY = to.y - from.y;
    const hypot = Math.sqrt(distX * distX + distY * distY);
    console.log(hypot);
  };

  return (
    <div>
      <MainContainer width="82%">
        <Carousel
          slides={itemCarousel1}
          activeStep={1}
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
          // disableMode
        />

        <PlayContent />
      </MainContainer>
      {passport === null && (
        <ActionBar>
          <BtnGrd 
            onClick={() => handleClick('/portal')
            text="get citizenship"
          />
        </ActionBar>
      )}
    </div>
  );
}

const mapStateToProps = (store) => {
  return {
    defaultAccount: store.pocket.defaultAccount,
  };
};

export default connect(mapStateToProps)(Temple);
