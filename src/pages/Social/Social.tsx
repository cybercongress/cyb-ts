import { MainContainer } from 'src/components';
import Discord from 'src/pages/Social/Discord/Discord';
import { GitHub } from 'src/pages/Social/GitHub/GitHub';
import { Telegram } from 'src/pages/Social/Telegram/Telegram';
import Twitter from './Twitter/Twitter';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import styles from './Social.module.scss';
import { useAdviser } from 'src/features/adviser/context';
import { useEffect } from 'react';

// TODO: folder is dirty, can be refactored
function Social() {
  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser('join community');
  }, [setAdviser]);

  return (
    <MainContainer>
      <Display title={<DisplayTitle title="Socials" />}>
        <div className={styles.wrapper}>
          <div className={styles.main}>
            <Discord />
            <Twitter />
          </div>

          <Telegram />

          <GitHub />
        </div>
      </Display>
    </MainContainer>
  );
}

export default Social;
