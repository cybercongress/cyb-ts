import { Routes, Route } from 'react-router-dom';
import Swap from './swap/swap';
import Send from './send/send';
import Bridge from './bridge/bridge';
import TeleportMainScreen from './mainScreen/mainScreen';
import TeleportContextProvider from './Teleport.context';
import Relayer from './relayer/Relayer';

function TeleportRouter() {
  return (
    <Routes>
      <Route index element={<TeleportMainScreen />} />
      <Route path="swap" element={<Swap />} />
      <Route path="send" element={<Send />} />
      <Route path="bridge" element={<Bridge />} />
      <Route path="relayer" element={<Relayer />} />
    </Routes>
  );
}

function Teleport() {
  return (
    <TeleportContextProvider>
      <TeleportRouter />
    </TeleportContextProvider>
  );
}

export default Teleport;
