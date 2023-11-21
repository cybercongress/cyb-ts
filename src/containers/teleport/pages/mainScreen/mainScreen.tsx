import { MainContainer } from 'src/components';
import {
  SwapAction,
  SendAction,
  BridgeAction,
  AboutTeleport,
} from './components';
import styles from './MainScreen.module.scss';

function TeleportMainScreen() {
  return (
    <MainContainer width="100%">
      <div className={styles.container}>
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
