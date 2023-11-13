import { MainContainer } from 'src/components';
import SwapAction from './SwapAction';
import SendAction from './SendAction';
import BridgeAction from './BridgeAction';

function TeleportMainScreen() {
  return (
    <MainContainer>
      <SendAction />
      <BridgeAction />
      <SwapAction />
    </MainContainer>
  );
}

export default TeleportMainScreen;
