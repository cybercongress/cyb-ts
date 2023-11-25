import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MainContainer } from '../portal/components';
import { BOOT_ICON } from '../portal/utils';
import { PlayContent, PlayBanerContent as PlayBannerContent } from './pages';
import { ActionBar, ContainerGradientText } from '../../components';
import styles from './styles.module.scss';
import Carousel from 'components/Carousel/Carousel';
import Canvas from './components/canvasOne';

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
  {
    title: 'soft3',
    to: '/ipfs/QmTsBLAHC1Lk7n76GX4P3EvbAfNjBmZxwjknWy41SJZBGg',
  },
  {
    title: 'de-ai',
    to: '/ipfs/QmVcAr1wVdL17GfA5PXu9fHHk6NrpoWsxnb861P7CjoHbk',
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
  { title: <div className={styles.itemCarousel}>🟣 space-pussy</div> },
];

function Temple() {
  const [step, setStep] = useState(2);

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

        <ContainerGradientText noPaddingX color="green">
          <PlayBannerContent />

          <ul className={styles.itemLinks}>
            {itemLinks.map(({ to, title }) => (
              <li key={to}>
                <Link to={to}>{title}</Link>
              </li>
            ))}
          </ul>
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

      <ActionBar />
    </div>
  );
}

export default Temple;
