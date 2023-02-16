import React, { useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
// import { Play } from './pages';
import { connect } from 'react-redux';
import {
  MainContainer,
  ContainerGradient,
  ContainerGradientText,
} from '../portal/components';
// import Carousel from '../portal/gift/carousel1/Carousel';
import Carousel from './components/corusel';
import { BOOT_ICON } from '../portal/utils';
import { PlayContent, PlayBanerContent } from './pages';
import { ActionBar } from '../../components';
import BtnGrd from '../../components/btnGrd';
import useGetPassportByAddress from '../sigma/hooks/useGetPassportByAddress';
import Canvas from './components/canvasOne';
import styles from './styles.scss';

const itemCarousel = [
  { title: 'compute' },
  { title: 'earn' },
  { title: 'play' },
  { title: 'create' },
  { title: 'hack' },
];

const itemLinks = [
  {
    title: 'vision',
    to: '/ipfs/QmXzGkfxZV2fzpFmq7CjAYsYL1M581ZD4yuF9jztPVTpCn',
  },
  { title: 'story', to: '/genesis' },
  { title: 'gift', to: '/gift' },
  {
    title: 'moon code',
    to: '/ipfs/QmanZyMFnEti618crNPkn93g7MFaoDGrZ4Pta5drfdt9jb',
  },
  { title: 'more..', to: '/help' },
];

const itemCarousel1 = [
  { title: <div className={styles.itemCarousel}>🔵 cyber</div> },
  {
    title: (
      <div className={styles.itemCarouselBostrom}>
        <div className={styles.itemCarouselBostromText}>
          {BOOT_ICON} bostrom
        </div>
        <div className={styles.itemCarouselBostromDSC}>collaborative ai</div>
      </div>
    ),
  },
  { title: <div className={styles.itemCarousel}>🟣 spase-pussy</div> },
];

function Temple({ defaultAccount }) {
  const history = useHistory();
  const { passport } = useGetPassportByAddress(defaultAccount);

  const [step, setStep] = useState(2);

  const handleGetCitizenship = () => {
    history.push('/portal');
  };

  return (
    <div>
      <MainContainer width="82%">
        <Canvas />
        <Carousel
          slides={itemCarousel1}
          activeStep={1}
          setStep={setStep}
          disableMode
          heightSlide="80px"
        />

        <ContainerGradientText
          userStyleContent={{ padding: 0, paddingTop: 30 }}
          status="green"
        >
          <PlayBanerContent />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              color: '#36D6AE',
              padding: '10px 50px',
            }}
          >
            {itemLinks.map((item) => (
              <Link to={item.to}>
                <div>{item.title}</div>
              </Link>
            ))}
          </div>
        </ContainerGradientText>

        <Carousel
          slides={itemCarousel}
          activeStep={step}
          setStep={setStep}
          disableMode
          displaySlide={5}
        />

        <PlayContent />
      </MainContainer>
      {passport === null && (
        <ActionBar>
          <BtnGrd
            onClick={() => handleGetCitizenship()}
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
