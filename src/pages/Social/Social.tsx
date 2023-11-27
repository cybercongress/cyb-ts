import { MainContainer } from 'src/components';
import Discord from 'src/components/actionBar/Discord/Discord';
import { GitHub } from 'src/components/actionBar/GitHub';
import { Telegram } from 'src/components/actionBar/Telegram';
import Twitter from 'src/components/actionBar/Twitter/Twitter';

function Social() {
  return (
    <MainContainer>
      <div>Socials</div>

      <Telegram />
      <Discord />
      <Twitter />
      <GitHub />
    </MainContainer>
  );
}

export default Social;
