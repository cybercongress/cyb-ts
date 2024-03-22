import { LinkWindow, MainContainer } from 'src/components';
import Discord from 'src/pages/Social/Discord/Discord';
import { GitHub } from 'src/pages/Social/GitHub/GitHub';
import { Telegram } from 'src/pages/Social/Telegram/Telegram';
import Display from 'src/components/containerGradient/Display/Display';
import DisplayTitle from 'src/components/containerGradient/DisplayTitle/DisplayTitle';
import { useAdviser } from 'src/features/adviser/context';
import { useEffect } from 'react';
import Twitter from './Twitter/Twitter';
import styles from './Social.module.scss';

export const HUB_LINK = 'https://hackmd.io/J2P6k7ANT5GIXI3D1mPzrQ';

// TODO: folder is dirty, can be refactored
function Social() {
  const { setAdviser } = useAdviser();

  useEffect(() => {
    setAdviser('join our community!');
  }, [setAdviser]);

  return (
    <MainContainer>
      <Display title={<DisplayTitle title="Socials" />}>
        <div className={styles.wrapper}>
          <div className={styles.main}>
            <Discord />
            <Twitter />
            <Telegram />
          </div>

          <DisplayTitle inDisplay title="code" />

          <div className={styles.code}>
            <GitHub />
          </div>
          <br />
          <DisplayTitle inDisplay title="More links" />

          <LinkWindow className={styles.hubLinks} to={HUB_LINK}>
            <div>👾</div>
            <span>Hub links</span>
          </LinkWindow>

        </div>
      </Display>
    </MainContainer>
  );
}

export default Social;
