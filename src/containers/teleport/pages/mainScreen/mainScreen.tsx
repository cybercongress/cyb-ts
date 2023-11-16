import { MainContainer } from 'src/components';
import SwapAction from './SwapAction';
import SendAction from './SendAction';
import BridgeAction from './BridgeAction';
import AboutTeleport from './AboutTeleport';
import styles from './styles.module.scss';

function TeleportMainScreen() {
  return (
    <MainContainer width="100%">
      <div className={styles.MainScreenContainerContent}>
        <AboutTeleport />
        <div>
          <SendAction />
          <BridgeAction />
          <SwapAction />
        </div>
      </div>
    </MainContainer>
  );
}

export default TeleportMainScreen;
