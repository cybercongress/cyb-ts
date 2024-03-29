import { Routes, Route } from 'react-router-dom';
import Swap from './swap/swap';
import Send from './send/send';
import Bridge from './bridge/bridge';
import TeleportMainScreen from './mainScreen/TeleportMainScreen';
import Relayer from './relayer/Relayer';
import RelayerContextProvider from '../../contexts/relayer';
import TeleportContextProvider from './Teleport.context';
import Layout from './Layout/Layout';

function TeleportRouter() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<TeleportMainScreen />} />
        <Route path="swap" element={<Swap />} />
        <Route path="send" element={<Send />} />
        <Route path="bridge" element={<Bridge />} />
        <Route path="relayer" element={<Relayer />} />
      </Route>
    </Routes>
  );
}

function Teleport() {
  return (
    <TeleportContextProvider>
      <RelayerContextProvider>
        <TeleportRouter />
      </RelayerContextProvider>
    </TeleportContextProvider>
  );
}

export default Teleport;
